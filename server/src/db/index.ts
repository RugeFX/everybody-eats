import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import { logger } from "@/lib/logger";
import env from "@/lib/env";
import type { Database } from "@/types/database";

export const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

export const dialect = new PostgresDialect({
	pool,
});

export const db = new Kysely<Database>({
	dialect,
});

logger.info("DB initialized");
