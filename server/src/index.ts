/* External dependencies imports */
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { showRoutes } from "hono/dev";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { NoResultError } from "kysely";
import pg from "pg";

/* Local libraries imports */
import { logger } from "./lib/logger.js";
import { env } from "./lib/env.js";

/* Type imports */
import type { Context } from "./types/context.js";

/* Route imports */
import mapsRoutes from "./routes/maps.js";
import restaurantRoutes from "./routes/restaurant-routes.js";
import authenticationRoutes from "./routes/authentication-routes.js";

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
		/* Handle errors thrown from handlers */
		return c.json({ message: err.message }, err.status);
	} else if (err instanceof NoResultError) {
		/* Handle errors thrown from the Kysely db instance when no result is found */
		return c.json({ message: "Record not found" }, 404);
	} else if (err instanceof ZodError) {
		/* Handle errors thrown from the zod validator */
		return c.json({
			message: "Invalid request body",
			errors: err.flatten().fieldErrors,
		});
	} else if (err instanceof pg.DatabaseError && err.code === "23505")
		return c.json(
			{
				message: `Value for unique field already exists: ${err.detail}`,
				field: err.detail?.match(/\(([^)]+)\)/)?.[1] ?? "unknown",
			},
			400,
		);
	/* Handle unexpected errors */
	logger.error(
		'Unhandled error with constructor name "%s": %o',
		err.constructor.name,
		err,
	);
	return c.json({ message: err.message }, 500);
});

/**
 * Server application routes
 */
app.get("/api", (c) => {
	logger.info("Hit API");
	return c.json({ hello: "world!" });
});
app.route("/api/maps", mapsRoutes);
app.route("/api/restaurants", restaurantRoutes);
app.route("/api/auth", authenticationRoutes);

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
