import { db } from "@/db/index.js";
import type { User } from "@/types/database.js";
import type { Insertable, Updateable } from "kysely";

export async function getAllUsers() {
	const result = await db.selectFrom("user").selectAll().execute();

	return result;
}

export async function getUserById(id: User["id"]) {
	const result = await db
		.selectFrom("user")
		.selectAll()
		.where("id", "=", id)
		.executeTakeFirstOrThrow();

	return result;
}

export async function getUserByUniqueField(
	field: "username" | "email",
	value: string,
) {
	const result = await db
		.selectFrom("user")
		.selectAll()
		.where(field, "=", value)
		.executeTakeFirstOrThrow();

	return result;
}

export async function createUser(user: Insertable<User>) {
	const result = await db
		.insertInto("user")
		.values(user)
		.returningAll()
		.executeTakeFirstOrThrow();

	return result;
}

export async function updateUserById(id: User["id"], user: Updateable<User>) {
	const result = await db
		.updateTable("user")
		.set(user)
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirstOrThrow();

	return result;
}

export async function deleteUserById(id: User["id"]) {
	const result = await db
		.deleteFrom("user")
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirstOrThrow();

	return result;
}
