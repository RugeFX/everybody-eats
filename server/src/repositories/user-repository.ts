import { db } from "@/db";
import type { Database, User } from "@/types/database";
import { SelectExpression } from "kysely";

export async function getAllUsers() {
	const result = await db
		.selectFrom("user")
		.select(["id", "username"])
		.execute();

	return result;
}

export async function getUserByUsername(username: User["username"]) {
	const result = await db
		.selectFrom("user")
		.selectAll()
		.where("username", "=", username)
		.executeTakeFirstOrThrow();

	return result;
}
