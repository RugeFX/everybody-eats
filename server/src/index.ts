import { config } from "@dotenvx/dotenvx";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { showRoutes } from "hono/dev";
import { logger } from "./lib/logger";
import { auth } from "./lib/auth";
import type { Context } from "./types/context";
import authenticationMiddleware from "./middlewares/authentication";
import mapsRouter from "./routes/maps";
import env from "./lib/env";

/**
 * Base server constants & configurations
 */
const { FRONTEND_URL, HOST, PORT, NODE_ENV } = env;
const SECURE = NODE_ENV === "production";

const app = new Hono<Context>({ strict: false });

/**
 * Register server middlewares & logger
 */
app.use(honoLogger(logger.info));
app.use(
	"/api/*",
	cors({
		origin: FRONTEND_URL,
		maxAge: 600,
		credentials: true,
	}),
);

/**
 * Auth routes provided by BetterAuth
 */
app.get("/api/auth/*", (c) => auth.handler(c.req.raw));
app.post("/api/auth/*", (c) => auth.handler(c.req.raw));

/**
 * Server application routes
 */
app.get("/api", (c) => {
	logger.info("Hit API");
	return c.json({ hello: "world!" });
});

app.get("/api/auth/info", authenticationMiddleware, async (c) => {
	const { user } = c.var;

	return c.json({ user });
});

app.route("/api/maps", mapsRouter);

/**
 * Server initializations
 */
showRoutes(app, {
	colorize: true,
	verbose: true,
});

serve({
	fetch: app.fetch,
	hostname: HOST,
	port: PORT,
});

logger.info(
	`Server is running on: ${SECURE ? "https" : "http"}://${HOST}:${PORT}`,
);
