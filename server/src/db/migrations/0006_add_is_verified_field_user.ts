import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
	await db.schema
		.alterTable("user")
		.addColumn("is_verified", "boolean", (col) =>
			col.defaultTo(false).notNull(),
		)
		.execute();
}
