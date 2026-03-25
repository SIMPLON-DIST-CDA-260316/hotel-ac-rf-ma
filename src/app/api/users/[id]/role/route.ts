import { NextRequest, NextResponse } from "next/server";
import {
    getCurrentUser,
    canUpdateRole,
} from "@/lib/authorization";
import { updateUserRole } from "@/controllers/userController";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        if (!canUpdateRole(currentUser.role)) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const role = body?.role;

        if (!role) {
            return NextResponse.json(
                { error: "Rôle requis" },
                { status: 400 }
            );
        }

        if (role !== "user" && role !== "admin" && role !== "manager") {
            return NextResponse.json(
                { error: "Rôle invalide" },
                { status: 400 }
            );
        }

        if (currentUser.id === id) {
            return NextResponse.json(
                { error: "Vous ne pouvez pas modifier votre propre rôle" },
                { status: 403 }
            );
        }

        await updateUserRole(id, role);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";

        if (message.includes("non trouvé")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        if (message.includes("invalide")) {
            return NextResponse.json({ error: message }, { status: 400 });
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}