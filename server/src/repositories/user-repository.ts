import { db } from "@/db";
import type { User } from "@/types/database";

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
