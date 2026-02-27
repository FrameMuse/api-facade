if (import.meta.env.VITE_API_BASE_URL == null) {
  throw new TypeError("ENV Variable `VITE_API_BASE_URL` is missing")
}

interface APIOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  /** Accepts plain JS values, including `FormData`, `Blob`. */
  body?: unknown
  params?: Record<string, unknown>
  search?: string | Record<string, string> | URLSearchParams
}

export async function api<T>(path: URL | string, options?: APIOptions): Promise<T | null> {
  const url = new URL(path, import.meta.env.VITE_API_BASE_URL)

  if (options?.search != null) {
    url.search = new URLSearchParams(options.search).toString()
  }

  const headers = new Headers
  headers.set("Authorization", `Bearer ${localStorage.getItem("user-token")}`)
  headers.set("Content-Type", "application/json")

  if (options?.body instanceof FormData) {
    headers.delete("Content-Type") // Allow special types of body to set content-type on its own to work properly.
  }

  const response = await fetch(url, {
    ...options,
    body: resolveRequestBody(options?.body),
    headers,
  })

  if (!response.ok) return null

  const data = await response.json()
  return data
}

function resolveRequestBody(body: unknown) {
  if (body == null) return undefined

  if (body instanceof FormData) return body
  if (body instanceof Blob) return body

  return JSON.stringify(body)
}
