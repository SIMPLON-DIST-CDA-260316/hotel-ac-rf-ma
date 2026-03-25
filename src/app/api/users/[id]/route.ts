import { NextRequest, NextResponse } from "next/server";
import {
    deleteUser,
    getUserById,
    updateUser,
    canUserModifyProfile,
    canUserDeleteAccount,
    canViewUserProfile,
} from "@/controllers/userController";
import {
    getCurrentUser,
    isAdmin,
} from "@/lib/authorization";
import type { UpdateUserDTO } from "@/models/userModel";

export async function GET(
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

        if (!canViewUserProfile(currentUser, id)) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        const user = await getUserById(id);
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";
        if (message.includes("non trouvé")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json(
            { error: message },
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

        if (!currentUser) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        if (!canUserModifyProfile(currentUser, id)) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        const body = (await request.json()) as UpdateUserDTO;
        const safeData: UpdateUserDTO = {};

        if (body.email !== undefined) safeData.email = body.email;
        if (body.name !== undefined) safeData.name = body.name;
        if (body.image !== undefined) safeData.image = body.image;

        if (!isAdmin(currentUser.role) && (body as any).role !== undefined) {
            return NextResponse.json(
                { error: "Vous ne pouvez pas modifier votre rôle" },
                { status: 403 }
            );
        }

        await updateUser(id, safeData);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";

        if (message.includes("non trouvé")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        if (message.includes("déjà utilisé")) {
            return NextResponse.json({ error: message }, { status: 409 });
        }

        return NextResponse.json(
            { error: message },
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

        if (!currentUser) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        if (!canUserDeleteAccount(currentUser, id)) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        await deleteUser(id);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";
        if (message.includes("non trouvé")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}