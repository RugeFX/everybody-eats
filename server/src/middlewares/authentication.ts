import { createMiddleware } from "hono/factory";
import UnauthorizedException from "../exceptions/unauthorized-exception";
import { auth } from "../lib/auth";
import type { Context } from "../lib/context";

interface NotNullAuthContext {
  Variables: {
    user: Exclude<Context["Variables"]["user"], null>;
    session: Exclude<Context["Variables"]["session"], null>;
  };
}

const authenticationMiddleware = createMiddleware<Context, string, object, NotNullAuthContext>(
  async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      // TODO: nasty type workarounds, making sure the ctx's auth info is null
      c.set("user", null as unknown as NotNullAuthContext["Variables"]["user"]);
      c.set("session", null as unknown as NotNullAuthContext["Variables"]["session"]);
      throw new UnauthorizedException("Unauthorized");
    }

    c.set("user", session.user);
    c.set("session", session.session);

    return next();
  }
);

export default authenticationMiddleware;
