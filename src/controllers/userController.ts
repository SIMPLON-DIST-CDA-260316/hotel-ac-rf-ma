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

    if (data.email !== undefined && data.email !== user.email) {
        const emailExists = await userModel.emailExists(data.email, id);
        if (emailExists) {
            throw new Error("Cet email est déjà utilisé");
        }
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

    if (!(await userModel.isRoleValid(role))) {
        throw new Error("Rôle invalide");
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

export function canUserModifyProfile(currentUser: CurrentUser | null, targetUserId: string): boolean {
    if (!currentUser) {
        return false;
    }

    if (currentUser.role === "admin") {
        return true;
    }

    return currentUser.id === targetUserId;
}

export function canUserDeleteAccount(currentUser: CurrentUser | null, targetUserId: string): boolean {
    if (!currentUser) {
        return false;
    }

    if (currentUser.role === "admin") {
        return true;
    }

    return currentUser.id === targetUserId;
}

export function canViewUserProfile(currentUser: CurrentUser | null, targetUserId: string): boolean {
    if (!currentUser) {
        return false;
    }

    if (currentUser.role === "admin" || currentUser.role === "manager") {
        return true;
    }

    return currentUser.id === targetUserId;
}