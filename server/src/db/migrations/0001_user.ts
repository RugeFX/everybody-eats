import { sql, type Kysely } from "kysely";
import { addTimestamps } from "../helpers.js";

export async function up(db: Kysely<any>) {
	// enum type for the role field
	await db.schema
		.createType("role")
		.asEnum(["admin", "community_manager", "restaurant_manager"])
		.execute();

	await db.schema
		.createTable("user")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("username", "varchar(50)", (col) => col.unique().notNull())
		.addColumn("full_name", "text", (col) => col.notNull())
		.addColumn("email", "text", (col) => col.unique().notNull())
		.addColumn("password", "text", (col) => col.notNull())
		.addColumn("role", sql`role`, (col) => col.notNull())
		.$call(addTimestamps)
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropType("role").execute();
	await db.schema.dropTable("user").execute();
}
