import { clearToken, getToken } from "~/services/token-storage";
import type { APIConfig } from "./api";

if (import.meta.env.VITE_API_BASE_URL == null) {
  throw new TypeError("ENV Variable `VITE_API_BASE_URL` is missing")
}

export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  auth: {
    getToken,
    onUnauthorized: () => {
      if (getToken() == null) return

      clearToken();
      window.location.reload();
    }
  }
} satisfies APIConfig
