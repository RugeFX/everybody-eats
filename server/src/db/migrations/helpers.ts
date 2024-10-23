import { sql, type CreateTableBuilder } from "kysely";

export const addTimestamps = <T extends string, C extends string = never>(
	builder: CreateTableBuilder<T, C>,
) => {
	return builder
		.addColumn("created_at", "timestamp", (col) =>
			col.notNull().defaultTo(sql`now()`),
		)
		.addColumn("updated_at", "timestamp", (col) =>
			col.notNull().defaultTo(sql`now()`),
		);
};
