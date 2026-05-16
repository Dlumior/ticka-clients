import * as React from "react"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import type { QueryClient } from "@tanstack/react-query"
import type { AuthContext } from "@/features/auth/auth.context"

export interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <Outlet />
      {import.meta.env.DEV && (
        <React.Suspense>
          <TanStackRouterDevtools position="bottom-right" />
        </React.Suspense>
      )}
    </>
  )
}
