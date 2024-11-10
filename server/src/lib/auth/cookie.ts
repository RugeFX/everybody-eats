import { Context } from "hono";
import { env } from "../env";
import { setCookie } from "hono/cookie";

export function setSessionTokenCookie(
	context: Context,
	token: string,
	expiresAt: Date,
) {
	setCookie(context, "session", token, {
		httpOnly: true,
		path: "/",
		secure: env.NODE_ENV === "production",
		sameSite: "lax",
		expires: expiresAt,
	});
}
