/**
 * **SortQuery** - Simple single-field sorting
 *
 * This is the most basic form where the consumer specifies a field and direction.
 * The API accepts the full property path (dot-chained) and decides whether to allow it.
 *
 * Usage:
 *   `GET /users?sortBy=status&sortOrder=asc`
 */

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface SimpleSortOptions {
  sortBy?: string // e.g., "status", "user.createdAt"
  sortOrder?: SortDirection
}

export function buildSimpleSort(sort?: SimpleSortOptions): URLSearchParams {
  const params = new URLSearchParams()

  if (sort?.sortBy) {
    params.set("sortBy", sort.sortBy)
  }

  if (sort?.sortOrder) {
    params.set("sortOrder", sort.sortOrder)
  }

  return params
}
