import {
    pgTable,
    serial,
    varchar,
    text,
    numeric,
    timestamp,
    boolean,
    index,
    integer,
} from "drizzle-orm/pg-core";

// ----------------------
// Table user (Better-auth compatible)
// ----------------------
export const user = pgTable("user", {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 100 }).default("user").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

// ----------------------
// Table session (Better-auth)
// ----------------------
export const session = pgTable(
    "session",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
        token: varchar("token", { length: 255 }).notNull().unique(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: varchar("user_id", { length: 36 })
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

// ----------------------
// Table account (Better-auth - OAuth)
// ----------------------
export const account = pgTable(
    "account",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: varchar("user_id", { length: 36 })
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

// ----------------------
// Table establishment
// ----------------------
export const establishment = pgTable(
    "establishment",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description").notNull(),
        image_path: text("image_path"),
        address: varchar("address", { length: 255 }).notNull(),
        region: varchar("region", { length: 255 }).notNull(),
        city: varchar("city", { length: 255 }).notNull(),
        manager_id: varchar("manager_id", { length: 255 }).references(() => user.id, {
            onDelete: "set null",
        }),
    },
    (table) => [index("establishment_manager_id_idx").on(table.manager_id)],
);

// ----------------------
// Table room
// ----------------------
export const room = pgTable(
    "room",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description").notNull(),
        image_path: text("image_path"),
        capacity: integer("capacity"),
        price: numeric("price", { precision: 10, scale: 2 }),
        establishment_id: integer("establishment_id")
            .notNull()
            .references(() => establishment.id, { onDelete: "cascade" }),
    },
    (table) => [index("room_establishment_id_idx").on(table.establishment_id)],
);

// ----------------------
// Table gallery
// ----------------------
export const gallery = pgTable(
    "gallery",
    {
        id: serial("id").primaryKey(),
        image_path: text("image_path").notNull(),
        room_id: integer("room_id")
            .notNull()
            .references(() => room.id, { onDelete: "cascade" }),
    },
    (table) => [index("gallery_room_id_idx").on(table.room_id)],
);

// ----------------------
// Table reservation
// ----------------------
export const reservation = pgTable(
    "reservation",
    {
        id: serial("id").primaryKey(),
        user_id: varchar("user_id", { length: 255 })
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        room_id: integer("room_id")
            .notNull()
            .references(() => room.id, { onDelete: "cascade" }),
        startAt: timestamp("startAt", { withTimezone: true }).notNull(),
        finishAt: timestamp("finishAt", { withTimezone: true }).notNull(),
        person_number: integer("person_number"),
        status: varchar("status", { length: 100 }).notNull(),
    },
    (table) => [
        index("reservation_user_id_idx").on(table.user_id),
        index("reservation_room_id_idx").on(table.room_id),
    ],
);