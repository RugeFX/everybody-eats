import type { Env } from "hono";
import type { Session, User } from "./database.js";

export interface Context extends Env {
	Variables: {
		user: User | null;
		session: Session | null;
	};
}

export interface ContextWithUser extends Context {
	Variables: {
		user: User;
		session: Session;
	};
}
