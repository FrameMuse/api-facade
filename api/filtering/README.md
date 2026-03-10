# API Filtering

This directory contains multiple implementations of API filtering patterns, demonstrating different structural approaches and standards used across various frameworks.

## Files Overview

### [SimpleFilter.ts](./SimpleFilter.ts)

**Basic key-value filtering with implied equality**

- Simplest form: direct field-to-value mapping
- No operators needed
- Example: `?userId=42&status=active`
- Best for: Simple projects or basic filters
- Drawback: Can't express ranges, comparisons, or complex conditions

### [StackedFilter.ts](./StackedFilter.ts)

**Separate parameters for field, operator, and value**

Multiple notation styles:

1. **Django-style**: `?age__gte=18&status__ne=deleted`
   - Uses double underscore: `field__operator=value`
   - Most widely recognized due to Django ORM popularity

2. **Colon notation**: `?filter=age:gte:18&filter=status:ne:deleted`
   - More readable, separates concerns with colons
   - Less standard but easier to read

Pros:

- Clear semantic structure
- Works well for dynamic query building
- Familiar to Django developers

Cons:

- Requires parameter repetition in UI
- Less URL-compact for many filters

### [RecordFilter.ts](./RecordFilter.ts)

**Filters as nested objects (multiple serialization formats)**

JavaScript representation:

```ts
{
  "user.status": { ne: "deleted" },
  "age": { gte: 18 },
  "tags": { in: ["admin", "user"] }
}
```

Four serialization strategies:

1. **Bracket Notation**: `?filter[user.status][ne]=deleted&filter[age][gte]=18`
   - PHP/form-like syntax
   - Best supported across frameworks

2. **Compact Pairs**: `?filter=user.status:ne:deleted;age:gte:18`
   - Most URL-compact
   - Custom parsing required

3. **JSON Format**: `?filter={"user.status":{"ne":"deleted"},"age":{"gte":18}}`
   - Precise, handles complex types
   - Creates long URLs (often moved to body in POST requests)

4. **qs Library**: Automatic handling of all above formats
   - Recommended if `qs` is already a dependency
   - Used by Express, Next.js, many others

### [CustomFilter.ts](./CustomFilter.ts)

**Backend-restricted field definitions (like custom sorts)**

Backend defines which fields clients can filter:

```ts
const UserFilters = {
  status: { field: "user.account_status", operators: ["eq", "ne", "in"] },
  email: { field: "email", operators: ["like", "ilike"] },
  // NOT exposing: password, internalId, computedField, etc.
}
```

Frontend uses friendly names; backend maps to actual fields:

```ts
// Frontend sends: { status: "active" }
// Backend maps to: { "user.account_status": "active" }
```

Pros:

- Encapsulation and security
- Prevents expensive operations
- Backend controls schema contract
- Enables permission-based filtering

Cons:

- Requires API maintenance
- Less flexible for ad-hoc queries
- Need frontend/backend coordination

**Endpoint-based limits:**

```ts
const SummaryFilters = { status, name } // 2 fields
const DetailedFilters = { status, name, email, createdAt, role } // 5 fields
```

### [BackendHandling.ts](./BackendHandling.ts)

**Framework-specific parsing and application examples**

Includes implementations for:

- **Express + Knex.js**: Parsing Django-style and bracket notation, applying filters safely
- **FastAPI + SQLAlchemy**: Python async filter application
- **Rails + ActiveRecord**: Ruby ActiveRecord filter patterns
- **Django ORM**: Native `__lookup` support (most natural)
- **qs library**: Consistent parsing across frameworks
- **GraphQL**: Resolver filter handling

Also covers:

- **Security practices**: Whitelist validation, sanitization, operator validation
- **Performance**: Filter count limits, expensive field prevention
- **Error handling**: Invalid fields, unauthorized filters

## Comparison Table

| Approach | URL Example | Readability | URL Length | Standard | Custom Support |
|----------|---|---|---|---|---|
| Simple | `?status=active` | Excellent | Short | None | Bad |
| Django-style | `?age__gte=18&tags__in=a,b` | Good | Medium | Django | Medium |
| Stacked colon | `?filter=age:gte:18` | Excellent | Medium | No | Good |
| Bracket | `?filter[age][gte]=18` | Good | Long | PHP | Good |
| Compact pairs | `?filter=age:gte:18;tags:in:a,b` | Good | Short | No | Good |
| JSON | `?filter={"age":{"gte":18}}` | Fair | Very long | OpenAPI | Excellent |
| qs (auto) | Various | N/A | Varies | Node.js | Excellent |
| GraphQL | `{ filters: { age: {gte: 18} } }` | Excellent | N/A | GraphQL | Excellent |

## Design Decisions

### Full Diversity vs Custom Definitions

**Use full diversity** when:

- Small, internal APIs
- You control both frontend and backend
- Ad-hoc queries are common
- Flexibility > security is the priority

**Use custom definitions** when:

- Public APIs
- Scale and performance matter
- Internal schema should be hidden
- Preventing expensive queries is important
- Multiple endpoints with different filter sets

### Which serialization to choose?

- **Start simple**: Use Django-style for familiarity or colon-notation for clarity
- **Growing APIs**: Switch to bracket notation (widely supported)
- **Complex nested structures**: JSON in POST body (long URLs don't work well)
- **Already using qs?**: Use it everywhere for consistency
- **GraphQL**: Use native structured filters (no serialization concerns)

## Frontend Integration Examples

All implementations show complete frontend → backend flow:

```ts
// Frontend builds filter
const clientFilters: FilterRequest = {
  filters: {
    status: { in: ["active", "pending"] },
    email: { ilike: "test" }
  }
}

// Choose serialization strategy
const url = buildBracketFilter(clientFilters) // or Django, compact, etc.
const response = await fetch(`/api/users?${url}`)

// Backend parses, validates, resolves
const parsed = parseBracketFilter(new URLSearchParams(queryString))
const resolved = validateAndResolveFilters(parsed, FilterSchema)

// Apply to database query
let query = db.table("users")
query = applyFilters(query, resolved, FilterSchema)
const results = await query
```

## Standard References

- **Django ORM lookups**: Double-underscore syntax for operators
- **MongoDB/Mongoose**: Dollar-sign syntax `{ $gt, $in }` (MongoDB-native)
- **GraphQL**: Structured filter arguments (no serialization)
- **JSON:API**: Query parameter filtering recommendations
- **OpenAPI**: Filter examples and best practices
- **qs library**: De-facto standard for nested object serialization in Node.js
- **RQL (Resource Query Language)**: Standardized filter syntax specification

## Security Checklist

- [ ] Whitelist allowed fields on backend
- [ ] Validate operator support per field
- [ ] Type-check and sanitize values
- [ ] Limit filter count (max 10-15)
- [ ] Log unauthorized filter attempts
- [ ] Document filterable fields per endpoint
- [ ] Consider permission-based filtering
- [ ] Test for SQL injection patterns
