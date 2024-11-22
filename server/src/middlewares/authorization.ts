import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { ContextWithUser } from "@/types/context.js";
import type { User } from "@/types/database.js";

const authorizationMiddleware = (allowedRoles: User["role"][]) =>
	createMiddleware<ContextWithUser>(async (c, next) => {
		if (!allowedRoles.includes(c.var.user.role))
			throw new HTTPException(403, { message: "Forbidden" });

		await next();
	});

export default authorizationMiddleware;
