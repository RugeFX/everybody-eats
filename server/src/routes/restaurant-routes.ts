import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import authenticationMiddleware from "@/middlewares/authentication";
import {
	checkRestaurantOwner,
	createRestaurant,
	deleteRestaurant,
	getAllRestaurants,
	getRestaurantById,
	updateRestaurant,
} from "@/repositories/restaurant-repository";
import jsonValidator from "@/middlewares/validation";
import type { ContextWithUser } from "@/types/context";

const restaurantRoutes = new Hono<ContextWithUser>();

// TODO: only disable authentication middleware for dev purposes
restaurantRoutes.use("/*", authenticationMiddleware);

// TODO: move this somewhere else?
const validationSchema = z.object({
	name: z.string(),
	description: z.string(),
	address: z.string(),
	category: z.string(),
	coordinates: z.object({
		lat: z.number(),
		lng: z.number(),
	}),
});

restaurantRoutes.get("/", async (c) => {
	const data = await getAllRestaurants();

	return c.json({ message: "Restaurants list", data });
});

restaurantRoutes.get("/:id", async (c) => {
	const id = parseInt(c.req.param("id"));

	if (!id)
		throw new HTTPException(404, { message: "Record not found, invalid ID" });

	const data = await getRestaurantById(id);

	return c.json({ data });
});

restaurantRoutes.post("/", jsonValidator(validationSchema), async (c) => {
	const data = await createRestaurant({
		owner_id: c.var.user.id,
		...c.req.valid("json"),
	});

	return c.json({ message: "Restaurant details", data });
});

restaurantRoutes.put(
	"/:id",
	jsonValidator(validationSchema.partial()),
	async (c) => {
		const id = parseInt(c.req.param("id"));

		if (!id)
			throw new HTTPException(404, { message: "Record not found, invalid ID" });

		const check = await checkRestaurantOwner(id, c.var.user.id);
		if (!check) throw new HTTPException(401, { message: "Unauthorized" });

		const data = await updateRestaurant(id, c.req.valid("json"));

		return c.json({ message: "Successfully updated restaurant", data });
	},
);

restaurantRoutes.delete("/:id", async (c) => {
	const id = parseInt(c.req.param("id"));

	if (!id)
		throw new HTTPException(404, { message: "Record not found, invalid ID" });

	const check = await checkRestaurantOwner(id, c.var.user.id);
	if (!check) throw new HTTPException(401, { message: "Unauthorized" });

	const data = await deleteRestaurant(id);

	return c.json({ message: "Successfully deleted restaurant", data });
});

export default restaurantRoutes;
