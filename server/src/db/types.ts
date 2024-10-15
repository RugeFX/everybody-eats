import { Generated } from "kysely";

export interface Database {
  foo: FooTable;
}

export interface FooTable {
  id: Generated<number>;
  value: string;
}
