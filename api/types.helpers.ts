import { BodyType, BodyTypeMap } from "./types"


export type ResolveBodyType<CT extends BodyType, T = unknown> = CT extends "json" ? T : BodyTypeMap[CT]


/**
 * Extracts path components (`/`) from `string`.
 *
 * @example
 * type Path = "/users/{userId}/purchases/{purchaseId}"
 * type Components = PathComponents<Path> // ["users", "{userId}", "purchases", "{purchaseId}"]
 */
export type PathComponents<T extends string> =
  T extends `${infer S}`
  ? S extends `${infer Head}/${infer Tail}`
  ? [Head, ...PathComponents<Tail>]
  : 1
  : string[]
