import { type Kysely } from "kysely";
import { addTimestamps } from "../helpers.js";

export async function up(db: Kysely<any>) {
	await db.schema
		.createTable("food_note")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("restaurant_id", "bigint", (col) =>
			col.references("restaurant.id").onDelete("cascade").notNull(),
		)
		.addColumn("food", "varchar", (col) => col.notNull())
		.addColumn("amount", "smallint", (col) => col.notNull().defaultTo(0))
		.$call(addTimestamps)
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropTable("food_note").execute();
}
