import type { Env } from "hono";
import type { Session } from "./auth";

export default interface Context extends Env {
  Variables: {
    user: Session["user"] | null;
    session: Session["session"] | null;
  };
}
