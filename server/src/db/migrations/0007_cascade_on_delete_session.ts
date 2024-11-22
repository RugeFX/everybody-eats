import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
	await db.schema
		.alterTable("session")
		.dropConstraint("session_user_id_fkey")
		.execute();

	await db.schema
		.alterTable("session")
		.addForeignKeyConstraint("session_user_id_fkey", ["user_id"], "user", [
			"id",
		])
		.onDelete("cascade")
		.execute();
}
