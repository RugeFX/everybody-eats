import { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { env } from "../env";

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

export function clearSessionTokenCookie(context: Context) {
	deleteCookie(context, "session");
}
