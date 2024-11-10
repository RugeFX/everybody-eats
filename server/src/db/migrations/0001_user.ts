import { type Kysely } from "kysely";
import { addTimestamps } from "../helpers";

export async function up(db: Kysely<any>) {
	await db.schema
		.createTable("user")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("username", "varchar(50)", (col) => col.unique().notNull())
		.addColumn("full_name", "text", (col) => col.notNull())
		.addColumn("email", "text", (col) => col.unique().notNull())
		.addColumn("password", "text", (col) => col.notNull())
		.$call(addTimestamps)
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropTable("user").execute();
}
