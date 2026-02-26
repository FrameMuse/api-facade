# API Facade

"Facade" is a well-known pattern in software development,
which simply means creating a wrapper over something you want to **enhance** or **conceal**.

Wrapping API access is a very common practice across all web, mobile and desktop apps.
It helps to distinguish between generic and vital requests to web resources.

The actual backend may not be placed on a single address like `api.example.com`, but on many ones,
but that's absolutely unnecessary information for a developer. It doesn't help focusing on dedicated resposibilities.

The API term refers not only to external server, usually called "backend", but it can be local File System access
or anything your program "talks" to. Though this covers Web-based Resources specifically.

**API** is anything that is not a part of your program that your program needs to negotiate with.
Another name for API Facade is **API Client**.

## Role

API Facade hides details such as:

- Host names or any other static paths
- Request Method
- Resource Versions

API Facade helps with:

- Resolving path variables, e.g. `/user/{id}`
- Search Query building, e.g. `?sort=asc`
- Error handling
- Defining exact invoke points

Though it may do much more than that if this seems reasonable or worth trying out.

### Example

```ts
async function getData(path: string, search: Record<keyof never, string | number>) {
  try {
    const response = await fetch("https://api.example.com/data")
    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error === false) throw error

    console.error("Fetch failed: ", error.message)
    return null
  }
}
```

## Type Safety

To make your life easier and avoid constant looking into the backend code or the result of an endpoint,
you can provide types for resources you're going to be requesting.

You can do that by:

- Manually typing request and response for each resource, which can be tough but doable
- Automatically generating [OpenAPI Schemas](https://swagger.io/specification/) on backend and keeping it up-to-date on frontend
- Creating a library that provides the API facade based on generated OpenAPI Schemas 
- Using "monorepository", where both repositories are built together, which allows direct access to backend types via `import` 

The issues arise when a target resource returns a different data for any reasons.
This particular issue created a "very bad" practice of anotating each property as nullish,
which creates excesive type checking in every place of usage.

Moreover, the schemas may not be complete, they may contain mistakes or be created for a different content type.

## Response Validation

### Request Validation

The request doesn't need validation, especially if Type Safety is already in place.

A validation itself stops process entirely, but errors in the request is always a **developer mistake**.
Most often this mistake is very minor, it doesn't affect critical paths of the program, but it kills the user action entirely.
In some cases, user may not be authorized because of extra parameter in the request, which is absurd and thus should be avoided.

The best practice would be avoid request validation to encourage better types and backend error handling (and security).

## Content Type Conversion

## 
