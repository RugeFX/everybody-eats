import { Client as MapsClient } from "@googlemaps/google-maps-services-js";
import { Hono } from "hono";
import { logger } from "@/lib/logger";

const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

const maps = new Hono();
const mapsClient = new MapsClient();

maps.get("/", async (c) => {
	const directions = await mapsClient.directions({
		params: {
			origin: {
				lat: 37.77,
				lng: -122.42,
			},
			destination: {
				lat: 37.79,
				lng: -122.41,
			},
			key: MAPS_API_KEY,
		},
		timeout: 1000,
	});

	logger.info("DirectionsData: %o", directions.data);

	return c.json({ directions: directions.data });
});

export default maps;
