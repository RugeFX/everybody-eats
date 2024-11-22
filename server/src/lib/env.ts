import z from "zod";
import { config } from "@dotenvx/dotenvx";
import path from "path";

config({ path: path.join(import.meta.dirname, "../../.env") });

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	APP_NAME: z.string().default("Everybody Eats"),
	HOST: z.string().default("localhost"),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string().url(),
	FRONTEND_URL: z.string().url().default("http://localhost:5173"),
	GOOGLE_MAPS_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
