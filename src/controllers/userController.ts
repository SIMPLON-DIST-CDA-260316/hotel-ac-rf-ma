import * as userModel from "@/models/userModel";
import type { UpdateUserDTO } from "@/models/userModel";

// ============= BUSINESS LOGIC =============

export async function getUserById(id: string) {
    const user = await userModel.getUserById(id);
    if (!user) {
        throw new Error(`Utilisateur ${id} non trouvé`);
    }
    return user;
}

export async function getUserByEmail(email: string) {
    return await userModel.getUserByEmail(email);
}

export async function getAllUsers() {
    return await userModel.getAllUsers();
}

export async function updateUser(id: string, data: UpdateUserDTO) {
    const user = await userModel.getUserById(id);
    if (!user) {
        throw new Error(`Utilisateur ${id} non trouvé`);
    }

    await userModel.updateUser(id, data);
}

export async function deleteUser(id: string) {
    const user = await userModel.getUserById(id);
    if (!user) {
        throw new Error(`Utilisateur ${id} non trouvé`);
    }

    await userModel.deleteUser(id);
}

