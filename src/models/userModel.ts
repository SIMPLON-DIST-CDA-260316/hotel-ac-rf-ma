
import { db } from "@/db/client";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export type User = {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: boolean;
    image?: string | null;
};

export type UpdateUserDTO = Partial<{
    email: string;
    name: string;
    image: string | null;
}>;

export async function getUserById(id: string): Promise<User | null> {
    const result = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return (result[0] as User) ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(user).where(eq(user.email, email)).limit(1);
    return (result[0] as User) ?? null;
}

export async function getAllUsers(): Promise<User[]> {
    return (await db.select().from(user)) as User[];
}

export async function getUsersByRole(role: string): Promise<User[]> {
    return (await db.select().from(user).where(eq(user.role, role))) as User[];
}

export async function updateUser(id: string, data: UpdateUserDTO): Promise<void> {
    const payload: UpdateUserDTO = {};

    if (data.email !== undefined) payload.email = data.email;
    if (data.name !== undefined) payload.name = data.name;
    if (data.image !== undefined) payload.image = data.image;

    if (Object.keys(payload).length === 0) {
        return;
    }

    await db.update(user).set(payload).where(eq(user.id, id));
}

export async function updateUserRole(id: string, role: string): Promise<void> {
    await db.update(user).set({ role }).where(eq(user.id, id));
}

export async function deleteUser(id: string): Promise<void> {
    await db.delete(user).where(eq(user.id, id));
}

export async function isRoleValid(role: string): Promise<boolean> {
    return role === "user" || role === "admin" || role === "manager";
}

export async function emailExists(email: string, excludeUserId?: string): Promise<boolean> {
    const result = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, email))
        .limit(1);

    if (!result[0]) return false;

    if (excludeUserId && result[0].id === excludeUserId) {
        return false;
    }

    return true;
}