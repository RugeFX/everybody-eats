import { sql, type Kysely } from "kysely";
import { addTimestamps } from "../helpers";

export async function up(db: Kysely<any>) {
	// make our own enum type for the role field
	await db.schema
		.createType("role")
		.asEnum(["admin", "community_manager", "restaurant_manager"])
		.execute();

	await db.schema
		.createTable("account")
		.addColumn("id", "uuid", (col) =>
			col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`),
		)
		.addColumn("user_id", "bigint", (col) =>
			col.notNull().references("user.id").onDelete("cascade"),
		)
		.addColumn("role", sql`role`, (col) => col.notNull())
		.$call(addTimestamps)
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropType("role").execute();
	await db.schema.dropTable("account").execute();
}
