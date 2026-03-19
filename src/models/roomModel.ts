import { db } from "@/db/client";
import { room } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Room = {
    id: number;
    name: string;
    description: string;
    image_path: string | null;
    capacity: number | null;
    price: number | null;
    establishment_id: number | null;
};

export type CreateRoomDTO = {
    name: string;
    description: string;
    image_path?: string | null;
    capacity?: number | null;
    price?: number | null;
    establishment_id?: number | null;
};

export type UpdateRoomDTO = Partial<CreateRoomDTO>;

export async function getRoomById(id: number): Promise<Room | null> {
    const result = await db.select().from(room).where(eq(room.id, id)).limit(1);
    return result.length > 0 ? (result[0] as Room) : null;
}

export async function getAllRooms(): Promise<Room[]> {
    return await db.select().from(room) as Room[];
}

export async function createRoom(data: CreateRoomDTO): Promise<Room> {
    const result = await db.insert(room).values({
        ...data,
        image_path: data.image_path ?? null,
        capacity: data.capacity ?? null,
        price: data.price ?? null,
        establishment_id: data.establishment_id ?? null,
    });

    const insertedId = Number((result as { insertId?: number }).insertId);
    if (!insertedId) {
        throw new Error("Impossible de récupérer l'ID de la chambre créée");
    }

    const created = await db.select().from(room).where(eq(room.id, insertedId)).limit(1);
    if (!created[0]) {
        throw new Error("Chambre créée mais introuvable en base");
    }

    return created[0] as Room;
}

export async function updateRoom(id: number, data: UpdateRoomDTO): Promise<void> {
    await db.update(room).set(data).where(eq(room.id, id));
}

export async function deleteRoom(id: number): Promise<void> {
    await db.delete(room).where(eq(room.id, id));
}