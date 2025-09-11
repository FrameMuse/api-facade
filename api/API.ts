import { QueryClient } from "@tanstack/react-query"
import EventEmitter from "eventemitter3"
import { mapValues } from "lodash"
import { SwaggerDocs } from "openapi-schema-tools"
import { ZodError } from "zod"

import JWT from "@/utils/transform/jwt"

import QueryAction, { QueryActionAny } from "./QueryAction"
import QueryError from "./QueryError"
import QueryShape from "./QueryShape"
import QuerySwagger from "./QuerySwagger"
import { HeaderName, HTTPStatus, RequestMethod } from "./types"


interface APIConfig<Docs extends SwaggerDocs> {
  baseURL: string

  queryClient: QueryClient
  swagger: QuerySwagger<Docs>

  options?: IAPIOptions<Docs>
  default?: {
    headers?: Partial<Record<HeaderName, string>>
  }
}

interface IAPIOptions<Docs extends SwaggerDocs> {
  endpoint?: IAPIOptionsEndpoint
  response?: IAPIOptionsResponse
  request?: IAPIOptionsRequest<Docs>
  debug?: {
    /**
     * Whether to enable debug mode.
     *
     * @default
     * import.meta.env.MODE === "development"
     */
    enabled?: boolean

    /**
     * Whether to replace unsatisfied body with a mock.
     *
     * ### Description
     *
     * - `auto` - body will be mocked if body is capable to be mocked and there is a need.
     * - `always` - body always will be mocked if body is capable to be mocked even if there is no need.
     * - `never` - body never will be mocked.
     *
     * @default
     * "auto"
     */
    mock?: "auto" | "always" | "never"
  }
}

interface IAPIOptionsEndpoint {
  /**
   * Whether to add version to request url.
   *
   * @example
   * "https://example.com/my-endpoint" if false
   * "https://example.com/v1.0.0/my-endpoint" if true
   */
  includeVersion?: boolean
  /**
   * Whether to add slash on the end of an endpoint.
   *
   * @example
   * "/my-endpoint" if false
   * "/my-endpoint/" if true
   *
   * @example
   * "/my-endpoint?foo=bar" if false
   * "/my-endpoint/?foo=bar" if true
   */
  includeTrailingSlash?: boolean
}

interface IAPIOptionsResponse {
  statusCodeFromPayload?(payload: never): HTTPStatus
}

interface IAPIOptionsRequest<Docs extends SwaggerDocs> {
  security?: {
    /**
     * Whether to add token to request headers.
     */
    tokens?: {
      type?: "JWT"
      header: HeaderName
      read(): string | null | undefined
      refresh?(this: API<Docs>, expiredToken: string): Promise<string>
    }[]
  }
}

interface APIEvents {
  pending(action: QueryAction, request: Request): void
  success(action: QueryAction, request: Request): void
  error(action: QueryAction, request: Request, error: Error): void
  mocked(): void
}

class API<Docs extends SwaggerDocs> {
  private events: EventEmitter<APIEvents> = new EventEmitter
  private authorization = new APIAuthorization(this)

  swagger: this["config"]["swagger"]
  fetch: {
    [Method in RequestMethod]: {
      [Endpoint in keyof this["swagger"]["actions"][Method]]:
      <Action extends this["swagger"]["actions"][Method][Endpoint]>(request: Action["_request"]) => Promise<Action["_response"]>
    }
  }

  constructor(readonly config: APIConfig<Docs>) {
    this.swagger = config.swagger
    this.fetch = this.refineActions()
  }


  private async fetchAction<Action extends QueryActionAny>(action: Action, requestInfo?: Action["_request"]): Promise<Action["_response"]> {
    const request = await action.toRequest(this.config.baseURL, requestInfo)
    try {
      this.events.emit("pending", action, request)

      if (!requestInfo?.noSecurity) {
        await this.authorization.resolve(request.headers)
      }

      const response = await fetch(request)
      if (response.status >= 400) {
        throw await QueryError.fromResponse<{ message: string | string[] }>(response, payload => [payload.message].flat().toString())
      }

      const queryResponse = await this.createResponse(response, action)
      this.events.emit("success", action, request)
      return queryResponse
    } catch (error) {
      if (error instanceof Error) {
        this.events.emit("error", action, request, error)
      }
      throw error
    }
  }

  async query<Action extends QueryActionAny>(action: Action, requestInfo?: Action["_request"]): Promise<Action["_response"]> {
    // const url = action.endpoint.toURL(this.config.baseURL, {
    //   queryParams: requestInfo?.queryParams,
    //   variables: requestInfo?.queryParams
    // })

    // const queryKey = [...Endpoint.split(url.pathname), url.search]
    // const queryFn = () => this.fetchAction(action, requestInfo)

    // const options = { queryKey, queryFn } satisfies FetchQueryOptions
    // if (action.method === "")

    return await this.fetchAction(action, requestInfo)
  }

  private async createResponse<Action extends QueryAction>(response: Response, action: QueryAction): Promise<Action["_response"]> {
    try {
      const payload = await action.resolveResponsePayload(response)
      const payloadShaped = await this.shape(action.requestBodyShape, payload)

      return {
        payload: payloadShaped,
        status: response.status,
        headers: response.headers,

        nativeResponse: response
      }
    } catch (error) {
      if (error instanceof Error) {
        throw QueryError.from(error)
      }

      throw error
    }
  }

  private async shape<Shape extends QueryShape>(shape: Shape, value: Shape["schema"]["_partial"]): Promise<Shape["_resolved"]> {
    if (this.config.options?.debug?.mock === "never") return shape.form(value, "required")
    if (this.config.options?.debug?.mock === "always") return shape.schema.mock()

    try {
      // Default: "Auto"
      return shape.form(value, "mocked")
    } catch (error) {
      // "ZodError" means that error highly likely caused by `value` and `schema` mismatch.
      if (error instanceof ZodError) {
        this.events.emit("mocked")
        return shape.schema.mock()
      }

      throw error
    }
  }

  private refineActions() {
    const refinedActions = mapValues(this.swagger.actions, (chunk: Record<string, QueryActionAny>) => {
      return mapValues(chunk, (action) => {
        return (request: typeof action["_request"]) => this.query(action, request)
      })
    })

    return refinedActions as never
  }

  on<Name extends keyof APIEvents>(
    name: Name,
    listener: EventEmitter.EventListener<APIEvents, Name>
  ) {
    this.events.on(name, listener)
    return () => {
      this.events.off(name, listener)
    }
  }
}

export default API

/**
 * ## Authorization Life-Cycle
 *
 * *Authorization process runs on each request.*
 *
 * 1. Refreshes expired token.
 * 2. Batches all token refreshes.
 * 3. Resolves JWT token by assigning it to `Headers`.
 */
class APIAuthorization<Docs extends SwaggerDocs> {
  /**
   * Ensures updating token before it expires.
   */
  private static readonly RESERVED_TIME = 30_000

  private newTokenPromise: Promise<string> | null = null

  constructor(private readonly api: API<Docs>) { }

  private async ensureFreshJWT(): Promise<JWT | null> {
    // "Batching":
    // Wait for a previous refresh request.
    // The if block is REQUIRED to ensure synchronous runtime for concurrent queries.
    if (this.newTokenPromise != null) {
      await this.newTokenPromise
    }

    const securityTokens = this.api.config.options?.request?.security?.tokens
    const securityToken = securityTokens?.at(0)
    if (securityToken == null) return null

    const token = securityToken.read()
    if (token == null) return null

    const currentJWT = new JWT(token)
    if (currentJWT.expiryTime > APIAuthorization.RESERVED_TIME) return currentJWT
    if ((currentJWT.expiryTime + TOO_OLD_TOKEN) <= 0) return null

    if (securityToken.refresh == null) return currentJWT

    this.newTokenPromise = securityToken.refresh.call(this.api, currentJWT.token)
    const newToken = await this.newTokenPromise
    this.newTokenPromise = null
    return new JWT(newToken)
  }

  public async resolve(headers: Headers): Promise<void> {
    const jwt = await this.ensureFreshJWT()
    if (jwt == null) return

    headers.set("Authorization", jwt.authorization)
  }
}


const TOO_OLD_TOKEN = 15 * 24 * 60 * 60 * 1000
