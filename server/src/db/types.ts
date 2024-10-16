import { Generated } from "kysely";
import { Session } from "../lib/auth";

export interface Database {
  foo: FooTable;
  user: Session["user"];
  session: Session["session"];
}

export interface FooTable {
  id: Generated<number>;
  value: string;
}
