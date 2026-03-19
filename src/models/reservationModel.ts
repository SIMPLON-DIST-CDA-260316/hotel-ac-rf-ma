import { db } from "@/db/client";
import { reservation } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    status: string;
};

export type UpdateReservationDTO = Partial<CreateReservationDTO>;

export async function getReservationById(id: number): Promise<Reservation | null> {
    const result = await db.select().from(reservation).where(eq(reservation.id, id)).limit(1);
    return result.length > 0 ? (result[0] as Reservation) : null;
}

export async function getAllReservations(): Promise<Reservation[]> {
    return await db.select().from(reservation) as Reservation[];
}

export async function createReservation(data: CreateReservationDTO): Promise<Reservation> {
    const result = await db.insert(reservation).values({
        user_id: data.user_id ?? null,
        room_id: data.room_id ?? null,
        startAt: data.startAt,
        finishAt: data.finishAt,
        person_number: data.person_number ?? null,
        status: data.status,
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
    await db.update(reservation).set(data).where(eq(reservation.id, id));
}

export async function deleteReservation(id: number): Promise<void> {
    await db.delete(reservation).where(eq(reservation.id, id));
}