/**
 * **MultiSort** - Multiple sort fields with multiple serialization formats:
 *
 * 1. **Stacked params** (repeated query params)
 *    `GET /users?sortBy=status&sortBy=createdAt&sortOrder=asc&sortOrder=desc`
 *    Pros: Clear semantics, order is preserved
 *    Cons: Params must match in length, slightly verbose
 *
 * 2. **Array-like format** (comma-separated or other delimiters)
 *    `GET /users?sortBy=status,createdAt&sortOrder=asc,desc`
 *    Pros: Compact, easier to read single query string
 *    Cons: Requires agreed-upon delimiter, order still implicit
 *
 * 3. **Compact/Pair format** (field:direction pairs)
 *    `GET /users?sort=status:asc,createdAt:desc`
 *    Pros: Most compact, self-contained
 *    Cons: Requires parsing field:direction
 *
 * 4. **Record/Object formats** (field => direction mapping)
 *    Multiple serialization options:
 *    - Compact pairs: `?sort=status:asc,createdAt:desc`
 *    - Stacked pairs: `?sort=status:asc&sort=createdAt:desc`
 *    - Bracket notation: `?sort[status]=asc&sort[createdAt]=desc`
 *    - `qs` library: passing object directly, library handles serialization
 *    Pros: Intuitive object structure, libraries handle encoding
 *    Cons: More complex parsing on backend
 */

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface SortField {
  field: string // e.g., "status", "user.createdAt", "meta.rating"
  direction: SortDirection
}

/**
 * Record type: field => direction mapping
 * e.g., { "status": "asc", "user.createdAt": "desc" }
 */
export type SortRecord = Record<string, SortDirection | string>

/**
 * Stacked params approach - multiple `sortBy` and `sortOrder` params
 */
export function buildStackedSort(sorts: SortField[]): URLSearchParams {
  const params = new URLSearchParams()

  for (const sort of sorts) {
    params.append("sortBy", sort.field)
    params.append("sortOrder", sort.direction)
  }

  return params
}

// Example:
// buildStackedSort([
//   { field: "status", direction: SortDirection.ASC },
//   { field: "createdAt", direction: SortDirection.DESC },
// ])
// => "sortBy=status&sortOrder=asc&sortBy=createdAt&sortOrder=desc"

/**
 * Array-like format - comma-separated fields and orders
 */
export function buildArraySort(sorts: SortField[], delimiter = ","): URLSearchParams {
  const params = new URLSearchParams()

  if (sorts.length > 0) {
    params.set("sortBy", sorts.map((s) => s.field).join(delimiter))
    params.set("sortOrder", sorts.map((s) => s.direction).join(delimiter))
  }

  return params
}

// Example:
// buildArraySort([
//   { field: "status", direction: SortDirection.ASC },
//   { field: "createdAt", direction: SortDirection.DESC },
// ])
// => "sortBy=status,createdAt&sortOrder=asc,desc"

/**
 * Compact format - single param with field:direction pairs
 * `GET /users?sort=status:asc,createdAt:desc`
 */
export function buildCompactSort(sorts: SortField[]): URLSearchParams {
  const params = new URLSearchParams()

  if (sorts.length > 0) {
    params.set(
      "sort",
      sorts.map((s) => `${s.field}:${s.direction}`).join(","),
    )
  }

  return params
}

// Example:
// buildCompactSort([
//   { field: "status", direction: SortDirection.ASC },
//   { field: "createdAt", direction: SortDirection.DESC },
// ])
// => "sort=status:asc,createdAt:desc"

/**
 * Parsing back from query string (stacked format)
 */
export function parseStackedSort(params: URLSearchParams): SortField[] {
  const sortBys = params.getAll("sortBy")
  const sortOrders = params.getAll("sortOrder") as SortDirection[]

  return sortBys.map((field, idx) => ({
    field,
    direction: sortOrders[idx] || SortDirection.ASC,
  }))
}

/**
 * Parsing back from query string (array/compact format)
 */
export function parseArraySort(params: URLSearchParams, delimiter = ","): SortField[] {
  const sortBy = params.get("sortBy")?.split(delimiter) || []
  const sortOrder = params.get("sortOrder")?.split(delimiter) as SortDirection[] || []

  return sortBy.map((field, idx) => ({
    field,
    direction: sortOrder[idx] || SortDirection.ASC,
  }))
}

export function parseCompactSort(params: URLSearchParams): SortField[] {
  const sort = params.get("sort") || ""

  return sort
    .split(",")
    .filter(Boolean)
    .map((pair) => {
      const [field, direction] = pair.split(":")
      return {
        field: field || "",
        direction: (direction as SortDirection) || SortDirection.ASC,
      }
    })
}

/**
 * **Record-based sorting** - Field => Direction mapping
 *
 * Instead of arrays of {field, direction}, use a plain object:
 * { "status": "asc", "user.createdAt": "desc" }
 *
 * This is more intuitive and can be serialized multiple ways.
 */

/**
 * Convert SortField[] to SortRecord
 */
export function fieldsToRecord(sorts: SortField[]): SortRecord {
  const record: SortRecord = {}
  for (const sort of sorts) {
    record[sort.field] = sort.direction
  }
  return record
}

/**
 * Convert SortRecord to SortField[]
 * Preserves iteration order (modern JS objects maintain insertion order)
 */
export function recordToFields(record: SortRecord): SortField[] {
  return Object.entries(record).map(([field, direction]) => ({
    field,
    direction: direction as SortDirection,
  }))
}

/**
 * Option 1: Compact pairs format
 * `?sort=status:asc,user.createdAt:desc`
 *
 * Converts record to comma-separated field:direction pairs
 */
export function buildRecordCompactSort(record: SortRecord): URLSearchParams {
  const params = new URLSearchParams()

  if (Object.keys(record).length > 0) {
    params.set(
      "sort",
      Object.entries(record)
        .map(([field, direction]) => `${field}:${direction}`)
        .join(","),
    )
  }

  return params
}

// Example:
// buildRecordCompactSort({ "status": "asc", "createdAt": "desc" })
// => "sort=status:asc,createdAt:desc"

/**
 * Option 2: Stacked pairs format
 * `?sort=status:asc&sort=user.createdAt:desc`
 *
 * Repeated params, each containing one field:direction pair
 */
export function buildRecordStackedSort(record: SortRecord): URLSearchParams {
  const params = new URLSearchParams()

  for (const [field, direction] of Object.entries(record)) {
    params.append("sort", `${field}:${direction}`)
  }

  return params
}

// Example:
// buildRecordStackedSort({ "status": "asc", "createdAt": "desc" })
// => "sort=status:asc&sort=createdAt:desc"

/**
 * Option 3: Bracket notation format
 * `?sort[status]=asc&sort[user.createdAt]=desc`
 *
 * Uses array-like bracket notation, where the field name is the key
 * Note: URLSearchParams doesn't natively support this, manual string building required
 */
export function buildRecordBracketSort(record: SortRecord): string {
  return Object.entries(record)
    .map(
      ([field, direction]) =>
        `sort[${encodeURIComponent(field)}]=${encodeURIComponent(direction as string)}`,
    )
    .join("&")
}

// Example:
// buildRecordBracketSort({ "status": "asc", "user.createdAt": "desc" })
// => "sort%5Bstatus%5D=asc&sort%5Buser.createdAt%5D=desc"
// (decoded: "sort[status]=asc&sort[user.createdAt]=desc")

/**
 * Option 4: Using `qs` library
 *
 * The `qs` library (commonly used in Express, UmiJS, etc.) can serialize objects
 * directly using various formats. Pass the record and let the library handle encoding:
 *
 * import qs from "qs"
 *
 * qs.stringify({ sort: record }, { arrayFormat: "repeat" })
 * // => "sort=status%3Aasc&sort=createdAt%3Adesc" (stacked format)
 *
 * qs.stringify({ sort: record }, { arrayFormat: "brackets" })
 * // => "sort%5Bstatus%5D=asc&sort%5BcreatedAt%5D=desc" (bracket notation)
 *
 * qs.stringify({ sort: record }, { arrayFormat: "indices" })
 * // => "sort%5B0%5D%5Bfield%5D=status&sort%5B0%5D%5Bdirection%5D=asc" (nested)
 *
 * qs.stringify({ sort: record }, { arrayFormat: "comma" })
 * // => "sort=status%2Casc%2CcreatedAt%2Cdesc" (comma-separated)
 *
 * The `qs` library handles all encoding/decoding, making it ideal for complex structures.
 * This is the recommended approach if your project already uses `qs`.
 */

/**
 * Parse compact pairs: `sort=status:asc,createdAt:desc`
 */
export function parseRecordCompactSort(params: URLSearchParams): SortRecord {
  const sort = params.get("sort") || ""
  const record: SortRecord = {}

  sort
    .split(",")
    .filter(Boolean)
    .forEach((pair) => {
      const [field, direction] = pair.split(":")
      if (field) {
        record[field] = (direction as SortDirection) || SortDirection.ASC
      }
    })

  return record
}

/**
 * Parse stacked pairs: `sort=status:asc&sort=createdAt:desc`
 */
export function parseRecordStackedSort(params: URLSearchParams): SortRecord {
  const sorts = params.getAll("sort")
  const record: SortRecord = {}

  for (const pair of sorts) {
    const [field, direction] = pair.split(":")
    if (field) {
      record[field] = (direction as SortDirection) || SortDirection.ASC
    }
  }

  return record
}

/**
 * Parse bracket notation: `sort[status]=asc&sort[createdAt]=desc`
 * Returns the record directly since bracket notation already uses field names as keys
 */
export function parseRecordBracketSort(
  params: URLSearchParams | Record<string, any>,
): SortRecord {
  // If params is already an object (from `qs.parse`), use it directly
  if (!(params instanceof URLSearchParams)) {
    return params as SortRecord
  }

  // Manual parsing for URLSearchParams with bracket notation
  // This requires iterating through keys matching `sort[*]`
  const record: SortRecord = {}

  for (const key of params.keys()) {
    const match = key.match(/^sort\[(.+)\]$/)
    if (match) {
      const field = match[1]
      record[field] = params.get(key) as SortDirection
    }
  }

  return record
}

