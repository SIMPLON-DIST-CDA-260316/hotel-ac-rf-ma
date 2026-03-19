import * as reservationModel from "@/models/reservationModel";
import type { UpdateReservationDTO } from "@/models/reservationModel";

// ============= BUSINESS LOGIC =============

export async function getReservationById(id: number) {
    const res = await reservationModel.getReservationById(id);
    if (!res) {
        throw new Error(`Réservation ${id} non trouvée`);
    }
    return res;
}

export async function getAllReservations() {
    return await reservationModel.getAllReservations();
}

export async function updateReservation(id: number, data: UpdateReservationDTO) {
    const res = await reservationModel.getReservationById(id);
    if (!res) {
        throw new Error(`Réservation ${id} non trouvée`);
    }

    await reservationModel.updateReservation(id, data);
}

export async function deleteReservation(id: number) {
    const res = await reservationModel.getReservationById(id);
    if (!res) {
        throw new Error(`Réservation ${id} non trouvée`);
    }

    await reservationModel.deleteReservation(id);
}

