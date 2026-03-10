/**
 * **Backend Handling** - Parsing and processing different sort query formats
 *
 * The backend needs to handle various serialization formats from different clients.
 * This file shows examples for popular backend frameworks.
 */

import type { SortDirection, SortField, SortRecord } from "./MultiSort"

/**
 * ============================================================================
 * NODEJS / EXPRESS WITH `qs` LIBRARY
 * ============================================================================
 */

// Recommended approach: use `qs` to parse automatically
// npm install qs @types/qs

// Express middleware example:
/*
import qs from 'qs'

app.get('/api/users', (req, res) => {
  // Parse query string with qs (handles all formats)
  const query = qs.parse(req.url.split('?')[1])

  // query.sort can be:
  //   - { status: 'asc', createdAt: 'desc' }  (bracket or object notation)
  //   - ['status:asc', 'createdAt:desc']       (stacked pairs)
  //   - 'status:asc,createdAt:desc'            (compact pairs)

  const sorts = normalizeSorts(query.sort)
  // => SortField[]
})

function normalizeSorts(sort: unknown): SortField[] {
  if (!sort) return []

  // If object: { field: direction, ... }
  if (typeof sort === 'object' && !Array.isArray(sort)) {
    return Object.entries(sort as Record<string, unknown>).map(([field, direction]) => ({
      field,
      direction: (direction as string).toLowerCase() as SortDirection,
    }))
  }

  // If array of pairs: ['field:asc', 'status:desc']
  if (Array.isArray(sort)) {
    return sort
      .map(s => {
        const [field, direction] = String(s).split(':')
        return { field, direction: (direction || 'asc') as SortDirection }
      })
      .filter(s => s.field)
  }

  // If string: single pair or comma-separated (shouldn't happen with qs)
  if (typeof sort === 'string') {
    return sort
      .split(',')
      .map(s => {
        const [field, direction] = s.split(':')
        return { field, direction: (direction || 'asc') as SortDirection }
      })
      .filter(s => s.field)
  }

  return []
}
*/

/**
 * ============================================================================
 * PYTHON / FLASK
 * ============================================================================
 */

// Python example (pseudocode):
/*
from flask import Flask, request
from urllib.parse import parse_qs

@app.route('/api/users')
def list_users():
    # parse_qs returns lists for repeated params
    query = parse_qs(request.query_string.decode())

    # Different formats:
    # Compact: ?sort=status:asc,createdAt:desc
    #   query['sort'] = ['status:asc,createdAt:desc']
    #
    # Stacked: ?sort=status:asc&sort=createdAt:desc
    #   query['sort'] = ['status:asc', 'createdAt:desc']
    #
    # Bracket: ?sort[status]=asc&sort[createdAt]=desc
    #   query['sort[status]'] = ['asc']
    #   query['sort[createdAt]'] = ['desc']

    sorts = normalize_sorts(query.get('sort', []))
    return fetch_users(sorts)

def normalize_sorts(sort_values):
    if not sort_values:
        return []

    sorts = []

    # Check if first value contains colons (pair format)
    if sort_values and ':' in sort_values[0]:
        # Could be compact (comma-separated) or stacked
        for val in sort_values:
            # Handle both "field:direction" and "field1:dir1,field2:dir2"
            for pair in val.split(','):
                if ':' in pair:
                    field, direction = pair.split(':', 1)
                    sorts.append({'field': field, 'direction': direction})

    return sorts
*/

/**
 * ============================================================================
 * DENO / FRESH / OAK
 * ============================================================================
 */

// Deno example (pseudocode):
/*
import { parse } from 'https://deno.land/std@0.208.0/url/parse.ts'

export const handler: Handlers = {
  GET(req, _ctx) {
    const url = new URL(req.url)
    const sortParam = url.searchParams.get('sort')

    // If using qs library equivalent for Deno:
    // const query = parse(url.search)

    const sorts = normalizeSorts(sortParam)
    // Process sorts
  }
}

function normalizeSorts(sort: string | null): SortField[] {
  if (!sort) return []

  // Handle comma-separated pairs
  return sort
    .split(',')
    .map(pair => {
      const [field, direction] = pair.split(':')
      return { field, direction: (direction || 'asc') as SortDirection }
    })
    .filter(s => s.field)
}
*/

/**
 * ============================================================================
 * DATABASE QUERY BUILDING
 * ============================================================================
 *
 * Once normalized to SortField[], use with your ORM/query builder.
 */

// TypeORM / TypeORM example:
/*
async function listUsers(sorts: SortField[]): Promise<User[]> {
  let query = User.createQueryBuilder('user')

  // Build ORDER BY clauses
  for (const sort of sorts) {
    const [alias, ...fieldPath] = sort.field.split('.')
    const column = fieldPath.join('.')

    // Validate field is in sort definition (CustomSort approach)
    if (!ALLOWED_SORT_FIELDS.includes(sort.field)) {
      continue // Skip unauthorized fields
    }

    query = query.addOrderBy(
      `${alias}.${column}`,
      sort.direction.toUpperCase()
    )
  }

  return query.getMany()
}

const ALLOWED_SORT_FIELDS = ['status', 'createdAt', 'name']
*/

// Prisma example:
/*
async function listUsers(sorts: SortField[]) {
  const orderBy = sorts
    .filter(s => ALLOWED_SORT_FIELDS.includes(s.field))
    .map(s => ({
      [s.field]: s.direction
    }))

  return prisma.user.findMany({
    orderBy: orderBy.length > 0 ? orderBy : undefined,
  })
}

const ALLOWED_SORT_FIELDS = ['status', 'createdAt', 'name']
*/

// Raw SQL example:
/*
async function listUsers(sorts: SortField[]): Promise<User[]> {
  let query = 'SELECT * FROM users'

  if (sorts.length > 0) {
    const orderClauses = sorts
      .filter(s => isValidField(s.field))
      .map(s => `${s.field} ${s.direction.toUpperCase()}`)

    if (orderClauses.length > 0) {
      query += ' ORDER BY ' + orderClauses.join(', ')
    }
  }

  return db.query(query)
}

function isValidField(field: string): boolean {
  const ALLOWED = ['status', 'created_at', 'name']
  // SQL injection protection: whitelist fields
  return ALLOWED.includes(field.toLowerCase())
}
*/

/**
 * ============================================================================
 * VALIDATION AND SECURITY CONSIDERATIONS
 * ============================================================================
 *
 * 1. **Always whitelist allowed fields**
 *    Never directly insert sort fields into WHERE/ORDER BY clauses.
 *    Use CustomSort definitions or explicit field lists.
 *
 * 2. **Validate direction values**
 *    Ensure direction is 'asc' or 'desc', normalize to uppercase/lowercase
 *    as your database requires.
 *
 * 3. **Handle nested fields carefully**
 *    If allowing dot-chained paths like "user.createdAt", validate
 *    that the relationship exists and is readable by the user.
 *
 * 4. **Set limits**
 *    Don't allow sorting by unlimited fields; enforce a maximum
 *    (e.g., max 3 sort fields) to prevent expensive queries.
 *
 * 5. **Consider expensive operations**
 *    Some fields may require JOINs or computation. Restrict these
 *    or add query optimization hints (indexes, preloading).
 */

// Example validation function:
/*
function validateSorts(
  sorts: SortField[],
  allowedFields: string[],
  maxSorts = 3
): SortField[] {
  if (sorts.length > maxSorts) {
    console.warn(`Too many sort fields (${sorts.length}), limiting to ${maxSorts}`)
    sorts = sorts.slice(0, maxSorts)
  }
  
  return sorts.filter(sort => {
    const isAllowed = allowedFields.includes(sort.field)
    if (!isAllowed) {
      console.warn(`Unauthorized sort field: ${sort.field}`)
    }
    return isAllowed
  })
}
*/
