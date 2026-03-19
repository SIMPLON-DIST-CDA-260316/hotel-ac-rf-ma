import * as establishmentModel from "@/models/establishmentModel";
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

    await establishmentModel.deleteEstablishment(id);
}

export async function filterEstablishments(params: FilterEstablishmentDTO) {
    return await establishmentModel.filterEstablishments(params);
}