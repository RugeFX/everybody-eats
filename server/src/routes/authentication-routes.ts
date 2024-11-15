import { Hono } from "hono";
import { z } from "zod";
import jsonValidator from "@/middlewares/validation";
import { type Context } from "@/types/context";
import {
	createSession,
	generateSessionToken,
	invalidateSession,
} from "@/lib/auth/session";
import { getUserByUniqueField } from "@/repositories/user-repository";
import { randomBytes, scryptSync } from "crypto";
import { db } from "@/db";
import { HTTPException } from "hono/http-exception";
import {
	clearSessionTokenCookie,
	setSessionTokenCookie,
} from "@/lib/auth/cookie";
import authenticationMiddleware from "@/middlewares/authentication";

const authenticationRoutes = new Hono<Context>();

const loginSchema = z.object({
	username: z.string().max(25).min(4),
	password: z.string().min(8),
});

const registerSchema = z.object({
	username: z.string().max(25).min(4),
	password: z.string().min(8),
	email: z.string().email(),
	full_name: z.string(),
	role: z.enum(["admin", "community_manager", "restaurant_manager"]).optional(),
});

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

authenticationRoutes.post("/login", jsonValidator(loginSchema), async (c) => {
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

// TODO: only for dev (i'm lazy)
authenticationRoutes.get("/sigma", async (c) => {
	const user = await db
		.insertInto("user")
		.values({
			username: "sigma",
			password: hashPassword("sigma123"),
			email: "sigma@gmail.com",
			full_name: "Sigma Sibiddy",
			role: "admin",
		})
		.returningAll()
		.executeTakeFirstOrThrow();

	return c.json({ message: user });
});

authenticationRoutes.post(
	"/register",
	jsonValidator(registerSchema),
	async (c) => {
		const { username, password, email, full_name, role } = c.req.valid("json");

		const user = await getUserByUniqueField("username", username);

		if (user)
			throw new HTTPException(400, { message: "Username already exists" });

		const hashedPassword = hashPassword(password);

		const newUser = await db
			.insertInto("user")
			.values({
				username,
				password: hashedPassword,
				email,
				full_name,
				role: role ?? "community_manager",
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return c.json({ message: "Successfully registered user", data: newUser });
	},
);

authenticationRoutes.post("/logout", authenticationMiddleware, async (c) => {
	invalidateSession(c.var.session.id);
	clearSessionTokenCookie(c);

	return c.json({ message: "Successfully logged out" });
});

export default authenticationRoutes;
