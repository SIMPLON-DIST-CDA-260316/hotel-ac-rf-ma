import * as galleryModel from "@/models/galleryModel";
import * as roomModel from "@/models/roomModel";
import * as establishmentModel from "@/models/establishmentModel";

export async function getGalleryById(id: number) {
    const gallery = await galleryModel.getGalleryById(id);
    if (!gallery) {
        throw new Error(`Galerie ${id} non trouvée`);
    }
    return gallery;
}

export async function getGalleriesByRoomId(roomId: number) {
    return await galleryModel.getGalleriesByRoomId(roomId);
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

export async function canManagerAccessGallery(managerId: string, galleryId: number): Promise<boolean> {
    const gallery = await galleryModel.getGalleryWithRoomInfo(galleryId);
    if (!gallery || !gallery.establishment_id) {
        return false;
    }

    const managerEstablishment = await establishmentModel.getEstablishmentByManagerId(managerId);
    if (!managerEstablishment) {
        return false;
    }

    return managerEstablishment.id === gallery.establishment_id;
}

export async function createGalleryForRoom(roomId: number, data: galleryModel.CreateGalleryDTO) {
    const room = await roomModel.getRoomById(roomId);
    if (!room) {
        throw new Error("Chambre non trouvée");
    }

    return await galleryModel.createGallery({
        image_path: data.image_path ?? null,
        room_id: roomId,
    });
}