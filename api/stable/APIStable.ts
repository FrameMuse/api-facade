
import { UserDao } from "@/entities/user"
import ObservableLocalStorage from "@/utils/transform/observableLocalStorage"

import APIDocs from "./data/docs.json"

import API from "../API"
import queryClient from "../client"
import { QueryClientError } from "../QueryError"
import QuerySwagger from "../QuerySwagger"
import { HTTPStatus } from "../types"

export const APIDocsSwagger = new QuerySwagger(APIDocs)

export const StreamAPI = new API({
  baseURL: import.meta.env.VITE_API_HOST,

  queryClient: queryClient,
  swagger: APIDocsSwagger,

  options: {
    endpoint: {
      includeVersion: true,
      includeTrailingSlash: true
    },
    request: {
      security: {
        tokens: [{
          type: "JWT",
          header: "Authorization",
          read: () => ObservableLocalStorage.getItem("user-token"),
          async refresh(expiredToken) {
            const response = await this.fetch.POST["/auth/refresh-token"]({
              body: { accessToken: expiredToken },

              noSecurity: true
            })

            const newToken = response.payload.accessToken
            ObservableLocalStorage.setItem("user-token", newToken)
            return newToken
          }
        }]
      }
    },
    response: {
      statusCodeFromPayload(payload) {
        if ("error" in payload) {
          return HTTPStatus.BadRequest
        }

        return HTTPStatus.OK
      }
    },
    debug: {
      enabled: import.meta.env.MODE === "development",
      mock: "auto"
    }
  },

  default: {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }
})

StreamAPI.on("error", (action, request, error) => {
  if (error instanceof QueryClientError === false) return
  if (error.status !== 401) return

  void UserDao.logOut()
})
