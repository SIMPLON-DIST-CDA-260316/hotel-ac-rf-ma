import { db } from "@/db/client";
import { establishment, room, reservation } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Establishment = {
    id: number;
    name: string;
    description: string;
    image_path: string | null;
    address: string;
    region: string;
    city: string;
    manager_id: string | null;
};

export type CreateEstablishmentDTO = {
    name: string;
    description: string;
    image_path?: string | null;
    address: string;
    region: string;
    city: string;
    manager_id?: string | null;
};

export type UpdateEstablishmentDTO = Partial<CreateEstablishmentDTO>;

export type FilterEstablishmentDTO = {
    region?: string | null;
    people?: number | null;
    startAt?: Date | null;
    finishAt?: Date | null;
};

export async function getEstablishmentById(id: number): Promise<Establishment | null> {
    const result = await db.select().from(establishment).where(eq(establishment.id, id)).limit(1);
    return result.length > 0 ? (result[0] as Establishment) : null;
}

export async function getAllEstablishments(): Promise<Establishment[]> {
    return await db.select().from(establishment) as Establishment[];
}

export async function createEstablishment(data: CreateEstablishmentDTO): Promise<Establishment> {
    const result = await db.insert(establishment).values({
        ...data,
        image_path: data.image_path ?? null,
        manager_id: data.manager_id ?? null,
    });

    const insertedId = Number((result as { insertId?: number }).insertId);
    if (!insertedId) {
        throw new Error("Impossible de récupérer l'ID de l'établissement créé");
    }

    const created = await db.select().from(establishment).where(eq(establishment.id, insertedId)).limit(1);
    if (!created[0]) {
        throw new Error("Établissement créé mais introuvable en base");
    }

    return created[0] as Establishment;
}

export async function updateEstablishment(id: number, data: UpdateEstablishmentDTO): Promise<void> {
    await db.update(establishment).set({
        ...data,
        image_path: data.image_path ?? null,
        manager_id: data.manager_id ?? null,
    }).where(eq(establishment.id, id));
}

export async function deleteEstablishment(id: number): Promise<void> {
    await db.delete(establishment).where(eq(establishment.id, id));
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    return aStart <= bEnd && aEnd >= bStart;
}

export async function filterEstablishments(params: FilterEstablishmentDTO): Promise<Establishment[]> {
    const allEstablishments = await getAllEstablishments();
    const allRooms = await db.select().from(room);
    const allReservations = await db.select().from(reservation);

    return allEstablishments.filter((est) => {
        if (params.region && est.region !== params.region) {
            return false;
        }

        const roomsOfEstablishment = allRooms.filter((r) => r.establishment_id === est.id);

        const suitableRooms = roomsOfEstablishment.filter((r) => {
            if (params.people !== null && params.people !== undefined) {
                const capacity = r.capacity ?? 0;
                if (capacity < params.people) {
                    return false;
                }
            }

            const hasValidDates =
                params.startAt instanceof Date &&
                !Number.isNaN(params.startAt.getTime()) &&
                params.finishAt instanceof Date &&
                !Number.isNaN(params.finishAt.getTime());

            if (hasValidDates) {
                const reservationsForRoom = allReservations.filter((res) => res.room_id === r.id);

                const roomIsOccupied = reservationsForRoom.some((res) => {
                    return overlaps(
                        params.startAt as Date,
                        params.finishAt as Date,
                        res.startAt,
                        res.finishAt
                    );
                });

                if (roomIsOccupied) {
                    return false;
                }
            }

            return true;
        });

        return suitableRooms.length > 0;
    });
}