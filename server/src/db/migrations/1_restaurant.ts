import { Kysely } from "kysely";
import { addTimestamps } from "../helpers";

export async function up(db: Kysely<any>) {
	await db.schema
		.createTable("restaurant")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "varchar", (col) => col.notNull())
		.addColumn("description", "text", (col) => col.notNull())
		.addColumn("address", "text", (col) => col.notNull())
		.addColumn("category", "varchar", (col) => col.notNull())
		// TODO: change to geo points
		.addColumn("lat", "decimal", (col) => col.notNull())
		.addColumn("lng", "decimal", (col) => col.notNull())
		.$call(addTimestamps)
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropTable("restaurant").execute();
}
