/**
 * Simple Key-Value Filtering
 * 
 * The most basic approach: direct field-to-value mapping.
 * Useful for exact matches and basic comparisons.
 * 
 * URL: ?userId=42&status=active&name=John
 */

export interface SimpleFilters {
  [key: string]: string | number | boolean | undefined
}

export function buildSimpleFilter(filters: SimpleFilters): URLSearchParams {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined) {
      params.set(k, String(v))
    }
  }
  return params
}

// Frontend usage example
const filters = {
  userId: 42,
  status: "active",
  archived: false,
  name: undefined, // Dropped
}

const url = `/api/users?${buildSimpleFilter(filters)}`
// => /api/users?userId=42&status=active&archived=false

/**
 * Backend parsing (Node.js / Express)
 */
export function parseSimpleFilter(params: URLSearchParams): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of params) {
    result[key] = value // Still a string; may need type coercion
  }
  return result
}

// Database query example
function applySimpleFilters(filters: Record<string, any>, query: any) {
  for (const [field, value] of Object.entries(filters)) {
    query = query.where(field, "=", value)
  }
  return query
}
