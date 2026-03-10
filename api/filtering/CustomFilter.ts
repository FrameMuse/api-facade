/**
 * Custom Filter Definitions
 * 
 * Backend defines which fields can be filtered and how.
 * Frontend doesn't know the actual schema, only allowed filter names.
 * Provides encapsulation and prevents exposing internal data structure.
 * 
 * Example:
 * Frontend sends: { filters: { status: "active" } }
 * Backend maps: { status: "user.account_status" }
 * Database query: WHERE user.account_status = 'active'
 */

export type FilterOperator =
  | "eq" | "ne" | "gt" | "gte" | "lt" | "lte"
  | "in" | "nin" | "like" | "ilike" | "exists"

/**
 * Definition mapping frontend filter name to backend field path and allowed operators
 * 
 * Example:
 * {
 *   status: { field: "user.account_status", operators: ["eq", "ne", "in"] },
 *   name: { field: "profile.display_name", operators: ["like", "ilike"] },
 *   createdAfter: { field: "created_at", operators: ["gte"] },
 *   // NOT exposing: password, internalId, secretField, etc.
 * }
 */
export interface FilterDefinition {
  field: string
  operators: FilterOperator[]
  type?: "string" | "number" | "boolean" | "date"
  description?: string
}

export type FilterSchema = Record<string, FilterDefinition>

/**
 * Frontend request with user-friendly filter names
 */
export interface FilterRequest {
  filters: Record<string, unknown>
  // Could be structured as:
  // { status: "active" }  - single value (implies 'eq' operator)
  // { status: { eq: "active" } }  - explicit operator
  // { status: { in: ["active", "pending"] } }  - multiple values
}

/**
 * Backend-resolved filter ready for query execution
 */
export interface ResolvedFilter {
  field: string
  operator: FilterOperator
  value: any
}

/**
 * Validates that requested filters conform to schema and converts
 * frontend names to backend field paths
 */
export function validateAndResolveFilters(
  request: FilterRequest,
  schema: FilterSchema
): ResolvedFilter[] {
  const resolved: ResolvedFilter[] = []

  for (const [filterName, value] of Object.entries(request.filters)) {
    const definition = schema[filterName]

    // Filter not in schema - skip or throw depending on strictness
    if (!definition) {
      console.warn(`Unknown filter: ${filterName}`)
      continue
    }

    // Determine operator and value
    // If value is a primitive, assume 'eq' operator
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      if (!definition.operators.includes("eq")) {
        console.warn(`Filter ${filterName} does not support 'eq' operator`)
        continue
      }
      resolved.push({
        field: definition.field,
        operator: "eq",
        value,
      })
    }

    // If value is an object, extract operator and values
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>
      for (const [op, val] of Object.entries(obj)) {
        const operator = op as FilterOperator

        if (!definition.operators.includes(operator)) {
          console.warn(
            `Filter ${filterName} does not support '${operator}' operator`
          )
          continue
        }

        resolved.push({
          field: definition.field,
          operator,
          value: val,
        })
      }
    }

    // Array value - assume 'in' operator
    if (Array.isArray(value)) {
      if (!definition.operators.includes("in")) {
        console.warn(`Filter ${filterName} does not support 'in' operator`)
        continue
      }
      resolved.push({
        field: definition.field,
        operator: "in",
        value,
      })
    }
  }

  return resolved
}

/**
 * Apply resolved filters to a query
 * 
 * Example usage with different query builders:
 * - SQL: query.where(filter.field, operator, value)
 * - MongoDB: query.filter({ [filter.field]: { $op: value } })
 * - Elasticsearch: query.must({ range: { [filter.field]: value } })
 */
export function applyFilters(
  filters: ResolvedFilter[],
  query: any,
  maxFilters = 10
): any {
  // Limit number of filters to prevent expensive queries
  for (const filter of filters.slice(0, maxFilters)) {
    const { field, operator, value } = filter

    switch (operator) {
      case "eq":
        query = query.where(field, "=", value)
        break
      case "ne":
        query = query.where(field, "!=", value)
        break
      case "gt":
        query = query.where(field, ">", value)
        break
      case "gte":
        query = query.where(field, ">=", value)
        break
      case "lt":
        query = query.where(field, "<", value)
        break
      case "lte":
        query = query.where(field, "<=", value)
        break
      case "in":
        query = query.whereIn(field, Array.isArray(value) ? value : [value])
        break
      case "nin":
        query = query.whereNotIn(field, Array.isArray(value) ? value : [value])
        break
      case "like":
        query = query.where(field, "like", `%${value}%`)
        break
      case "ilike":
        query = query.where(field, "ilike", `%${value}%`)
        break
      case "exists":
        if (value) {
          query = query.whereNotNull(field)
        } else {
          query = query.whereNull(field)
        }
        break
    }
  }

  return query
}

/**
 * Different endpoints can have different filter definitions
 * This allows fine-grained control over what can be filtered where
 */
export const UsersSummaryFilters: FilterSchema = {
  status: {
    field: "status",
    operators: ["eq", "ne", "in"],
    type: "string",
    description: "User account status",
  },
  name: {
    field: "profile.display_name",
    operators: ["like", "ilike"],
    type: "string",
  },
  // Restricted set for performance
}

export const UsersDetailedFilters: FilterSchema = {
  ...UsersSummaryFilters,
  // Additional filters for detailed endpoint
  email: {
    field: "email",
    operators: ["eq", "like", "ilike"],
    type: "string",
  },
  createdAfter: {
    field: "created_at",
    operators: ["gte", "lte"],
    type: "date",
  },
  role: {
    field: "role",
    operators: ["eq", "in"],
    type: "string",
  },
  // NOT exposing: password, internalId, secretField, api_key, etc.
}

// Frontend usage
const requestSummary: FilterRequest = {
  filters: {
    status: { in: ["active", "pending"] },
    name: { ilike: "john" },
  },
}

const resolvedSummary = validateAndResolveFilters(
  requestSummary,
  UsersSummaryFilters
)
console.log("Resolved filters:", resolvedSummary)
// => [
//   { field: 'status', operator: 'in', value: ['active', 'pending'] },
//   { field: 'profile.display_name', operator: 'ilike', value: 'john' }
// ]

// Frontend requesting a field not in summary definition
const requestDetail: FilterRequest = {
  filters: {
    email: "test@example.com", // Available in detailed
    password: "secret", // NOT in schema - will be ignored
  },
}

const resolvedDetail = validateAndResolveFilters(requestDetail, UsersDetailedFilters)
console.log("Resolved (password ignored):", resolvedDetail)
// => [
//   { field: 'email', operator: 'eq', value: 'test@example.com' }
// ]
