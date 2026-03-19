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

        if (!canUpdateRole(currentUser?.role)) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const role = body?.role;

        if(role !== "user" && role !== "admin" && role !== "manager" ) {
            return NextResponse.json(
                { error: "Rôle invalide" },
                { status: 400 }
            );
        }

        if (!role) {
            return NextResponse.json(
                { error: "Rôle requis" },
                { status: 400 }
            );
        }

        await updateUserRole(id, role);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}