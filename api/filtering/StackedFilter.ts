/**
 * Stacked Params Filtering
 * 
 * Each filter is a separate parameter. Similar to how sortBy/sortOrder work.
 * Common in frameworks like Django ORM and Rails.
 * 
 * URL: ?filter=user.status:active&filter=age__gt:18&filter=tags__in:admin,user
 * 
 * Format variations:
 * - Django style: ?field__operator=value (e.g., age__gt=18)
 * - Colon notation: ?filter=field:operator:value (e.g., filter=age:gt:18)
 * - Bracket notation: ?filter[field]=value&filter[operator]=gt
 */

export type FilterOperator =
  | "eq"    // equals
  | "ne"    // not equals
  | "gt"    // greater than
  | "gte"   // greater than or equal
  | "lt"    // less than
  | "lte"   // less than or equal
  | "in"    // in list
  | "nin"   // not in list
  | "like"  // contains (string)
  | "ilike" // case-insensitive contains
  | "exists" // field exists (boolean)

export interface StackedFilterItem {
  field: string
  operator: FilterOperator
  value: string | string[]
}

/**
 * Django-style: Uses double underscore for operator (__gt, __in, etc.)
 * Example: age__gt=18&tags__in=admin,user&status__ne=deleted
 */
export function buildDjangoFilter(filters: StackedFilterItem[]): URLSearchParams {
  const params = new URLSearchParams()
  const operatorMap: Record<FilterOperator, string> = {
    eq: "",        // No operator for equality
    ne: "__ne",
    gt: "__gt",
    gte: "__gte",
    lt: "__lt",
    lte: "__lte",
    in: "__in",
    nin: "__nin",
    like: "__icontains",
    ilike: "__icontains",
    exists: "__exists",
  }

  for (const filter of filters) {
    const op = operatorMap[filter.operator]
    const key = filter.field + op
    Array.isArray(filter.value)
      ? params.set(key, filter.value.join(","))
      : params.set(key, filter.value)
  }
  return params
}

export function parseDjangoFilter(params: URLSearchParams): StackedFilterItem[] {
  const filters: StackedFilterItem[] = []
  const operatorMap: Record<string, FilterOperator> = {
    "": "eq",
    "__ne": "ne",
    "__gt": "gt",
    "__gte": "gte",
    "__lt": "lt",
    "__lte": "lte",
    "__in": "in",
    "__nin": "nin",
    "__icontains": "like",
    "__exists": "exists",
  }

  for (const [key, value] of params) {
    // Match field__operator pattern
    let field = key
    let operator: FilterOperator = "eq"

    for (const [op, opName] of Object.entries(operatorMap)) {
      if (key.endsWith(op)) {
        field = key.slice(0, -op.length)
        operator = opName
        break
      }
    }

    const values = value.includes(",") ? value.split(",") : value
    filters.push({ field, operator, value: values })
  }
  return filters
}

/**
 * Colon notation: Uses colons to separate field, operator, and value
 * Example: ?filter=age:gt:18&filter=tags:in:admin,user
 */
export function buildColonFilter(filters: StackedFilterItem[]): URLSearchParams {
  const params = new URLSearchParams()
  const index = new Map<string, number>() // Track repeated filters

  for (const filter of filters) {
    const value = Array.isArray(filter.value)
      ? filter.value.join(",")
      : filter.value

    // Key can be repeated or suffixed for stacking
    const currentIndex = (index.get(filter.field) ?? 0) + 1
    index.set(filter.field, currentIndex)

    const pair = `${filter.field}:${filter.operator}:${value}`

    // Use numeric suffix or just append duplicates
    if (currentIndex === 1) {
      params.set("filter", pair)
    } else {
      // Append with delimiter or use array-like notation
      const existing = params.get("filter") || ""
      params.set("filter", existing ? `${existing};${pair}` : pair)
    }
  }
  return params
}

export function parseColonFilter(params: URLSearchParams): StackedFilterItem[] {
  const filterStr = params.get("filter")
  if (!filterStr) return []

  return filterStr.split(";").map(pair => {
    const [field, operator, value] = pair.split(":")
    const values = value.includes(",") ? value.split(",") : value
    return {
      field,
      operator: operator as FilterOperator,
      value: values,
    }
  })
}

// Frontend usage
const filters: StackedFilterItem[] = [
  { field: "user.status", operator: "ne", value: "deleted" },
  { field: "age", operator: "gte", value: "18" },
  { field: "tags", operator: "in", value: ["admin", "user", "moderator"] },
  { field: "email", operator: "ilike", value: "test" },
]

console.log("Django:", buildDjangoFilter(filters).toString())
// => user.status__ne=deleted&age__gte=18&tags__in=admin,user,moderator&email__icontains=test

console.log("Colon:", buildColonFilter(filters).toString())
// => filter=user.status:ne:deleted;age:gte:18;tags:in:admin,user,moderator;email:ilike:test
