import * as reservationModel from "@/models/reservationModel";
import * as roomModel from "@/models/roomModel";

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

export async function getReservationsByUserId(userId: string) {
    return await reservationModel.getReservationsByUserId(userId);
}

export async function getReservationsByEstablishmentId(establishmentId: number) {
    return await reservationModel.getReservationsByEstablishmentId(establishmentId);
}

export async function createReservation(data: reservationModel.CreateReservationDTO) {
    if (!data.room_id) {
        throw new Error("Chambre requise");
    }

    if (!(data.startAt instanceof Date) || Number.isNaN(data.startAt.getTime())) {
        throw new Error("Date de début invalide");
    }

    if (!(data.finishAt instanceof Date) || Number.isNaN(data.finishAt.getTime())) {
        throw new Error("Date de fin invalide");
    }

    if (data.startAt >= data.finishAt) {
        throw new Error("La date de fin doit être après la date de début");
    }

    const room = await roomModel.getRoomById(data.room_id);
    if (!room) {
        throw new Error("Chambre introuvable");
    }

    const isOccupied = await reservationModel.hasOverlapReservation(data.room_id, data.startAt, data.finishAt);
    if (isOccupied) {
        throw new Error("Cette chambre n'est pas disponible pour les dates sélectionnées");
    }

    return await reservationModel.createReservation({
        ...data,
        status: data.status ?? "pending",
    });
}

export async function updateReservation(id: number, data: reservationModel.UpdateReservationDTO) {
    const reservation = await reservationModel.getReservationById(id);
    if (!reservation) {
        throw new Error(`Réservation ${id} non trouvée`);
    }

    await reservationModel.updateReservation(id, data);
}

export async function cancelReservation(
    id: number,
    options?: { bypassDeadline?: boolean }
) {
    const reservation = await reservationModel.getReservationById(id);
    if (!reservation) {
        throw new Error(`Réservation ${id} non trouvée`);
    }

    if (!options?.bypassDeadline) {
        const canCancel = await reservationModel.canCancelReservation(id);
        if (!canCancel) {
            throw new Error("L'annulation doit être faite au moins 3 jours avant le séjour");
        }
    }

    if (reservation.status !== "cancelled") {
        await reservationModel.cancelReservationInDb(id);
    }
}