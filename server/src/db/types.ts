import type { ColumnType, Generated } from "kysely";
import type { Session } from "../lib/auth";

export interface Database {
	/* Auth tables */
	user: Session["user"];
	session: Session["session"];
	/* Main tables */
	restaurant: RestaurantTable;
}

export interface RestaurantTable {
	id: Generated<number>;
	name: string;
	description: string;
	category: string;
	lat: number;
	lng: number;
	created_at: ColumnType<Date, string | undefined, never>;
	updated_at: ColumnType<Date, string | undefined>;
}
