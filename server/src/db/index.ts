import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { logger } from "../lib/logger";
import type { Database } from "./types";

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const dialect = new PostgresDialect({
  pool,
});

export const db = new Kysely<Database>({
  dialect,
});

logger.info("DB initialized");
