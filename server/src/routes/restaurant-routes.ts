import { Hono } from "hono";
import authenticationMiddleware from "@/middlewares/authentication";
import {
	createRestaurant,
	getAllRestaurants,
	getRestaurantById,
} from "@/repositories/restaurant-repository";
import { ContextWithUser } from "@/types/context";
import { z } from "zod";
import jsonValidator from "@/middlewares/validation";

const restaurant = new Hono<ContextWithUser>();

// TODO: only disable authentication middleware for dev purposes
// restaurant.use("/*", authenticationMiddleware);

restaurant.get("/", async (c) => {
	const data = await getAllRestaurants();

	return c.json({ data });
});

restaurant.get("/:id", async (c) => {
	const id = c.req.param("id");
	const data = await getRestaurantById(parseInt(id));

	return c.json({ data });
});

restaurant.post(
	"/",
	jsonValidator(
		z.object({
			name: z.string(),
			description: z.string(),
			address: z.string(),
			category: z.string(),
			lat: z.number(),
			lng: z.number(),
		}),
	),
	async (c) => {
		const data = await createRestaurant(c.req.valid("json"));

		return c.json({ data });
	},
);

export default restaurant;
