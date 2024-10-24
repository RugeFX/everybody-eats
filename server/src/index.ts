import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { showRoutes } from "hono/dev";
import { logger } from "./lib/logger";
import { auth } from "./lib/auth";
import type { Context } from "./types/context";
import mapsRoutes from "./routes/maps";
import restaurantRoutes from "./routes/restaurant-routes";
import env from "./lib/env";
import { NoResultError } from "kysely";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

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
app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return c.json({ message: err.message }, err.status);
	} else if (err instanceof NoResultError) {
		return c.json({ message: "Record not found" }, 404);
	} else if (err instanceof ZodError) {
		return c.json({
			message: "Invalid request body",
			errors: err.flatten().fieldErrors,
		});
	}
	return c.json({ message: err.message }, 500);
});

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
app.route("/api/maps", mapsRoutes);
app.route("/api/restaurants", restaurantRoutes);

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
