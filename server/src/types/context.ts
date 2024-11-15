import type { Env } from "hono";
import type { Selectable } from "kysely";
import type { User, Session } from "./database.js";

export interface Context extends Env {
	Variables: {
		user: User | null;
		session: Selectable<Session> | null;
	};
}

export interface ContextWithUser extends Context {
	Variables: {
		user: User;
		session: Selectable<Session>;
	};
}
