import { HTTPException } from "hono/http-exception";

export function parseNumberId(id: string) {
	const parsed = parseInt(id, 10);

	if (isNaN(parsed))
		throw new HTTPException(404, { message: "Record not found, invalid ID" });

	return parsed;
}
