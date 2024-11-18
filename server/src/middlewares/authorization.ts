import { ContextWithUser } from "@/types/context.js";
import { User } from "@/types/database.js";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

const authorizationMiddleware = (allowedRoles: User["role"][]) =>
	createMiddleware<ContextWithUser>(async (c, next) => {
		if (!allowedRoles.includes(c.var.user.role))
			throw new HTTPException(403, { message: "Forbidden" });

		await next();
	});

export default authorizationMiddleware;
