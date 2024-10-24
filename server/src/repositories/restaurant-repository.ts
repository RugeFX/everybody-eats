import { db } from "@/db";
import { NewRestaurant, Restaurant, UpdateRestaurant } from "@/types/database";

export async function getAllRestaurants() {
	const result = await db.selectFrom("restaurant").selectAll().execute();

	return result;
}

export async function getRestaurantById(id: Restaurant["id"]) {
	const result = await db
		.selectFrom("restaurant")
		.selectAll()
		.where("id", "=", id)
		.executeTakeFirstOrThrow();

	return result;
}

export async function createRestaurant(values: NewRestaurant) {
	const result = await db
		.insertInto("restaurant")
		.values(values)
		.returningAll()
		.executeTakeFirstOrThrow();

	return result;
}

export async function updateRestaurant(
	id: Restaurant["id"],
	values: UpdateRestaurant,
) {
	const result = await db
		.updateTable("restaurant")
		.set(values)
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirstOrThrow();

	return result;
}

export async function deleteRestaurant(id: Restaurant["id"]) {
	const result = await db
		.deleteFrom("restaurant")
		.where("id", "=", id)
		.returning("id")
		.executeTakeFirstOrThrow();

	return result;
}
