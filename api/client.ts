import { QueryClient } from "@tanstack/react-query"


const cacheTime = import.meta.env.MODE === "development" ? 100 : Number(import.meta.env.VITE_API_CACHE_TIME)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: cacheTime,

      throwOnError: true,

      refetchOnWindowFocus: false,
      retry: false,
      /**
       * Try every 10, 20, 30, ... "seconds", depending on `failureCount`.
       *
       * if `failureCount` more than 50, retry delay clumps to 5 "minutes".
       */
      retryDelay(failureCount) {
        if (failureCount > 50) {
          return 10 * 1000 * 60 // 5 minutes
        }

        return failureCount * 5 * 1000
      }
    }
  }
})
export default queryClient
