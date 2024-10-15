import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { showRoutes } from "hono/dev";
import { logger } from "./lib/logger";
import { Client as MapsClient } from "@googlemaps/google-maps-services-js";
import { auth } from "./lib/auth";
import maps from "./routes/maps";

// TODO: move this later
interface Context {}

/**
 * Base server constants & configurations
 */
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 3000);
const SECURE = process.env.NODE_ENV === "production";

const app = new Hono<Context>({ strict: false });

/**
 * Register server middlewares & logger
 */
app.use(honoLogger(logger.info));
app.use("/api/*", cors());

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
  return c.json({ Hello: "Hono!" });
});

app.route("/api/maps", maps);

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

logger.info(`Server is running on: ${SECURE ? "https" : "http"}://${HOST}:${PORT}`);
