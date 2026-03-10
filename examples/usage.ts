import API from "../api/API"
import { SwaggerDocs } from "openapi-schema-tools"

// this is a tiny mock swagger description, real projects will import a generated one
const swagger = {
  actions: {
    GET: {
      "/ping": {
        method: "GET",
        endpoint: "/ping",
        requestBodyShape: { schema: { _partial: undefined }, form: (v: any) => v },
        resolveResponsePayload: async (res: Response) => await res.json(),
      },
    },
  },
} as unknown as SwaggerDocs

const api = new API({
  baseURL: "https://example.com",
  queryClient: {} as any,
  swagger,
})

async function main() {
  try {
    const result = await api.fetch.GET["/ping"]()
    console.log("pong", result)
  } catch (err) {
    console.error("request failed", err)
  }
}

main().catch(console.error)
