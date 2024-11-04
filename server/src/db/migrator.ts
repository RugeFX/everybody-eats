import path from "path";
import fs from "fs/promises";
import { Migrator, FileMigrationProvider } from "kysely";
import { db } from ".";
import { logger } from "@/lib/logger";

const migrator = new Migrator({
	db,
	provider: new FileMigrationProvider({
		fs,
		path,
		migrationFolder: path.join(import.meta.dirname, "migrations"),
	}),
});

async function migrateToLatest() {
	if (process.argv.slice(2).includes("fresh")) {
		logger.info("Rolling back migrations...");
		await migrator.migrateDown();
	}

	logger.info("Migrating to latest...");
	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === "Success") {
			logger.info(`Migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === "Error") {
			logger.error(`Failed to execute migration "${it.migrationName}"`);
		}
	});

	await db.destroy();

	if (error) {
		logger.error("Failed to migrate: %o", error);
		process.exitCode = 1;
		return;
	}

	logger.info(`Migration complete, ${results?.length} migrations executed`);
}

migrateToLatest();
