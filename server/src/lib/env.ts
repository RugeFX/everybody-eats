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
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
	BETTER_AUTH_TRUSTED_ORIGINS: z
		.string()
		.refine((value) =>
			value
				.split(",")
				.every((origin) => z.string().url().safeParse(origin).success),
		),
});

const env = envSchema.parse(process.env);

export default env;
