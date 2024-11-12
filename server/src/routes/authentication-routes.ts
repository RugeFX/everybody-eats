import { Hono } from "hono";
import { z } from "zod";
import jsonValidator from "@/middlewares/validation";
import { type Context } from "@/types/context";
import { createSession, generateSessionToken } from "@/lib/auth/session";
import { getUserByUniqueField } from "@/repositories/user-repository";
import { randomBytes, scryptSync } from "crypto";
import { db } from "@/db";
import { HTTPException } from "hono/http-exception";
import { setSessionTokenCookie } from "@/lib/auth/cookie";

const authenticationRoutes = new Hono<Context>();

const loginSchema = z.object({
	username: z.string().max(25).min(4),
	password: z.string().min(8),
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

export default authenticationRoutes;
