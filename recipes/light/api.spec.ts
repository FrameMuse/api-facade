import { describe, expect, it } from "bun:test" // or other test suites.
import { api } from "./api"

describe("api.getRequest", () => {
  it("replaces path parameters and uses search for query string (arrays comma-joined)", () => {
    const config = {
      baseURL: "https://api.example.com",
      auth: { getToken: () => "t" },
    }
    const request = api.getRequest("/campaigns/:id", config, {
      params: { id: 123 },
      search: { tags: ["a", "b"], filter: "active" },
    })
    expect(request.url).toBe("https://api.example.com/campaigns/123?tags=a%2Cb&filter=active")
  })

  it("builds URL with search params only when no path parameters", () => {
    const config = {
      baseURL: "https://api.example.com",
      auth: { getToken: () => "t" },
    }
    const request = api.getRequest("/path", config, {
      search: { id: 1, tags: ["a", "b"] },
    })
    expect(request.url).toBe("https://api.example.com/path?id=1&tags=a%2Cb")
  })

  it("sets Authorization and Content-Type headers for JSON by default", () => {
    const config = {
      baseURL: "https://api.example.com",
      auth: { getToken: () => "tok" },
    }
    const request = api.getRequest("/h", config, {
      method: "POST",
      body: { a: 1 },
    })
    expect(request.headers.get("Authorization")).toBe("Bearer tok")
    expect(request.headers.get("Content-Type")).toBe("application/json")
  })

  it("sets Content-Type (multipart/form-data with boundary) when body is FormData", () => {
    const config = {
      baseURL: "https://api.example.com",
      auth: { getToken: () => "tok" },
    }
    const formData = new FormData
    const request = api.getRequest("/h", config, { method: "POST", body: formData })
    expect(request.headers.get("Content-Type")).toStartWith("multipart/form-data boundary=")
  })
})

describe("api.resolveRequestBody", () => {
  it("returns undefined for null/undefined", () => {
    expect(api.resolveRequestBody(null)).toBe(undefined)
    expect(api.resolveRequestBody(undefined)).toBe(undefined)
  })

  it("stringifies plain objects", () => {
    expect(api.resolveRequestBody({ a: 1 })).toBe(JSON.stringify({ a: 1 }))
  })

  it("returns FormData as-is", () => {
    const formData = new FormData()
    formData.append("x", "1")
    expect(api.resolveRequestBody(formData)).toBe(formData)
  })

  it("returns Blob as-is (when available)", () => {
    const blob = new Blob(["x"])
    expect(api.resolveRequestBody(blob)).toBe(blob)
  })
})

describe("api.resolveResponse", () => {
  it("returns null for non-ok responses", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 400,
      statusText: "Bad",
    })
    const out = await api.resolveResponse(response)
    expect(out).toBeNull()
  })

  it("returns null for 204 | 205", async () => {
    const response204 = new Response(null, { status: 204 })
    const response205 = new Response(null, { status: 205 })

    expect(await api.resolveResponse(response204)).toBeNull()
    expect(await api.resolveResponse(response205)).toBeNull()
  })

  it("returns parsed JSON when no schema provided", async () => {
    const payload = { hello: "world" }
    const response = new Response(JSON.stringify(payload), { status: 200 })
    const out = await api.resolveResponse(response)
    expect(out).toEqual(payload)
  })
})
