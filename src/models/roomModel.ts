import { db } from "@/db/client";
import { room } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Room = {
    id: number;
    establishment_id: number | null;
    price: number | null;
    capacity: number | null;
    description: string;
    image_path: string | null;
};

export type UpdateRoomDTO = Partial<Omit<Room, "id" | "created_at" | "updated_at">>;

// ============= QUERIES =============

export async function getRoomById(id: number): Promise<Room | null> {
    const result = await db.select().from(room).where(eq(room.id, id)).limit(1);
    return result.length > 0 ? (result[0] as Room) : null;
}

export async function getAllRooms(): Promise<Room[]> {
    return await db.select().from(room);
}

// ============= MUTATIONS =============

export async function updateRoom(id: number, data: UpdateRoomDTO): Promise<void> {
    await db.update(room).set(data).where(eq(room.id, id));
}

export async function deleteRoom(id: number): Promise<void> {
    await db.delete(room).where(eq(room.id, id));
}

