import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	getAllUsers,
	getUserById,
	updateUserById,
	verifyUser,
} from "@/repositories/user-repository.js";
import type { Context } from "@/types/context.js";
import authenticationMiddleware from "@/middlewares/authentication.js";
import authorizationMiddleware from "@/middlewares/authorization.js";
import zodValidator from "@/middlewares/validation.js";
import { z } from "zod";

const userRoutes = new Hono<Context>();

const updateSchema = z.object({
	full_name: z.string().optional(),
	email: z.string().email().optional(),
	username: z.string().optional(),
	password: z
		.string()
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
			message:
				"Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number",
		})
		.optional(),
});

// TODO: idk if this logic is good or not
userRoutes.use("/*", authenticationMiddleware);

userRoutes.get("/", authorizationMiddleware(["admin"]), async (c) => {
	const data = await getAllUsers();

	return c.json({
		message: "User list",
		data: data.map(({ id, username, full_name, email, role }) => ({
			id,
			username,
			full_name,
			email,
			role,
		})),
	});
});

userRoutes.get("/:id", async (c) => {
	const id = parseInt(c.req.param("id"));

	if (!id)
		throw new HTTPException(404, { message: "Record not found, invalid ID" });

	const data = await getUserById(id);

	return c.json({ message: "User details", data });
});

userRoutes.patch("/:id", zodValidator(updateSchema), async (c) => {
	const id = parseInt(c.req.param("id"));

	if (!id)
		throw new HTTPException(404, { message: "Record not found, invalid ID" });

	const data = await updateUserById(id, c.req.valid("json"));

	return c.json({
		message: "Successfully verified user",
		data,
	});
});

userRoutes.patch("/verify/:id", async (c) => {
	const id = parseInt(c.req.param("id"));

	if (!id)
		throw new HTTPException(404, { message: "Record not found, invalid ID" });

	const data = await verifyUser(id);

	return c.json({
		message: "Successfully verified user",
		data,
	});
});

export default userRoutes;
