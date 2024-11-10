import type {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from "kysely";

export interface Database {
	user: UserTable;
	session: SessionTable;
	restaurant: RestaurantTable;
}

/* Default field definitions for most tables (timestamps, etc) */
interface TableDefaults {
	created_at: ColumnType<Date, string | undefined, never>;
	updated_at: ColumnType<Date, string | undefined, never>;
}

/* Authentication table definitions */
export interface SessionTable {
	id: string;
	user_id: number;
	expires_at: Date;
}

export interface UserTable {
	id: Generated<number>;
	full_name: string;
	username: string;
	email: string;
	password: string;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdateUser = Updateable<UserTable>;

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
