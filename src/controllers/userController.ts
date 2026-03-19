import * as userModel from "@/models/userModel";
import type { UpdateUserDTO } from "@/models/userModel";
import type { CurrentUser } from "@/lib/authorization";

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

export async function getUsersByRole(role: string) {
    return await userModel.getUsersByRole(role);
}

export async function updateUser(id: string, data: UpdateUserDTO) {
    const user = await userModel.getUserById(id);
    if (!user) {
        throw new Error(`Utilisateur ${id} non trouvé`);
    }

    await userModel.updateUser(id, data);
}

export async function updateUserRole(id: string, role: string) {
    const user = await userModel.getUserById(id);
    if (!user) {
        throw new Error(`Utilisateur ${id} non trouvé`);
    }

    if (!role) {
        throw new Error("Rôle requis");
    }

    await userModel.updateUserRole(id, role);
}

export async function deleteUser(id: string) {
    const user = await userModel.getUserById(id);
    if (!user) {
        throw new Error(`Utilisateur ${id} non trouvé`);
    }

    await userModel.deleteUser(id);
}

export function canModifyUser(currentUser: CurrentUser | null, targetUserId: string) {
    if (!currentUser) {
        return false;
    }

    if (currentUser.role === "admin") {
        return true;
    }

    return currentUser.id === targetUserId;
}