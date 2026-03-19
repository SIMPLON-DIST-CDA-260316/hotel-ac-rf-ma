import { db } from "@/db/client";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export type User = {
    id: string;
    email: string;
    role: string;
};

export type UpdateUserDTO = Partial<Omit<User, "id">>;

// ============= QUERIES =============

export async function getUserById(id: string): Promise<User | null> {
    const result = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return result.length > 0 ? (result[0] as User) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(user).where(eq(user.email, email)).limit(1);
    return result.length > 0 ? (result[0] as User) : null;
}

export async function getAllUsers(): Promise<User[]> {
    return await db.select().from(user);
}

// ============= MUTATIONS =============

export async function updateUser(id: string, data: UpdateUserDTO): Promise<void> {
    await db.update(user).set(data).where(eq(user.id, id));
}

export async function deleteUser(id: string): Promise<void> {
    await db.delete(user).where(eq(user.id, id));
}

