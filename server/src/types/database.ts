import type {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from "kysely";
import type { Session } from "@/lib/auth";

export interface Database {
	/* Auth tables */
	user: Session["user"];
	session: Session["session"];
	/* Main tables */
	restaurant: RestaurantTable;
}

/* Default field definitions for most tables (timestamps, etc) */
interface TableDefaults {
	created_at: ColumnType<Date, string | undefined, never>;
	updated_at: ColumnType<Date, string | undefined, never>;
}

/* Restaurant table type definitions */
export interface RestaurantTable extends TableDefaults {
	id: Generated<number>;
	owner_id: string;
	name: string;
	description: string;
	category: string;
	address: string;
	coordinates: string;
}
export type Restaurant = Selectable<RestaurantTable>;
export type NewRestaurant = Insertable<RestaurantTable>;
export type UpdateRestaurant = Updateable<RestaurantTable>;

export interface FoodNoteTable {
	id: Generated<number>;
}
