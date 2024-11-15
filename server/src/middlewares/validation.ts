import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "hono";
import { ZodSchema } from "zod";

const zodValidator = <T>(
	schema: ZodSchema<T>,
	target?: keyof ValidationTargets,
) =>
	zValidator(target ?? "json", schema, (result) => {
		if (!result.success) throw result.error;
	});

export default zodValidator;
