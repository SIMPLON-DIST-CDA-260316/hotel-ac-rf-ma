import * as galleryModel from "@/models/galleryModel";
import type { UpdateGalleryDTO } from "@/models/galleryModel";

// ============= BUSINESS LOGIC =============

export async function getGalleryById(id: number) {
    const gal = await galleryModel.getGalleryById(id);
    if (!gal) {
        throw new Error(`Galerie ${id} non trouvée`);
    }
    return gal;
}

export async function getAllGalleries() {
    return await galleryModel.getAllGalleries();
}

export async function updateGallery(id: number, data: UpdateGalleryDTO) {
    const gal = await galleryModel.getGalleryById(id);
    if (!gal) {
        throw new Error(`Galerie ${id} non trouvée`);
    }

    await galleryModel.updateGallery(id, data);
}

export async function deleteGallery(id: number) {
    const gal = await galleryModel.getGalleryById(id);
    if (!gal) {
        throw new Error(`Galerie ${id} non trouvée`);
    }

    await galleryModel.deleteGallery(id);
}

