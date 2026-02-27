import QueryString from "qs"
import type { Simplify, Split } from "type-fest"
import type { ZodSchema } from "zod" // Optional, may be replaced with any schema
import { apiConfig } from "./api-config"

/** `"/user/:id"` => `{ params: { id: 1 } }` */
type ExtractParams<Path extends string> = Simplify<{
  [Segment in Split<Path, "/">[number]as Segment extends `:${infer Param}`
    ? Param
    : never]: string | number
}>

export interface APIConfig {
  baseURL: string
  auth?: {
    getToken?(): string | null
    onUnauthorized?(): void
  }
}

interface APIOptions<T = unknown, P extends string = string> {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  /** Accepts plain JS values, including `FormData`, `Blob`. */
  body?: unknown
  params?: ExtractParams<P> & Record<string, unknown>
  search?: unknown

  version?: number
  schema?: ZodSchema<T>
}

/**
 * @param endpoint - can be either full URL or just a path.
 */
export async function api<T, P extends string>(
  endpoint: P,
  options?: APIOptions<T, NoInfer<P>>,
): Promise<T | null> {
  const request = api.getRequest(endpoint, apiConfig, options)
  const response = await fetch(request)

  if (response.status === 401) apiConfig.auth.onUnauthorized()

  const data = await api.resolveResponse(response)
  const dataValidated = options?.schema?.parse(data)

  return dataValidated ?? data
}

/** @internal for tests only */
export namespace api {
  export function getRequest(
    endpoint: string,
    config: APIConfig,
    options: APIOptions | undefined,
  ): Request {
    const path = resolvePathParams(endpoint, options?.params)
    const url = new URL(path, config.baseURL)
    if (options?.search != null) {
      url.search = QueryString.stringify(options.search, {
        arrayFormat: "comma",
      })
    }

    const headers = new Headers()
    headers.set("Authorization", `Bearer ${config.auth?.getToken?.()}`)
    headers.set("Content-Type", "application/json")

    if (options?.body instanceof FormData) {
      headers.delete("Content-Type") // Allow special types of body to set content-type on its own to work properly.
    }

    return new Request(url, {
      ...options,
      body: resolveRequestBody(options?.body),
      headers,
    })
  }

  export function resolvePathParams(
    path: string,
    params?: Record<string, unknown>,
  ): string {
    if (params == null) return path

    for (const [key, value] of Object.entries(params)) {
      path = path.replaceAll(`:${key}`, value)
    }

    return path
  }

  export function resolveRequestBody(body: unknown) {
    if (body == null) return undefined

    if (body instanceof FormData) return body
    if (body instanceof Blob) return body

    return JSON.stringify(body)
  }

  export async function resolveResponse(response: Response) {
    if (response.ok === false) return null
    if (response.status === 204) return null
    if (response.status === 205) return null

    const responseJson = await response.json()
    return responseJson
  }
}
