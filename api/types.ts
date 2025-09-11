import { JsonValue, Primitive } from "type-fest"

import { ExtractVariables } from "@/utils/types"

import QueryError from "./QueryError"

export type Version = `${number}.${number}.${number}${string}`

export type RequestMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "PURGE"
  | "LINK"
  | "UNLINK"

/**
 * Inferred from `Body` interface.
 */
export type BodyType =
  | "arrayBuffer"
  | "blob"
  | "formData"
  | "json"
  | "text"
export interface BodyTypeMap {
  arrayBuffer: ArrayBuffer
  blob: Blob
  formData: FormData
  json: JsonValue
  text: string
}
export type BodyTypeValues<ExcludeJson extends boolean = false> =
  ExcludeJson extends true
  ? BodyTypeMap[Exclude<BodyType, "json">]
  : BodyTypeMap[BodyType]

export type ContentEncoding =
  | "ascii"
  | "ansi"
  | "binary"
  | "base64"
  | "base64url"
  | "hex"
  | "latin1"
  | "ucs-2"
  | "ucs2"
  | "utf-8"
  | "utf8"
  | "utf16le"

export type PathParams<K extends string> = Record<K, string | number>
export type QueryParams = Record<keyof never, Primitive>


export interface QueryRequest<Path extends string = string, Body = unknown, QParams extends QueryParams = QueryParams> {
  /**
   * Params that fit right into the path.
   *
   * @example
   * { user_id: 1 } // ==> "/user/{user_id}" ==> "/user/1"
   */
  pathParams?: PathParams<ExtractVariables<Path>>
  /**
   * A URL search query parameters.
   *
   * @example
   * { array: [{ bar: "bar" }, { foo: "foo" }], plain: "string" }
   * // => "?array=bar:bar,foo:foo&plain=string"
   */
  queryParams?: QParams
  // method: RequestMethod | Uppercase<RequestMethod>
  /**
   * Content that may be sent by `POST`, `PATCH` and `PUT` request.
   */
  body?: Body
  headers?: Headers | Record<string, string>
  abortSignal?: AbortSignal

  /**
   * Flag to avoid authorization resolving for current request.
   *
   * - Helps to prevent problems with token refreshing (i.e. infinite refreshing, too old token).
   */
  noSecurity?: boolean
}

export interface QueryResponse<Payload = unknown> {
  status: number
  headers: Headers
  payload: Payload
  nativeResponse: Response
}

export type QueryResponseSafe<Payload = unknown> = QueryResponseSuccess<Payload> | QueryResponseError

export interface QueryResponseSuccess<Payload = unknown> {
  status: number
  headers: Headers
  payload: Payload
  error: null
  nativeResponse: Response
}

export interface QueryResponseError {
  payload: null
  error: QueryError
}

export interface HTTPErrorOptions extends ErrorOptions {
  statusCode?: HTTPStatus
}
export class HTTPError extends Error {
  statusCode?: HTTPStatus
  constructor(message: string, options: HTTPErrorOptions) {
    super(message, options)

    this.name = "HTTPError"
    this.statusCode = options.statusCode
  }
}

export enum HTTPStatus {
  // 1xx Informational
  /**
   * ### Informational
   *
   * The server has received the request headers and the client should proceed to send the request body (in the case of a request for which a body needs to be sent; for example, a POST request).
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100
   */
  Continue = 100,
  /**
   * ### Informational
   *
   * The requester has asked the server to switch protocols and the server has agreed to do so.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/101
   */
  SwitchingProtocols = 101,
  /**
   * ### Informational
   *
   * A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request.
   * This code indicates that the server has received and is processing the request, but no response is available yet.
   * This prevents the client from timing out and assuming the request was lost.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/102
   */
  Processing = 102,
  /**
   * ### Informational
   *
   * Used to return some response headers before final HTTP message.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103
   */
  EarlyHints = 103,

  // 2xx Success
  /**
   * ### Success
   *
   * Standard response for successful HTTP requests.
   * The actual response will depend on the request method used.
   *
   * - In a GET request, the response will contain an entity corresponding to the requested resource.
   * - In a POST request, the response will contain an entity describing or containing the result of the action.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
   */
  OK = 200,
  /**
   * ### Success
   *
   * The request has been fulfilled, resulting in the creation of a new resource.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  */
  Created = 201,
  /**
   * ### Success
   *
   * The request has been accepted for processing, but the processing has not been completed.
   * The request might or might not be eventually acted upon, and may be disallowed when processing occurs.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202
  */
  Accepted = 202,
  /**
   * ### Success
   *
   * The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin's response.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/203
  */
  NonAuthoritativeInformation = 203,
  /**
   * ### Success
   *
   * The server successfully processed the request and is not returning any content.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
  */
  NoContent = 204,
  /**
   * ### Success
   *
   * The server successfully processed the request, but is not returning any content.
   * Unlike a 204 response, this response requires that the requester reset the document view.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/205
  */
  ResetContent = 205,
  /**
   * ### Success
   *
   * The server is delivering only part of the resource (byte serving) due to a range header sent by the client.
   * The range header is used by HTTP clients to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206
  */
  PartialContent = 206,
  /**
   * ### Success
   *
   * The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/207
  */
  MultiStatus = 207,
  /**
   * ### Success
   *
   * The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.
  */
  AlreadyReported = 208,
  /**
   * ### Success
   *
   * In the context of delta encodings, the HTTP 226 IM Used status code is set by the server to indicate that it is returning a delta to the GET request that it received.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/226
  */
  IMUsed = 226,

  // 3xx Redirection
  /**
   * Indicates multiple options for the resource that the client may follow.
   * It, for instance, could be used to present different format options for video, list files with different extensions, or word sense disambiguation.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/300
   */
  MultipleChoices = 300,
  /**
   * This and all future requests should be directed to the given URI.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301
   */
  MovedPermanently = 301,
  /**
   * Tells the client to look at (browse to) another URL.
   * 302 has been superseded by 303 and 307.
   * This is an example of industry practice contradicting the standard.
   * The HTTP/1.0 specification (RFC 1945) required the client to perform a temporary redirect (the original describing phrase was "Moved Temporarily"),[21] but popular browsers implemented 302 with the functionality of a 303 See Other.
   * Therefore, HTTP/1.1 added status codes 303 and 307 to distinguish between the two behaviours.[22] However, some Web applications and frameworks use the 302 status code as if it were the 303.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302
   */
  Found = 302,
  /**
   * The response to the request can be found under another URI using a GET method.
   * When received in response to a POST (or PUT/DELETE), the client should presume that the server has received the data and should issue a redirect with a separate GET message.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303
   */
  SeeOther = 303,
  /**
   * Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.
   * In such case, there is no need to retransmit the resource since the client still has a previously-downloaded copy.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304
   */
  NotModified = 304,
  /**
   * The requested resource is available only through a proxy, the address for which is provided in the response.
   * Many HTTP clients (such as Mozilla[25] and Internet Explorer) do not correctly handle responses with this status code, primarily for security reasons.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/305
   */
  UseProxy = 305,
  /**
   * No longer used.
   * Originally meant "Subsequent requests should use the specified proxy."
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/306
   */
  SwitchProxy = 306,
  /**
   * In this case, the request should be repeated with another URI; however, future requests can still use the original URI.
   * In contrast to how 302 was historically implemented, the request method is not allowed to be changed when reissuing the original request.
   * For instance, a POST request should be repeated using another POST request.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307
   */
  TemporaryRedirect = 307,
  /**
   * The request and all future requests should be repeated using another URI.
   * 307 and 308 parallel the behaviours of 302 and 301, but do not allow the HTTP method to change.
   * So, for example, submitting a form to a permanently redirected resource may continue smoothly.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308
   */
  PermanentRedirect = 308,

  // 4xx Client Error
  /**
   * The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
   */
  BadRequest = 400,
  /**
   * Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
   * The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource.
   * See Basic access authentication and Digest access authentication.
   * 401 semantically means "unauthenticated",[33] i.e. the user does not have the necessary credentials.
   * Note: Some sites incorrectly issue HTTP 401 when an IP address is banned from the website (usually the website domain) and that specific address is refused permission to access a website.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
  */
  Unauthorized = 401,
  /**
   * Reserved for future use.
   *
   * The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, but that has not happened, and this code is not usually used.
   *
   * - Google Developers API uses this status if a particular developer has exceeded the daily limit on requests.
   * - Sipgate uses this code if an account does not have sufficient funds to start a call.
   * - Shopify uses this code when the store has not paid their fees and is temporarily disabled.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402
  */
  PaymentRequired = 402,
  /**
   * The request was a valid request, but the server is refusing to respond to it.
   * Unlike a 401 Unauthorized response, authenticating will make no difference.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
  */
  Forbidden = 403,
  /**
   * The requested resource could not be found but may be available in the future.
   * Subsequent requests by the client are permissible.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
  */
  NotFound = 404,
  /**
   * A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
  */
  MethodNotAllowed = 405,
  /**
   * The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
   * See Content negotiation.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406
  */
  NotAcceptable = 406,
  /**
   * Similar to 401 Unauthorized, but it indicates that the client needs to authenticate itself in order to use a proxy.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407
  */
  ProxyAuthenticationRequired = 407,
  /**
   * The server did not receive a complete request message within the time that it was prepared to wait.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408
  */
  RequestTimeout = 408,
  /**
   * Indicates that the request could not be processed because of conflict in the request, such as an edit conflict in the case of multiple updates.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
  */
  Conflict = 409,
  /**
   * Indicates that the resource requested is no longer available and will not be available again.
   * This should be used when a resource has been intentionally removed and the resource should be purged.
   * Upon receiving a 410 status code, the client should not request the resource in the future.
   *
   * Clients such as search engines should remove the resource from their indices.
   * Most use cases do not require clients and search engines to purge the resource, and a "404 Not Found" may be used instead.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410
  */
  Gone = 410,
  /**
   * The request did not specify the length of its content, which is required by the requested resource.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/411
  */
  LengthRequired = 411,
  /**
   * The client has indicated preconditions in its headers which the server does not meet.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
  */
  PreconditionFailed = 412,
  /**
   * The request is larger than the server is willing or able to process.
   * Previously called "Request Entity Too Large".
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413
  */
  PayloadTooLarge = 413,
  /**
   * The URI provided was too long for the server to process.
   * Often the result of too much data being encoded as a query-string of a GET request, in which case it should be converted to a POST request.
   * Called "Request-URI Too Long" previously.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414
  */
  URITooLong = 414,
  /**
   * The media format of the requested data is not supported by the server, so the server is rejecting the request.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415
  */
  UnsupportedMediaType = 415,
  /**
   * The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.
   * For example, if the client asked for a part of the file that lies beyond the end of the file.
   * Called "Requested Range Not Satisfiable" previously.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416
  */
  RangeNotSatisfiable = 416,
  /**
   * The expectation given in the request's Expect header field could not be met by at least one of the inbound servers.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417
  */
  ExpectationFailed = 417,
  /**
   * This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers.
   * The RFC specifies this code should be returned by teapots requested to brew coffee.
   * This HTTP status is used as an easter egg in some websites, including Google.com.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
  */
  ImATeapot = 418,
  /**
   * The request was directed at a server that is not able to produce a response (for example because of connection reuse).
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/421
  */
  MisdirectedRequest = 421,
  /**
   * The request was well-formed but was unable to be followed due to semantic errors.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
  */
  UnprocessableEntity = 422,
  /**
   * The resource that is being accessed is locked.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/423
  */
  Locked = 423,
  /**
   * The request failed due to failure of a previous request (e.g., a PROPPATCH).
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/424
  */
  FailedDependency = 424,
  /**
   * Indicates that the server is unwilling to risk processing a request that might be replayed.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425
  */
  TooEarly = 425,
  /**
   * The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426
  */
  UpgradeRequired = 426,
  /**
   * The origin server requires the request to be conditional.
   * Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428
  */
  PreconditionRequired = 428,
  /**
   * The user has sent too many requests in a given amount of time ("rate limiting").
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
   */
  TooManyRequests = 429,
  /**
   * The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431
  */
  RequestHeaderFieldsTooLarge = 431,
  /**
   * A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.
   * The code 451 was chosen as a reference to the novel Fahrenheit 451 (see the Acknowledgements in the RFC).
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451
  */
  UnavailableForLegalReasons = 451,

  // 5xx Server Error
  /**
   * A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
   */
  InternalServerError = 500,
  /**
   * The server either does not recognize the request method, or it lacks the ability to fulfil the request.
   * Usually this implies future availability (e.g., a new feature of a web-service API).
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501
  */
  NotImplemented = 501,
  /**
   * The server was acting as a gateway or proxy and received an invalid response from the upstream server.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502
  */
  BadGateway = 502,
  /**
   * The server is currently unavailable (because it is overloaded or down for maintenance).
   * Generally, this is a temporary state.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
  */
  ServiceUnavailable = 503,
  /**
   * The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
  */
  GatewayTimeout = 504,
  /**
   * The server does not support the HTTP protocol version used in the request.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505
  */
  HTTPVersionNotSupported = 505,
  /**
   * Transparent content negotiation for the request results in a circular reference.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506
  */
  VariantAlsoNegotiates = 506,
  /**
   * The server is unable to store the representation needed to complete the request.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/507
  */
  InsufficientStorage = 507,
  /**
   * The server detected an infinite loop while processing the request (sent in lieu of 208 Already Reported).
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
  */
  LoopDetected = 508,
  /**
   * Further extensions to the request are required for the server to fulfil it.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510
  */
  NotExtended = 510,
  /**
   * The client needs to authenticate to gain network access.
   * Intended for use by intercepting proxies used to control access to the network (e.g., "captive portals" used to require agreement to Terms of Service before granting full Internet access via a Wi-Fi hotspot).
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511
  */
  NetworkAuthenticationRequired = 511,

  // Unofficial Codes
  /**
   * Used by the Laravel Framework when a CSRF Token is missing or expired.
   *
   * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#Unofficial_codes
   */
  PageExpired = 419,
  /**
   * A deprecated response used by the Spring Framework when a method has failed.
   * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#Unofficial_codes
   */
  MethodFailure = 420,
  /**
   * Used by Shopify, instead of the 429 Too Many Requests response code, when too many URLs are requested within a certain time frame.
   * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#Unofficial_codes
   */
  RequestHeaderTooLarge = 430,
  /**
   * The Microsoft extension code indicated when Windows Parental Controls are turned on and are blocking access to the requested webpage.
   * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#Unofficial_codes
   */
  BlockedByWindowsParentalControls = 450,
  /**
   * Returned by ArcGIS for Server. Code 498 indicates an expired or otherwise invalid token.
   * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#Unofficial_codes
   */
  InvalidToken = 498,
  /**
   * Returned by ArcGIS for Server. Code 499 indicates that a token is required but was not submitted.
   * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#Unofficial_codes
   */
  TokenRequired = 499,
  /**
   * Used when the client has closed the request before the server could send a response.
   * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#Unofficial_codes
   */
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  ClientClosedRequest = 499,
}


export type RequestHeaderName =
  | "Accept-Ch"
  | "Accept-Charset"
  | "Accept-Encoding"
  | "Accept-Language"
  | "Accept-Patch"
  | "Accept-Post"
  | "Accept-Ranges"
  | "Accept"
  | "Access-Control-Allow-Credentials"
  | "Access-Control-Allow-Headers"
  | "Access-Control-Allow-Methods"
  | "Access-Control-Allow-Origin"
  | "Access-Control-Expose-Headers"
  | "Access-Control-Max-Age"
  | "Access-Control-Request-Headers"
  | "Access-Control-Request-Method"
  | "Age"
  | "Allow"
  | "Alt-Svc"
  | "Authorization"

export type ResponseHeaderName =
  | "Accept-Patch"
  | "Accept-Ranges"
  | "Access-Control-Allow-Credentials"
  | "Access-Control-Allow-Headers"
  | "Access-Control-Allow-Methods"
  | "Access-Control-Allow-Origin"
  | "Access-Control-Expose-Headers"
  | "Access-Control-Max-Age"
  | "Access-Control-Request-Headers"
  | "Access-Control-Request-Method"
  | "Age"
  | "Allow"
  | "Alt-Svc"
  | "Cache-Control"
  | "Connection"
  | "Content-Disposition"
  | "Content-Encoding"
  | "Content-Language"
  | "Content-Length"
  | "Content-Location"
  | "Content-Range"
  | "Content-Security-Policy"
  | "Content-Security-Policy-Report-Only"
  | "Content-Type"
  | "Date"
  | "ETag"
  | "Expires"
  | "Feature-Policy"
  | "Last-Modified"
  | "Link"
  | "Location"
  | "P3P"
  | "Pragma"
  | "Public-Key-Pins"
  | "Public-Key-Pins-Report-Only"
  | "Referrer-Policy"
  | "Retry-After"
  | "Server"
  | "Set-Cookie"
  | "Strict-Transport-Security"
  | "Tk"
  | "Trailer"
  | "Transfer-Encoding"
  | "Upgrade-Insecure-Requests"
  | "Vary"
  | "Via"
  | "Warning"
  | "WWW-Authenticate"
  | "X-Content-Type-Options"
  | "X-DNS-Prefetch-Control"
  | "X-Frame-Options"
  | "X-XSS-Protection"

export type HeaderName = RequestHeaderName | ResponseHeaderName
