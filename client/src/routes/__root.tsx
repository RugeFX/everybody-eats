import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import AuthStatus from "../components/auth-status";

export const Route = createRootRoute({
  component: () => (
    <>
      <div>Hello "__root"!</div>
      <AuthStatus />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
