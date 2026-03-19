import * as reservationModel from "@/models/reservationModel";

export async function getReservationById(id: number) {
    const reservation = await reservationModel.getReservationById(id);
    if (!reservation) {
        throw new Error(`Réservation ${id} non trouvée`);
    }
    return reservation;
}

export async function getAllReservations() {
    return await reservationModel.getAllReservations();
}

export async function createReservation(data: reservationModel.CreateReservationDTO) {
    return await reservationModel.createReservation(data);
}

export async function updateReservation(id: number, data: reservationModel.UpdateReservationDTO) {
    const reservation = await reservationModel.getReservationById(id);
    if (!reservation) {
        throw new Error(`Réservation ${id} non trouvée`);
    }

    await reservationModel.updateReservation(id, data);
}

export async function deleteReservation(id: number) {
    const reservation = await reservationModel.getReservationById(id);
    if (!reservation) {
        throw new Error(`Réservation ${id} non trouvée`);
    }

    await reservationModel.deleteReservation(id);
}