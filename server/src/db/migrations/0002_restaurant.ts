import { type Kysely, sql } from "kysely";
import { addTimestamps } from "../helpers";

export async function up(db: Kysely<any>) {
	await db.schema
		.createTable("restaurant")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("owner_id", "text", (col) =>
			col.references("account.id").onDelete("cascade").notNull(),
		)
		.addColumn("name", "varchar", (col) => col.unique().notNull())
		.addColumn("description", "text", (col) => col.notNull())
		.addColumn("address", "text", (col) => col.notNull())
		.addColumn("category", "varchar", (col) => col.notNull())
		.addColumn("coordinates", sql`GEOMETRY(Point, 4326)`, (col) =>
			col.notNull(),
		)
		.$call(addTimestamps)
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropTable("restaurant").execute();
}
