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
- Request Headers
- Resource Versions

API Facade helps with:

- Resolving path variables, e.g. `/user/{id}`
- Search Query building, e.g. `?sort=asc`
- Error handling
- Defining exact invoke points

> [!Note]
> Though it may do much more than that if this seems reasonable or worth trying out.

### Example

```ts
async function getData(path: string | URL, searchParams?: Record<keyof never, string | number>) {
  const url = new URL(path, env.HOST)
  url.searchParams = searchParams

  try {
    const response = await fetch(url)
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

Generally, the API Facade should make it as simple to access a reousrce as calling a regular function.

## Type Safety

To make your life easier and avoid constant looking into the backend code or the result of an endpoint,
you can provide types for resources you're going to be requesting.

You can do that by:

- Manually typing request and response for each resource, which can be tough but doable
- Automatically generating [OpenAPI Schemas](https://swagger.io/specification/) on backend and keeping it up-to-date on frontend
- Automatically generating types and functions based on OpenAPI Schemas, e.g. by [openapi-codegen](https://github.com/fabien0102/openapi-codegen) (unofficial tool)
- Creating a library that provides the API facade based on generated OpenAPI Schemas 
- Using "monorepository", where both repositories are built together, which allows direct access to backend types via `import` from frontend

### Caveats

When a resource returns a different data for any reasons, the types become irrelevant.

This particular issue created a "very bad" practice of _anotating each property as nullish_,
which creates excesive type checking in every place of usage.

Moreover, the schemas may not be complete, they may contain mistakes or be created for a different content type.
That's why you need to read the next section.

## Response Validation

To make sure that data that a server responded with matches the same

### Caveats
_nothing is perfect_

If server is updated first, while client remains unupdated - the pipe is broken, the user is unhappy.
If frontend is updated first - the same happens too. This can be healed with _anotating each property as nullish_, which leads to you-know-what (read in the previous section). Another cure is to define what is tolerable for your app and what is vital, this way is a good balance between strict and lazy validation.

### Best Practices

Don't create validation problems for yourself.
Don't validate the reponse aggressively in production: don't throw errors, remove unknown properties, ignore nulish mismatch and log warnning on value<->type mismatch.
Let the error happen later in the code to hint where the data wasn't deliveted to, this will help with debugging in production.

In development (debug) mode, log the errors and maybe make "toasts" to see something is wrong immediately.
Of course, you can allow them being thrown as well, that's up to you to decide what is more convient for you in development.

Make sure the backend (or remote) server has tests if response mismatch happens too often in the same place.

And remember that response mismatch is always backend issue, you don't need to torture frontend (or your server), it can't ensure response.
You should only well-type and create safe guards if something doesn't work out as it's planned, but it shouldn't crash your app/server,
instead it should keep it going.

### Request Validation

The request doesn't need validation, especially if Type Safety is already in place.

A validation itself stops process entirely, but errors in the request is always a **developer mistake** either from one side or another.
As you may already read in the previous section - errors should not be thrown in production but only in development.

Most often this mistake is very minor, it doesn't affect critical paths of the program, but it kills the user action entirely if strict validation is in place.
In some cases, user may not be authorized because of extra parameter in the request, which is absurd and thus should be avoided.

The best practice would be avoid request validation at all to encourage better types on frontend + security and error handling on backend.

## Content Type Conversion

## Path Params Resolving

## Search Query Building

### Sorting
### Filtering

## HTTP Status Handling

## Error Handling

### Throw vs [Error, Result]
### Custom Codes

## Notifications

### Messages
### Localization

## API Collection Types

### Endpoint-based
### Named
### Resource-sliced

## Implementations

There are several primary ways of implementing API Client (API Facade).

|Name||
|---|---|
|Action-based||
|Endpoint path as argument||
|Endpoint path as property||
