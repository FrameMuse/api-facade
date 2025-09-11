import { trimStart } from "lodash"
import { Split, Trim } from "type-fest"

import { interpolate, isRecord } from "@/utils/common"
import { ExtractVariables, ReplaceVariables } from "@/utils/types"

import { QueryParams } from "./types"

type TrimLeftSlash<S extends string> = S extends `/${infer T}` ? TrimLeftSlash<T> : S
type TrimRightSlash<S extends string> = S extends `${infer T}/` ? TrimRightSlash<T> : S
/**
 * Removes `/` from start and end of a endpoint.
 */
type TrimSlash<T extends string> = TrimLeftSlash<TrimRightSlash<T>>

export type NormalizeEndpoint<T extends string> = `/${Trim<TrimLeftSlash<Trim<T>>>}`

interface EndpointConfig<Path extends string> {
  variables?: Record<ExtractVariables<Path>, unknown>
  queryParams?: QueryParams
}

export class Endpoint<Path extends string> {
  variables: ExtractVariables<Path>[]
  components: Split<TrimSlash<Path>, "/">

  constructor(readonly path: Path) {
    this.components = Endpoint.split(path)
    this.variables = Endpoint.extractVariables(path)
  }

  toURL(baseURL: URL | string, config?: EndpointConfig<Path>): URL {
    const url = new URL(this.path, baseURL)

    if (config?.variables) {
      url.pathname = Endpoint.resolveVariables(decodeURIComponent(url.pathname), config.variables)
    }
    if (config?.queryParams) {
      url.search = Endpoint.createQuery(config.queryParams)
    }

    return url
  }


  /**
   * Normalizes and then splits to components by `/`.
   */
  static split<Endpoint extends string>(endpoint: Endpoint): Split<TrimSlash<Endpoint>, "/"> {
    const normalized = this.normalize(endpoint)
    const components = normalized.split("/") as Split<TrimSlash<Endpoint>, "/">

    return components
  }

  /**
   * - Removes white spaces from sides.
   * - Adds slash to left if not presented, the right one is left untouched (This is by `URL.pathname` behavior).
   */
  static normalize<Endpoint extends string>(endpoint: Endpoint): NormalizeEndpoint<Endpoint> {
    let normalizedEndpoint: string = endpoint
    // Remove white spaces
    normalizedEndpoint = normalizedEndpoint.trim()
    // Removes slashes
    normalizedEndpoint = trimStart(normalizedEndpoint, "/").trim()
    // Adds slashes
    return `/${normalizedEndpoint}` as never
  }

  /**
   * Gets params from `path`.
   */
  static extractVariables<Path extends string>(path: Path): ExtractVariables<Path>[] {
    const matches = path.match(/{.*?}/g) as never
    return matches || []
  }

  /**
   * @param pathParams - Values will be transformed to string.
   */
  static resolveVariables<Path extends string, Params extends Record<ExtractVariables<Path>, string | number>>(path: Path, pathParams: Params): ReplaceVariables<Path, Params> {
    return interpolate(path, pathParams) as never
  }

  static parseQuery(query: string): Record<keyof never, unknown> {
    const queryObject: Record<keyof never, unknown> = {}
    const queryArray = query.split("&")

    for (const query of queryArray) {
      const [key, value] = query.split("=")
      if (key) {
        const decodedKey = decodeURIComponent(key)
        const decodedValue = decodeURIComponent(value || "")

        queryObject[decodedKey] = decodedValue
      }
    }

    return queryObject
  }

  /**
   * - Stringify objects and arrays
   * - Supports deep nesting
   *
   * @returns search query without `?`.
   * @example
   * { state1: 6, state2: "horse" } => "state1=6&state2=horse"
   */
  static createQuery(searchParams: Record<keyof never, unknown>): string {
    if (!searchParams || !Object.keys(searchParams).length) return ""

    const queryKeys = Object.keys(searchParams)
    const queryArray = queryKeys.map(key => {
      const value = searchParams[key]
      if (value) {
        if (isRecord(value)) {
          return this.createQuery(value)
        }

        return encodeURIComponent(key) + "=" + encodeURIComponent(String(value))
      }
      return ""
    })

    return queryArray.filter(Boolean).join("&")
  }
}

export default Endpoint
