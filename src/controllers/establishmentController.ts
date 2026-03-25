import * as establishmentModel from "@/models/establishmentModel";
import * as userModel from "@/models/userModel";
import type {
    CreateEstablishmentDTO,
    UpdateEstablishmentDTO,
    FilterEstablishmentDTO,
} from "@/models/establishmentModel";

export async function getEstablishmentById(id: number) {
    const est = await establishmentModel.getEstablishmentById(id);
    if (!est) {
        throw new Error(`Établissement ${id} non trouvé`);
    }
    return est;
}

export async function getAllEstablishments() {
    return await establishmentModel.getAllEstablishments();
}

export async function createEstablishment(data: CreateEstablishmentDTO) {
    return await establishmentModel.createEstablishment(data);
}

export async function updateEstablishment(id: number, data: UpdateEstablishmentDTO) {
    const est = await establishmentModel.getEstablishmentById(id);
    if (!est) {
        throw new Error(`Établissement ${id} non trouvé`);
    }

    await establishmentModel.updateEstablishment(id, data);
}

export async function deleteEstablishment(id: number) {
    const est = await establishmentModel.getEstablishmentById(id);
    if (!est) {
        throw new Error(`Établissement ${id} non trouvé`);
    }

    const hasReservations = await establishmentModel.hasActiveOrFutureReservationsForEstablishment(id);
    if (hasReservations) {
        throw new Error(
            "Impossible de supprimer cet établissement car des réservations en cours ou futures existent"
        );
    }

    await establishmentModel.deleteEstablishment(id);
}

export async function filterEstablishments(params: FilterEstablishmentDTO) {
    return await establishmentModel.filterEstablishments(params);
}

export async function assignManagerToEstablishment(establishmentId: number, managerId: string | null) {
    const establishment = await establishmentModel.getEstablishmentById(establishmentId);
    if (!establishment) {
        throw new Error(`Établissement ${establishmentId} non trouvé`);
    }

    if (managerId !== null && managerId !== undefined) {
        const manager = await userModel.getUserById(managerId);
        if (!manager) {
            throw new Error("Gérant introuvable");
        }

        if (manager.role !== "manager") {
            throw new Error("L'utilisateur sélectionné n'est pas un gérant");
        }
    }

    await establishmentModel.updateEstablishment(establishmentId, {
        manager_id: managerId ?? null,
    });
}

export async function getEstablishmentByManagerId(managerId: string) {
    const establishments = await establishmentModel.getAllEstablishments();
    return establishments.find((est) => est.manager_id === managerId) ?? null;
}