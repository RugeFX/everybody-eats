import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { db } from "../db";

export const auth = betterAuth({
  database: {
    db,
    type: "postgres",
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // TODO: add google auth credentials
    google: {
      clientId: "id",
      clientSecret: "secret",
    },
  },
  plugins: [bearer()],
});

export type Session = typeof auth.$Infer.Session;
