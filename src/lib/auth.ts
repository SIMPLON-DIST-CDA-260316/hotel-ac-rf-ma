import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/client";
import * as schema from "@/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },
    plugins: [nextCookies()],
    secret: process.env.BETTER_AUTH_SECRET,
    appName: "Hotel Clair de Lune",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});