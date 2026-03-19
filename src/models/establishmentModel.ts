import { db } from "@/db/client";
import { establishment } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Establishment = {
    id: number;
    name: string;
    description: string;
    image_path: string | null;
    address: string;
    region: string;
    city: string;
};

export type UpdateEstablishmentDTO = Partial<Omit<Establishment, "id" | "created_at" | "updated_at">>;

// ============= QUERIES =============

export async function getEstablishmentById(id: number): Promise<Establishment | null> {
    const result = await db.select().from(establishment).where(eq(establishment.id, id)).limit(1);
    return result.length > 0 ? (result[0] as Establishment) : null;
}

export async function getAllEstablishments(): Promise<Establishment[]> {
    return await db.select().from(establishment);
}

// ============= MUTATIONS =============

export async function updateEstablishment(id: number, data: UpdateEstablishmentDTO): Promise<void> {
    await db.update(establishment).set(data).where(eq(establishment.id, id));
}

export async function deleteEstablishment(id: number): Promise<void> {
    await db.delete(establishment).where(eq(establishment.id, id));
}

