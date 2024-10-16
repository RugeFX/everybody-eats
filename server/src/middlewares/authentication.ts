import { createMiddleware } from "hono/factory";
import UnauthorizedException from "../exceptions/unauthorized-exception";
import { auth } from "../lib/auth";
import type Context from "../lib/context";

const authenticationMiddleware = createMiddleware<Context>(async (c, next) => {
        const session = await auth.api.getSession({ headers: c.req.raw.headers });

        if (!session) {
                c.set("user", null);
                c.set("session", null);
                throw new UnauthorizedException({ message: "Unauthorized" });
        }

        c.set("user", session.user);
        c.set("session", session.session);

        return next();
});

export default authenticationMiddleware;
