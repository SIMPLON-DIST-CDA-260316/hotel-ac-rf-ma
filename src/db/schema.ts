import {mysqlTable, int, varchar, text, float, datetime, timestamp, boolean, index} from "drizzle-orm/mysql-core";

// ----------------------
// Table user (Better-auth compatible)
// ----------------------
export const user = mysqlTable("user", {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 100 }).default("user").notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

// ----------------------
// Table session (Better-auth)
// ----------------------
export const session = mysqlTable(
    "session",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
        token: varchar("token", { length: 255 }).notNull().unique(),
        createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { fsp: 3 })
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
export const account = mysqlTable(
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
        accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { fsp: 3 })
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

// ----------------------
// Table establishment
// ----------------------
export const establishment = mysqlTable("establishment", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    image_path: text("image_path"),
    address: varchar("address", { length: 255 }).notNull(),
    region: varchar("region", { length: 255 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    manager_id: varchar("manager_id", { length: 255 }),
});

// ----------------------
// Table room
// ----------------------
export const room = mysqlTable("room", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    image_path: text("image_path"),
    capacity: int("capacity"),
    price: float("price"),
    establishment_id: int("establishment_id"),
});

// ----------------------
// Table gallery
// ----------------------
export const gallery = mysqlTable("gallery", {
    id: int("id").primaryKey().autoincrement(),
    image_path: text("image_path"),
    room_id: int("room_id"),
});

// ----------------------
// Table reservation
// ----------------------
export const reservation = mysqlTable("reservation", {
    id: int("id").primaryKey().autoincrement(),
    user_id: varchar("user_id", { length: 255 }),
    room_id: int("room_id"),
    startAt: datetime("startAt").notNull(),
    finishAt: datetime("finishAt").notNull(),
    person_number: int("person_number"),
    status: varchar("status", { length: 100 }).notNull(),
});