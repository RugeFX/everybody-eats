import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { deleteCookie, getCookie } from "hono/cookie";
import { validateSessionToken } from "@/lib/auth/session.js";
import type { Context } from "hono";
import type { ContextWithUser } from "@/types/context.js";

function emptyAuthContext(c: Context) {
	c.set("user", null);
	c.set("session", null);
}

const authenticationMiddleware = createMiddleware<ContextWithUser>(
	async (c, next) => {
		const cookie = getCookie(c, "session");

		if (!cookie) {
			emptyAuthContext(c);
			throw new HTTPException(401, { message: "Unauthorized" });
		}

		const session = await validateSessionToken(cookie);

		if (!session) {
			deleteCookie(c, "session");
			emptyAuthContext(c);
			throw new HTTPException(401, { message: "Unauthorized" });
		}

		c.set("user", session.user);
		c.set("session", session.session);

		await next();
	},
);

export default authenticationMiddleware;
