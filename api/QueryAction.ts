/* eslint-disable @typescript-eslint/no-explicit-any */

import { IsStringLiteral } from "type-fest"

import { isRecord } from "@/utils/common"

import BodyTypeUtils from "./BodyTypeUtils"
import Endpoint from "./Endpoint"
import QueryShape from "./QueryShape"
import { HTTPStatus, QueryParams, QueryRequest, QueryResponse, RequestMethod } from "./types"


class QueryAction<
  Path extends string = string,
  Method extends RequestMethod = RequestMethod,
  RequestBodyShape extends QueryShape = QueryShape,
  ResponsePayloadShape extends QueryShape = QueryShape,

  SearchParameters extends QueryParams = QueryParams,
> {
  method: Method
  endpoint: IsStringLiteral<Path> extends true ? Endpoint<Path> : Endpoint<any>

  requestBodyShape: RequestBodyShape
  responsePayloadShape: ResponsePayloadShape

  _request!: QueryRequest<Path, RequestBodyShape["_mixed"], SearchParameters>
  _response!: QueryResponse<ResponsePayloadShape["_resolved"]>

  constructor(config: {
    path: Path
    method: Method
    requestBodyShape: RequestBodyShape
    responsePayloadShape: ResponsePayloadShape
  }) {
    this.endpoint = new Endpoint(config.path)
    this.method = config.method
    this.requestBodyShape = config.requestBodyShape
    this.responsePayloadShape = config.responsePayloadShape
  }

  async toRequest(baseURL: URL | string, request?: this["_request"]): Promise<Request> {
    const url = this.endpoint.toURL(baseURL, {
      variables: request?.pathParams,
      queryParams: request?.queryParams
    })

    const body = await this.parseRequestBody(request?.body)
    const headers = request && this.resolveRequestHeaders(request)

    return new Request(url, {
      method: this.method,
      body,

      headers,
      signal: request?.abortSignal
    })
  }

  private async parseRequestBody(body: this["_request"]["body"] | null | undefined): Promise<BodyInit | null> {
    if (body == null) return null

    const bodyTransformed = await this.requestBodyShape.form(body, "required")
    const bodyInit = BodyTypeUtils.toBodyInit(bodyTransformed)

    return bodyInit
  }

  /**
   * Implicitly sets `"Content-Type"` according to `body` type.
   */
  private resolveRequestHeaders(request: this["_request"]): Headers {
    function resolveContentType(headers: Headers): void {
      const ContentType = headers.get("Content-Type")
      if (ContentType != null) return

      if (request?.body instanceof Array || isRecord(request?.body)) {
        headers.set("Content-Type", "application/json")
      }

      if (request?.body instanceof FormData) {
        // Remove `Content-Type` when `body` is `FormData` makes browser put `boundary` by itself.
        // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
        headers.delete("Content-Type")
      }
    }

    const headers = new Headers(request?.headers)
    resolveContentType(headers)
    return headers
  }

  public async resolveResponsePayload(response: Response): Promise<unknown> {
    if ([HTTPStatus.Accepted, HTTPStatus.NoContent].includes(response.status)) {
      return null
    }

    return await BodyTypeUtils.resolve(response, this.responsePayloadShape.type)
  }
}

export default QueryAction

export type QueryActionAny = QueryAction<any, any, any, any>
