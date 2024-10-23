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

const authenticationMiddleware = createMiddleware<NotNullAuthContext>(
	async (c, next) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers });

		if (!session) {
			// biome-ignore lint/style/noNonNullAssertion: idk how to reason with the types
			c.set("user", null!);
			// biome-ignore lint/style/noNonNullAssertion: idk how to reason with the types
			c.set("session", null!);
			throw new UnauthorizedException("Unauthorized");
		}

		c.set("user", session.user);
		c.set("session", session.session);

		await next();
	},
);

export default authenticationMiddleware;
