import { startCase } from "lodash"

import { HTTPStatus } from "./types"

class QueryError extends Error {
  constructor(message: string) {
    super(message)

    this.name = QueryError.name
  }

  static from(error: Error) {
    return new QueryError(error.message)
  }

  /**
   * Returns errors according to the `status`.
   */
  static fromStatus(status: HTTPStatus & number): QueryServerError | QueryClientError | QueryError {
    const message = startCase(HTTPStatus[status])

    if (status >= 500) {
      return new QueryServerError(message, status)
    }

    if (status >= 400) {
      return new QueryClientError(message, status)
    }

    return new QueryError(message)
  }

  /**
   * Returns errors according to the `status`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async fromResponse<T>(response: Response, messageSelector: (payload: T) => string): Promise<QueryServerError | QueryClientError | QueryError> {
    const payload = await response.json()

    const statusMessage = startCase(HTTPStatus[response.status])
    const selectedMessage = messageSelector(payload)

    function composeMessage() {
      if (statusMessage.toLowerCase() === selectedMessage.toLowerCase()) {
        return "no details"
      }

      return selectedMessage
    }

    const message = composeMessage()

    if (response.status >= 500) {
      return new QueryServerError(message, response.status)
    }

    if (response.status >= 400) {
      return new QueryClientError(message, response.status)
    }

    return new QueryError(message)
  }
}

export class QueryFetchError extends QueryError { }
export class QueryServerError extends QueryError {
  constructor(message: string, readonly status: number) {
    super(message)

    this.name = QueryServerError.name
  }
}
export class QueryClientError extends QueryError {
  constructor(message: string, readonly status: number) {
    super(message)

    this.name = QueryClientError.name
  }
}

export default QueryError
