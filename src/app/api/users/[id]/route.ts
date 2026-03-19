import { NextRequest, NextResponse } from "next/server";
import {
    deleteUser,
    getUserById,
    updateUser,
} from "@/controllers/userController";
import {
    getCurrentUser,
    canDeleteUser,
    isAdmin,
    isManager,
} from "@/lib/authorization";
import type { UpdateUserDTO } from "@/models/userModel";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const currentUser = await getCurrentUser(request);

        if (!(isAdmin(currentUser?.role) || isManager(currentUser?.role))) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        const user = await getUserById(id);
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const currentUser = await getCurrentUser(request);

        if (!isAdmin(currentUser?.role)) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        const body = (await request.json()) as UpdateUserDTO;

        const { role, ...safeData } = body as UpdateUserDTO & { role?: string };

        await updateUser(id, safeData);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const currentUser = await getCurrentUser(request);

        if (!canDeleteUser(currentUser?.role)) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        await deleteUser(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}