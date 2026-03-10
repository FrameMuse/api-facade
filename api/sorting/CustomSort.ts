/**
 * **CustomSort** - Limited sortable fields per endpoint
 *
 * Instead of letting the API consumer sort by any field (full diversity),
 * the backend restricts which fields can be sorted. This is crucial when:
 * - Fields require expensive DB operations (computed fields, joins)
 * - Sorting by certain fields would expose internal structure
 * - Different endpoints expose different subsets of the same resource
 *
 * The consumer defines which fields matter to them, the endpoint decides
 * which of those it can actually sort by.
 */

import type { MultiSort } from "./MultiSort"

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

/**
 * Define allowed sortable fields for an endpoint.
 * Maps frontend-friendly names to actual backend properties.
 */
export interface SortDefinition {
  // Frontend key => backend property path
  [key: string]: string
}

export interface CustomSortField {
  field: keyof SortDefinition | string // Consumer only knows the frontend key
  direction: SortDirection
}

/**
 * Example: Users endpoint allows sorting by predefined fields only
 */
export const UsersSortDefinition: SortDefinition = {
  status: "status", // simple field
  createdAt: "createdAt",
  name: "profile.name", // nested field
  email: "email",
  // NOT exposing: "password", "internalId", etc.
}

/**
 * Example: Orders endpoint with fewer exposed fields
 */
export const OrdersSortDefinition: SortDefinition = {
  id: "id",
  createdAt: "createdAt",
  total: "totals.grand", // computed/nested
  status: "status",
  // Customer name is exposed but computed
  customerName: "customer.name",
}

/**
 * Validate and resolve frontend keys to backend properties.
 * Returns fields that are allowed, ignores unknown ones (safe approach).
 */
export function resolveCustomSort(
  sorts: CustomSortField[],
  definition: SortDefinition,
): Array<{ field: string; direction: SortDirection }> {
  return sorts
    .filter((sort) => sort.field in definition)
    .map((sort) => ({
      field: definition[sort.field as string],
      direction: sort.direction,
    }))
}

/**
 * Example usage:
 *
 * Frontend sends:
 * ```ts
 * const userSort: CustomSortField[] = [
 *   { field: "status", direction: "asc" },
 *   { field: "createdAt", direction: "desc" },
 *   { field: "password", direction: "asc" }, // Not in definition, ignored
 * ]
 * ```
 *
 * Backend resolves:
 * ```ts
 * const resolved = resolveCustomSort(userSort, UsersSortDefinition)
 * // => [
 * //   { field: "status", direction: "asc" },
 * //   { field: "createdAt", direction: "desc" },
 * // ]
 * ```
 *
 * Then builds query string as with MultiSort.buildStackedSort(resolved)
 */

/**
 * Stricter validation: throw error if unknown field is requested (fail‑fast).
 * Use this if you want to catch frontend bugs immediately.
 */
export function resolveCustomSortStrict(
  sorts: CustomSortField[],
  definition: SortDefinition,
): Array<{ field: string; direction: SortDirection }> {
  const unknownFields = sorts
    .map((s) => s.field)
    .filter((field) => !(field in definition))

  if (unknownFields.length > 0) {
    throw new Error(
      `Invalid sort fields: ${unknownFields.join(", ")}. ` +
      `Allowed: ${Object.keys(definition).join(", ")}`,
    )
  }

  return sorts.map((sort) => ({
    field: definition[sort.field as string],
    direction: sort.direction,
  }))
}

/**
 * Build a customizable endpoint that enforces sort restrictions.
 * This is a facade pattern - the restriction is transparent to the caller
 * but enforced on the API boundary.
 */
export class CustomSortedEndpoint {
  constructor(
    private apiPath: string,
    private sortDefinition: SortDefinition,
  ) { }

  buildQuery(
    sorts?: CustomSortField[],
    options: { strict?: boolean } = {},
  ): URLSearchParams {
    const params = new URLSearchParams()

    if (!sorts || sorts.length === 0) {
      return params
    }

    const resolved = options.strict
      ? resolveCustomSortStrict(sorts, this.sortDefinition)
      : resolveCustomSort(sorts, this.sortDefinition)

    // Use stacked format for clarity
    for (const sort of resolved) {
      params.append("sortBy", sort.field)
      params.append("sortOrder", sort.direction)
    }

    return params
  }
}

// Example:
// const usersEndpoint = new CustomSortedEndpoint("/api/users", UsersSortDefinition)
// const query = usersEndpoint.buildQuery([
//   { field: "status", direction: "asc" },
//   { field: "createdAt", direction: "desc" },
// ])
// => URLSearchParams with sortBy and sortOrder
