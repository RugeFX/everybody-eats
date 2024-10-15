import { betterAuth } from "better-auth";
import { dialect as database } from "../db";

export const auth = betterAuth({
  database,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: "id",
      clientSecret: "secret",
    },
  },
});
