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

/* Restaurant table type definitions */
export interface RestaurantTable {
	id: Generated<number>;
	name: string;
	description: string;
	category: string;
	lat: number;
	lng: number;
	created_at: ColumnType<Date, string | undefined, never>;
	updated_at: ColumnType<Date, string | undefined, never>;
}
export type Restaurant = Selectable<RestaurantTable>;
export type NewRestaurant = Insertable<RestaurantTable>;
export type UpdateRestaurant = Updateable<RestaurantTable>;
