import { db } from "@/db/client";
import { gallery } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Gallery = {
    id: number;
    room_id: number | null;
    image_path: string | null;
};

export type UpdateGalleryDTO = Partial<Omit<Gallery, "id" | "created_at" | "updated_at">>;

// ============= QUERIES =============

export async function getGalleryById(id: number): Promise<Gallery | null> {
    const result = await db.select().from(gallery).where(eq(gallery.id, id)).limit(1);
    return result.length > 0 ? (result[0] as Gallery) : null;
}

export async function getAllGalleries(): Promise<Gallery[]> {
    return await db.select().from(gallery);
}

// ============= MUTATIONS =============

export async function updateGallery(id: number, data: UpdateGalleryDTO): Promise<void> {
    await db.update(gallery).set(data).where(eq(gallery.id, id));
}

export async function deleteGallery(id: number): Promise<void> {
    await db.delete(gallery).where(eq(gallery.id, id));
}

