import { db } from "@/db/client";
import { gallery, room } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Gallery = {
    id: number;
    image_path: string | null;
    room_id: number | null;
};

export type CreateGalleryDTO = {
    image_path?: string | null;
    room_id?: number | null;
};

export type UpdateGalleryDTO = Partial<CreateGalleryDTO>;

export async function getGalleryById(id: number): Promise<Gallery | null> {
    const result = await db.select().from(gallery).where(eq(gallery.id, id)).limit(1);
    return result.length > 0 ? (result[0] as Gallery) : null;
}

export async function getGalleriesByRoomId(roomId: number): Promise<Gallery[]> {
    return (await db.select().from(gallery).where(eq(gallery.room_id, roomId))) as Gallery[];
}

export async function getAllGalleries(): Promise<Gallery[]> {
    return (await db.select().from(gallery)) as Gallery[];
}

export async function createGallery(data: CreateGalleryDTO): Promise<Gallery> {
    const result = await db.insert(gallery).values({
        image_path: data.image_path ?? null,
        room_id: data.room_id ?? null,
    });

    const insertedId = Number((result as { insertId?: number }).insertId);
    if (!insertedId) {
        throw new Error("Impossible de récupérer l'ID de la galerie créée");
    }

    const created = await db.select().from(gallery).where(eq(gallery.id, insertedId)).limit(1);
    if (!created[0]) {
        throw new Error("Galerie créée mais introuvable en base");
    }

    return created[0] as Gallery;
}

export async function updateGallery(id: number, data: UpdateGalleryDTO): Promise<void> {
    const payload: UpdateGalleryDTO = {};

    if (data.image_path !== undefined) payload.image_path = data.image_path;
    if (data.room_id !== undefined) payload.room_id = data.room_id;

    if (Object.keys(payload).length === 0) {
        return;
    }

    await db.update(gallery).set(payload).where(eq(gallery.id, id));
}

export async function deleteGallery(id: number): Promise<void> {
    await db.delete(gallery).where(eq(gallery.id, id));
}

export async function getGalleryWithRoomInfo(id: number): Promise<(Gallery & { establishment_id: number | null }) | null> {
    const result = await db
        .select({
            id: gallery.id,
            image_path: gallery.image_path,
            room_id: gallery.room_id,
            establishment_id: room.establishment_id,
        })
        .from(gallery)
        .innerJoin(room, eq(gallery.room_id, room.id))
        .where(eq(gallery.id, id))
        .limit(1);

    return result.length > 0 ? (result[0] as Gallery & { establishment_id: number | null }) : null;
}