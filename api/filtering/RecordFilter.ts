/**
 * Record-Based Filtering (Object / Dictionary Notation)
 * 
 * Filters represented as nested objects mapping fields to operators to values.
 * Intuitive JavaScript representation, multiple serialization formats.
 * 
 * JavaScript representation:
 * {
 *   "user.status": { "ne": "deleted", "in": ["active", "pending"] },
 *   "age": { "gte": 18 },
 *   "email": { "ilike": "test" }
 * }
 * 
 * Can be serialized multiple ways: bracket notation, compact pairs, JSON, etc.
 */

export type FilterOperator =
  | "eq" | "ne" | "gt" | "gte" | "lt" | "lte"
  | "in" | "nin" | "like" | "ilike" | "exists"

export type FilterRecord = Record<string, Record<FilterOperator, string | string[]>>

/**
 * Option 1: Bracket Notation (PHP/Form-like)
 * URL: ?filter[user.status][ne]=deleted&filter[age][gte]=18&filter[tags][in]=admin,user
 * 
 * Pros: Familiar to many frameworks (Express, Laravel, Rails)
 * Cons: More verbose, requires careful URL encoding
 */
export function buildBracketFilter(filters: FilterRecord): URLSearchParams {
  const params = new URLSearchParams()

  for (const [field, operators] of Object.entries(filters)) {
    for (const [operator, value] of Object.entries(operators)) {
      const key = `filter[${field}][${operator}]`
      Array.isArray(value)
        ? params.set(key, value.join(","))
        : params.set(key, String(value))
    }
  }
  return params
}

export function parseBracketFilter(params: URLSearchParams): FilterRecord {
  const result: FilterRecord = {}

  for (const [key, value] of params) {
    // Match filter[field][operator] pattern
    const match = key.match(/^filter\[(.+?)\]\[(.+?)\]$/)
    if (!match) continue

    const [, field, operator] = match
    if (!result[field]) result[field] = {}

    const values = value.includes(",") ? value.split(",") : value
    result[field][operator as FilterOperator] = values
  }
  return result
}

/**
 * Option 2: Compact Pairs (Colon-separated)
 * URL: ?filter=user.status:ne:deleted;age:gte:18;tags:in:admin,user
 * 
 * Pros: Most compact, self-contained, readable
 * Cons: Requires custom parsing, ambiguous with colon in field names
 */
export function buildCompactFilter(filters: FilterRecord): URLSearchParams {
  const params = new URLSearchParams()
  const pairs: string[] = []

  for (const [field, operators] of Object.entries(filters)) {
    for (const [operator, value] of Object.entries(operators)) {
      const val = Array.isArray(value) ? value.join(",") : value
      pairs.push(`${field}:${operator}:${val}`)
    }
  }

  params.set("filter", pairs.join(";"))
  return params
}

export function parseCompactFilter(params: URLSearchParams): FilterRecord {
  const filterStr = params.get("filter")
  if (!filterStr) return {}

  const result: FilterRecord = {}

  for (const pair of filterStr.split(";")) {
    const [field, operator, value] = pair.split(":")
    if (!field || !operator) continue

    if (!result[field]) result[field] = {}
    const values = value.includes(",") ? value.split(",") : value
    result[field][operator as FilterOperator] = values
  }
  return result
}

/**
 * Option 3: JSON Format (MongoDB-like)
 * URL: ?filter={"user.status":{"ne":"deleted"},"age":{"gte":"18"},"tags":{"in":["admin","user"]}}
 * 
 * Pros: Precise, handles complex types natively, JSON-schema validation possible
 * Cons: URL length, requires URL encoding, parsing complexity
 */
export function buildJsonFilter(filters: FilterRecord): URLSearchParams {
  const params = new URLSearchParams()
  params.set("filter", JSON.stringify(filters))
  return params
}

export function parseJsonFilter(params: URLSearchParams): FilterRecord {
  const filterStr = params.get("filter")
  if (!filterStr) return {}

  try {
    return JSON.parse(filterStr) as FilterRecord
  } catch (e) {
    console.warn("Invalid filter JSON:", e)
    return {}
  }
}

/**
 * Option 4: Using qs library (recommended)
 * The qs library automatically handles nested object serialization
 * URL: ?filter[user.status][ne]=deleted&filter[age][gte]=18
 * 
 * Pros: Consistent across frontend/backend, handles all edge cases
 * Cons: Dependency on qs library
 */
export function buildQsFilter(filters: FilterRecord): string {
  // Simulated qs.stringify behavior
  const params = new URLSearchParams()

  for (const [field, operators] of Object.entries(filters)) {
    for (const [operator, value] of Object.entries(operators)) {
      const key = `filter[${field}][${operator}]`
      Array.isArray(value)
        ? params.set(key, value.join(","))
        : params.set(key, String(value))
    }
  }

  return params.toString()
}

// Frontend usage examples
const filters: FilterRecord = {
  "user.status": { ne: "deleted" },
  "age": { gte: "18" },
  "tags": { in: ["admin", "user", "moderator"] },
  "email": { ilike: "test" },
}

console.log("Bracket:", buildBracketFilter(filters).toString())
// => filter%5Buser.status%5D%5Bne%5D=deleted&filter%5Bage%5D%5Bgte%5D=18&filter%5Btags%5D%5Bin%5D=admin%2Cuser%2Cmoderator&filter%5Bemail%5D%5Bilike%5D=test

console.log("Compact:", buildCompactFilter(filters).toString())
// => filter=user.status%3Ane%3Adeleted%3Bage%3Agte%3A18%3Btags%3Ain%3Aadmin%2Cuser%2Cmoderator%3Bemail%3Ailike%3Atest

console.log("JSON:", buildJsonFilter(filters).toString())
// => filter=%7B%22user.status%22%3A%7B%22ne%22%3A%22deleted%22%7D%2C...%7D
