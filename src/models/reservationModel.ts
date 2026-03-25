import { db } from "@/db/client";
import { reservation, room } from "@/db/schema";
import { eq, and, gte, lte, ne } from "drizzle-orm";

export type Reservation = {
    id: number;
    user_id: string | null;
    room_id: number | null;
    startAt: Date;
    finishAt: Date;
    person_number: number | null;
    status: string;
};

export type CreateReservationDTO = {
    user_id?: string | null;
    room_id?: number | null;
    startAt: Date;
    finishAt: Date;
    person_number?: number | null;
    status?: string;
};

export type UpdateReservationDTO = Partial<CreateReservationDTO>;

export async function getReservationById(id: number): Promise<Reservation | null> {
    const result = await db.select().from(reservation).where(eq(reservation.id, id)).limit(1);
    return result.length > 0 ? (result[0] as Reservation) : null;
}

export async function getAllReservations(): Promise<Reservation[]> {
    return (await db.select().from(reservation)) as Reservation[];
}

export async function getReservationsByUserId(userId: string): Promise<Reservation[]> {
    return (await db.select().from(reservation).where(eq(reservation.user_id, userId))) as Reservation[];
}

export async function getReservationsByRoomId(roomId: number): Promise<Reservation[]> {
    return (await db.select().from(reservation).where(eq(reservation.room_id, roomId))) as Reservation[];
}

export async function getReservationsByEstablishmentId(establishmentId: number): Promise<Reservation[]> {
    return (await db
        .select({
            id: reservation.id,
            user_id: reservation.user_id,
            room_id: reservation.room_id,
            startAt: reservation.startAt,
            finishAt: reservation.finishAt,
            person_number: reservation.person_number,
            status: reservation.status,
        })
        .from(reservation)
        .innerJoin(room, eq(reservation.room_id, room.id))
        .where(eq(room.establishment_id, establishmentId))) as Reservation[];
}

export async function createReservation(data: CreateReservationDTO): Promise<Reservation> {
    const result = await db.insert(reservation).values({
        user_id: data.user_id ?? null,
        room_id: data.room_id ?? null,
        startAt: data.startAt,
        finishAt: data.finishAt,
        person_number: data.person_number ?? null,
        status: data.status ?? "pending",
    });

    const insertedId = Number((result as { insertId?: number }).insertId);
    if (!insertedId) {
        throw new Error("Impossible de récupérer l'ID de la réservation créée");
    }

    const created = await db.select().from(reservation).where(eq(reservation.id, insertedId)).limit(1);
    if (!created[0]) {
        throw new Error("Réservation créée mais introuvable en base");
    }

    return created[0] as Reservation;
}

export async function updateReservation(id: number, data: UpdateReservationDTO): Promise<void> {
    const payload: UpdateReservationDTO = {};

    if (data.user_id !== undefined) payload.user_id = data.user_id;
    if (data.room_id !== undefined) payload.room_id = data.room_id;
    if (data.startAt !== undefined) payload.startAt = data.startAt;
    if (data.finishAt !== undefined) payload.finishAt = data.finishAt;
    if (data.person_number !== undefined) payload.person_number = data.person_number;
    if (data.status !== undefined) payload.status = data.status;

    if (Object.keys(payload).length === 0) {
        return;
    }

    await db.update(reservation).set(payload).where(eq(reservation.id, id));
}

export async function deleteReservation(id: number): Promise<void> {
    await db.delete(reservation).where(eq(reservation.id, id));
}

export async function hasFutureOrCurrentReservationForRoom(roomId: number): Promise<boolean> {
    const now = new Date();

    const rows = await db
        .select({ id: reservation.id })
        .from(reservation)
        .where(
            and(
                eq(reservation.room_id, roomId),
                ne(reservation.status, "cancelled"),
                gte(reservation.finishAt, now)
            )
        )
        .limit(1);

    return rows.length > 0;
}

export async function hasOverlapReservation(roomId: number, startAt: Date, finishAt: Date): Promise<boolean> {
    const rows = await db
        .select({ id: reservation.id })
        .from(reservation)
        .where(
            and(
                eq(reservation.room_id, roomId),
                ne(reservation.status, "cancelled"),
                lte(reservation.startAt, finishAt),
                gte(reservation.finishAt, startAt)
            )
        )
        .limit(1);

    return rows.length > 0;
}

export async function canCancelReservation(id: number): Promise<boolean> {
    const res = await getReservationById(id);
    if (!res) {
        return false;
    }

    const now = new Date();
    const minCancelDate = new Date(res.startAt);
    minCancelDate.setDate(minCancelDate.getDate() - 3);

    return now <= minCancelDate;
}

export async function cancelReservationInDb(id: number): Promise<void> {
    await db.update(reservation).set({ status: "cancelled" }).where(eq(reservation.id, id));
}