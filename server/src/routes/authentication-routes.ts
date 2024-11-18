import { Hono } from "hono";
import { z } from "zod";
import { randomBytes, scryptSync } from "crypto";
import { HTTPException } from "hono/http-exception";
import {
	createSession,
	generateSessionToken,
	invalidateSession,
} from "@/lib/auth/session.js";
import {
	clearSessionTokenCookie,
	setSessionTokenCookie,
} from "@/lib/auth/cookie.js";
import {
	createUser,
	getUserByUniqueField,
} from "@/repositories/user-repository.js";
import zodValidator from "@/middlewares/validation.js";
import authenticationMiddleware from "@/middlewares/authentication.js";
import type { Context } from "@/types/context.js";

const authenticationRoutes = new Hono<Context>();

const loginSchema = z.object({
	username: z.string().max(25).min(4),
	password: z.string().min(8),
});

const registerSchema = z
	.object({
		username: z.string().max(25).min(4),
		password: z
			.string()
			.min(8)
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
				"Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
			),
		confirm_password: z.string().min(8),
		email: z.string().email(),
		full_name: z.string(),
		role: z.enum(["community_manager", "restaurant_manager", "admin"]), // TODO: remove admin for production
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords don't match",
		path: ["confirm_password"],
	})
	.refine(
		(data) =>
			!data.password.toLowerCase().includes(data.username.toLowerCase()),
		{
			message: "Password must not be similar to the username",
			path: ["password"],
		},
	);

// TODO: maybe refactor / move these helper functions later
const encryptPassword = (password: string, salt: string) => {
	return scryptSync(password, salt, 32).toString("hex");
};

const hashPassword = (password: string) => {
	const salt = randomBytes(16).toString("hex");
	return encryptPassword(password, salt) + salt;
};

const matchPassword = (password: string, hashedPassword: string) => {
	const salt = hashedPassword.slice(64);
	const originalHash = hashedPassword.slice(0, 64);
	const currentHash = encryptPassword(password, salt);

	return originalHash === currentHash;
};

authenticationRoutes.post("/login", zodValidator(loginSchema), async (c) => {
	const { username, password } = c.req.valid("json");

	const user = await getUserByUniqueField("username", username);

	const match = matchPassword(password, user.password);

	if (!match) throw new HTTPException(401, { message: "Invalid credentials" });

	const token = generateSessionToken();
	const session = await createSession(token, user.id);
	setSessionTokenCookie(c, token, session.expires_at);

	return c.json({
		message: "Successfully logged in",
		data: { user: { ...user, password: undefined }, session },
	});
});

authenticationRoutes.post(
	"/register",
	zodValidator(registerSchema),
	async (c) => {
		const { confirm_password: _, ...data } = c.req.valid("json");

		const newUser = await createUser({
			...data,
			password: hashPassword(data.password),
		});

		return c.json({ message: "Successfully registered user", data: newUser });
	},
);

authenticationRoutes.post("/logout", authenticationMiddleware, async (c) => {
	await invalidateSession(c.var.session.id);
	clearSessionTokenCookie(c);

	return c.json({ message: "Successfully logged out" });
});

export default authenticationRoutes;
