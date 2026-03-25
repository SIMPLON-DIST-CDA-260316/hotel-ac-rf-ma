import { db } from "@/db/client";
import { room, reservation } from "@/db/schema";
import { eq, and, gte, ne } from "drizzle-orm";

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
    return (await db.select().from(room)) as Room[];
}

export async function getRoomsByEstablishmentId(establishmentId: number): Promise<Room[]> {
    return (await db.select().from(room).where(eq(room.establishment_id, establishmentId))) as Room[];
}

export async function createRoom(data: CreateRoomDTO): Promise<Room> {
    const result = await db.insert(room).values({
        name: data.name,
        description: data.description,
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

export async function hasActiveOrFutureReservationsForRoom(id: number): Promise<boolean> {
    const now = new Date();

    const rows = await db
        .select({ reservationId: reservation.id })
        .from(reservation)
        .where(
            and(
                eq(reservation.room_id, id),
                ne(reservation.status, "cancelled"),
                gte(reservation.finishAt, now)
            )
        )
        .limit(1);

    return rows.length > 0;
}

export async function isRoomInEstablishment(roomId: number, establishmentId: number): Promise<boolean> {
    const result = await db
        .select({ id: room.id })
        .from(room)
        .where(
            and(
                eq(room.id, roomId),
                eq(room.establishment_id, establishmentId)
            )
        )
        .limit(1);

    return !!result[0];
}

export async function getEstablishmentIdByRoomId(roomId: number): Promise<number | null> {
    const result = await db
        .select({ establishment_id: room.establishment_id })
        .from(room)
        .where(eq(room.id, roomId))
        .limit(1);

    return result[0]?.establishment_id ?? null;
}

export async function updateRoom(id: number, data: UpdateRoomDTO): Promise<void> {
    const payload: UpdateRoomDTO = {};

    if (data.name !== undefined) payload.name = data.name;
    if (data.description !== undefined) payload.description = data.description;
    if (data.image_path !== undefined) payload.image_path = data.image_path;
    if (data.capacity !== undefined) payload.capacity = data.capacity;
    if (data.price !== undefined) payload.price = data.price;
    if (data.establishment_id !== undefined) payload.establishment_id = data.establishment_id;

    if (Object.keys(payload).length === 0) {
        return;
    }

    await db.update(room).set(payload).where(eq(room.id, id));
}

export async function deleteRoom(id: number): Promise<void> {
    await db.delete(room).where(eq(room.id, id));
}