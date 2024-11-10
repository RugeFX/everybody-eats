import { db } from "@/db";
import { sql } from "kysely";
import { ST_X, ST_Y } from "@/lib/helpers/kysely";
import type { ExpressionBuilder } from "kysely";
import type { LatLngLiteral } from "@googlemaps/google-maps-services-js";
import type {
	Database,
	NewRestaurant,
	Restaurant,
	UpdateRestaurant,
} from "@/types/database";

function selectWithCoordinates(eb: ExpressionBuilder<Database, "restaurant">) {
	return [
		"id",
		"owner_id",
		"name",
		"description",
		"category",
		"address",
		"created_at",
		"updated_at",
		ST_X(eb.ref("coordinates")).as("latitude"),
		ST_Y(eb.ref("coordinates")).as("longitude"),
	] as const;
}

export async function getAllRestaurants() {
	const result = await db
		.selectFrom("restaurant")
		.select(["id", "owner_id", "name", "description", "category", "address"])
		.execute();

	return result;
}

export async function getRestaurantById(id: Restaurant["id"]) {
	const result = await db
		.selectFrom("restaurant")
		.select(selectWithCoordinates)
		.where("id", "=", id)
		.executeTakeFirstOrThrow();

	return result;
}

export async function createRestaurant(
	values: Omit<NewRestaurant, "coordinates"> & { coordinates: LatLngLiteral },
) {
	const result = await db
		.insertInto("restaurant")
		.values({
			...values,
			coordinates: db.fn("ST_MakePoint", [
				sql`${values.coordinates.lat}, ${values.coordinates.lng}`,
			]),
		})
		.returning(selectWithCoordinates)
		.executeTakeFirstOrThrow();

	return result;
}

export async function updateRestaurant(
	id: Restaurant["id"],
	values: Omit<UpdateRestaurant, "coordinates"> & {
		coordinates?: LatLngLiteral;
	},
) {
	const result = await db
		.updateTable("restaurant")
		.set((eb) => ({
			...values,
			coordinates: values.coordinates
				? eb.fn("ST_MakePoint", [
						sql`${values.coordinates.lat}, ${values.coordinates.lng}`,
					])
				: undefined,
		}))
		.where("id", "=", id)
		.returning(selectWithCoordinates)
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

export async function checkRestaurantOwner(
	id: Restaurant["id"],
	ownerId: Restaurant["owner_id"],
) {
	const { owner_id } = await db
		.selectFrom("restaurant")
		.select("owner_id")
		.where("id", "=", id)
		.executeTakeFirstOrThrow();

	return owner_id === ownerId;
}
