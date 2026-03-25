import * as roomModel from "@/models/roomModel";
import * as establishmentModel from "@/models/establishmentModel";

export async function getRoomById(id: number) {
    const room = await roomModel.getRoomById(id);
    if (!room) {
        throw new Error(`Chambre ${id} non trouvée`);
    }
    return room;
}

export async function getAllRooms() {
    return await roomModel.getAllRooms();
}

export async function getRoomsByEstablishmentId(establishmentId: number) {
    return await roomModel.getRoomsByEstablishmentId(establishmentId);
}

export async function createRoom(data: roomModel.CreateRoomDTO) {
    if (data.establishment_id) {
        const establishment = await establishmentModel.getEstablishmentById(data.establishment_id);
        if (!establishment) {
            throw new Error(`Établissement ${data.establishment_id} non trouvé`);
        }
    }

    return await roomModel.createRoom(data);
}

export async function updateRoom(id: number, data: roomModel.UpdateRoomDTO) {
    const room = await roomModel.getRoomById(id);
    if (!room) {
        throw new Error(`Chambre ${id} non trouvée`);
    }

    if (data.establishment_id !== undefined && data.establishment_id !== null) {
        const establishment = await establishmentModel.getEstablishmentById(data.establishment_id);
        if (!establishment) {
            throw new Error(`Établissement ${data.establishment_id} non trouvé`);
        }
    }

    await roomModel.updateRoom(id, data);
}

export async function deleteRoom(id: number) {
    const room = await roomModel.getRoomById(id);
    if (!room) {
        throw new Error(`Chambre ${id} non trouvée`);
    }

    const hasReservations = await roomModel.hasActiveOrFutureReservationsForRoom(id);
    if (hasReservations) {
        throw new Error(
            "Impossible de supprimer cette chambre car des réservations en cours ou futures existent"
        );
    }

    await roomModel.deleteRoom(id);
}