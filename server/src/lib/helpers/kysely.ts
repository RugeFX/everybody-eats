import { type Expression, sql } from "kysely";

export function ST_X(expr: Expression<unknown>) {
	return sql<number>`ST_X(${expr})`;
}

export function ST_Y(expr: Expression<unknown>) {
	return sql<number>`ST_Y(${expr})`;
}
