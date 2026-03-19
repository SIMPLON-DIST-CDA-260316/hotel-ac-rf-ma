import * as roomModel from "@/models/roomModel";
import type { UpdateRoomDTO } from "@/models/roomModel";

// ============= BUSINESS LOGIC =============

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

export async function updateRoom(id: number, data: UpdateRoomDTO) {
    const room = await roomModel.getRoomById(id);
    if (!room) {
        throw new Error(`Chambre ${id} non trouvée`);
    }

    await roomModel.updateRoom(id, data);
}

export async function deleteRoom(id: number) {
    const room = await roomModel.getRoomById(id);
    if (!room) {
        throw new Error(`Chambre ${id} non trouvée`);
    }

    await roomModel.deleteRoom(id);
}

