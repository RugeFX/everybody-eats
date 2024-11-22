import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import {
	deleteUserById,
	getAllUsers,
	getUserById,
	updateUserById,
	verifyUser,
} from "@/repositories/user-repository.js";
import authenticationMiddleware from "@/middlewares/authentication.js";
import authorizationMiddleware from "@/middlewares/authorization.js";
import zodValidator from "@/middlewares/validation.js";
import type { ContextWithUser } from "@/types/context.js";

const userRoutes = new Hono<ContextWithUser>();

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

	const user = await getUserById(id);

	if (user.id !== id || c.var.user.role !== "admin")
		throw new HTTPException(403, { message: "Unauthorized" });

	const data = await updateUserById(id, c.req.valid("json"));

	return c.json({
		message: "Successfully updated user",
		data,
	});
});

userRoutes.patch("/verify/:id", async (c) => {
	const id = parseInt(c.req.param("id"));

	if (!id)
		throw new HTTPException(404, { message: "Record not found, invalid ID" });

	const data = await verifyUser(id);

	return c.json({
		message: "successfully verified user",
		data,
	});
});

userRoutes.delete("/:id", async (c) => {
	const id = parseInt(c.req.param("id"));

	if (!id)
		throw new HTTPException(404, { message: "Record not found, invalid ID" });

	const data = await deleteUserById(id);

	return c.json({
		message: "successfully verified user",
		data,
	});
});

export default userRoutes;
