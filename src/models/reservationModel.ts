import { db } from "@/db/client";
import { reservation } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Reservation = {
    id: number;
    user_id: string | null;
    room_id: number | null;
    startAt: Date;
    finishAt: Date;
    status: string;
};

export type UpdateReservationDTO = Partial<Omit<Reservation, "id" | "created_at" | "updated_at">>;

// ============= QUERIES =============

export async function getReservationById(id: number): Promise<Reservation | null> {
    const result = await db.select().from(reservation).where(eq(reservation.id, id)).limit(1);
    return result.length > 0 ? (result[0] as Reservation) : null;
}

export async function getAllReservations(): Promise<Reservation[]> {
    return await db.select().from(reservation);
}

// ============= MUTATIONS =============

export async function updateReservation(id: number, data: UpdateReservationDTO): Promise<void> {
    await db.update(reservation).set(data).where(eq(reservation.id, id));
}

export async function deleteReservation(id: number): Promise<void> {
    await db.delete(reservation).where(eq(reservation.id, id));
}

