import { Kysely } from "kysely";
import { addTimestamps } from "../helpers";

export async function up(db: Kysely<any>) {
	await db.schema
		.createTable("restaurant")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "varchar", (col) => col.notNull())
		.addColumn("description", "text")
		.addColumn("category", "varchar")
		// TODO: change to geo points
		.addColumn("lat", "decimal")
		.addColumn("lng", "decimal")
		.$call(addTimestamps)
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropTable("restaurant").execute();
}
