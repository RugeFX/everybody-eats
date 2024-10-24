import { createMiddleware } from "hono/factory";
import { auth } from "@/lib/auth";
import type { ContextWithUser } from "@/types/context";
import { HTTPException } from "hono/http-exception";

const authenticationMiddleware = createMiddleware<ContextWithUser>(
	async (c, next) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers });

		if (!session) {
			// biome-ignore lint/style/noNonNullAssertion: idk how to reason with the types
			c.set("user", null!);
			// biome-ignore lint/style/noNonNullAssertion: idk how to reason with the types
			c.set("session", null!);

			throw new HTTPException(401, { message: "Unauthorized" });
		}

		c.set("user", session.user);
		c.set("session", session.session);

		await next();
	},
);

export default authenticationMiddleware;
