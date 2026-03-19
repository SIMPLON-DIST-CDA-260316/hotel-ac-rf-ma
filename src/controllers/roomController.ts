import * as roomModel from "@/models/roomModel";

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

export async function createRoom(data: roomModel.CreateRoomDTO) {
    return await roomModel.createRoom(data);
}

export async function updateRoom(id: number, data: roomModel.UpdateRoomDTO) {
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