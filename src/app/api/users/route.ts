import { NextRequest, NextResponse } from "next/server";
import {
    getAllUsers,
    getUsersByRole,
} from "@/controllers/userController";
import {
    getCurrentUser,
    canViewUsers,
} from "@/lib/authorization";

export async function GET(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        if (!canViewUsers(currentUser.role)) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");

        if (role && role !== "user" && role !== "admin" && role !== "manager") {
            return NextResponse.json(
                { error: "Rôle invalide" },
                { status: 400 }
            );
        }

        if (role) {
            const users = await getUsersByRole(role);
            return NextResponse.json(users, { status: 200 });
        }

        const users = await getAllUsers();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}