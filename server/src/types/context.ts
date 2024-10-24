import type { Env } from "hono";
import type { Session } from "@/lib/auth";

export interface Context extends Env {
	Variables: {
		user: Session["user"] | null;
		session: Session["session"] | null;
	};
}

export interface ContextWithUser extends Context {
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}
