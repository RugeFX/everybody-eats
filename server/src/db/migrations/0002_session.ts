import { type Kysely } from "kysely";
import { addTimestamps } from "../helpers.js";

export async function up(db: Kysely<any>) {
	await db.schema
		.createTable("session")
		.addColumn("id", "text", (col) => col.primaryKey().notNull())
		.addColumn("user_id", "bigint", (col) =>
			col.notNull().references("user.id"),
		)
		.addColumn("expires_at", "timestamptz", (col) => col.notNull())
		.$call(addTimestamps)
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropTable("session").execute();
}
