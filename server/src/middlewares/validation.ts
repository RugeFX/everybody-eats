import { zValidator } from "@hono/zod-validator";
import { z, ZodSchema } from "zod";

const jsonValidator = <T>(schema: ZodSchema<T>) =>
	zValidator("json", schema, (result) => {
		if (!result.success) throw result.error;
	});

export default jsonValidator;
