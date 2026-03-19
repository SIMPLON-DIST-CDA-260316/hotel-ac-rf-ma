import { auth } from "@/lib/auth";
import { getUserByEmail } from "@/models/userModel";
import type { NextRequest } from "next/server";

export type CurrentUser = {
    id: string;
    email: string;
    role: string;
};

export async function getCurrentUser(request: NextRequest): Promise<CurrentUser | null> {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    const sessionUser = session?.user;
    if (!sessionUser?.email) {
        return null;
    }

    const appUser = await getUserByEmail(sessionUser.email);
    if (!appUser) {
        return null;
    }

    return {
        id: appUser.id,
        email: appUser.email,
        role: appUser.role,
    };
}

export function hasRole(role: string | undefined, allowedRoles: string[]) {
    return !!role && allowedRoles.includes(role);
}

export function isAdmin(role: string | undefined) {
    return role === "admin";
}

export function isManager(role: string | undefined) {
    return role === "manager";
}

export function canViewUsers(role: string | undefined) {
    return hasRole(role, ["admin", "manager"]);
}

export function canEditAnyUser(role: string | undefined) {
    return isAdmin(role);
}

export function canDeleteUser(role: string | undefined) {
    return isAdmin(role);
}

export function canUpdateRole(role: string | undefined) {
    return isAdmin(role);
}

export async function isAuthorized(request: NextRequest, allowedRoles: string[]) {
    const user = await getCurrentUser(request);
    return hasRole(user?.role, allowedRoles);
}