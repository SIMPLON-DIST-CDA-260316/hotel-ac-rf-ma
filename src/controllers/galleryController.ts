import * as galleryModel from "@/models/galleryModel";

export async function getGalleryById(id: number) {
    const gallery = await galleryModel.getGalleryById(id);
    if (!gallery) {
        throw new Error(`Galerie ${id} non trouvée`);
    }
    return gallery;
}

export async function getAllGalleries() {
    return await galleryModel.getAllGalleries();
}

export async function createGallery(data: galleryModel.CreateGalleryDTO) {
    return await galleryModel.createGallery(data);
}

export async function updateGallery(id: number, data: galleryModel.UpdateGalleryDTO) {
    const gallery = await galleryModel.getGalleryById(id);
    if (!gallery) {
        throw new Error(`Galerie ${id} non trouvée`);
    }

    await galleryModel.updateGallery(id, data);
}

export async function deleteGallery(id: number) {
    const gallery = await galleryModel.getGalleryById(id);
    if (!gallery) {
        throw new Error(`Galerie ${id} non trouvée`);
    }

    await galleryModel.deleteGallery(id);
}