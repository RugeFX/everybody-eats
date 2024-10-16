import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import AuthStatus from "../components/auth-status";

export const Route = createRootRoute({
        component: Root,
});

function Root() {
        return (
                <>
                        <AuthStatus />
                        <Outlet />
                        <TanStackRouterDevtools />
                </>
        )
}
