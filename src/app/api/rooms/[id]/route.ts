import { NextRequest, NextResponse } from "next/server";
import {
    deleteRoom,
    getRoomById,
    updateRoom,
    getManagerEstablishment,
} from "@/controllers/roomController";
import type { UpdateRoomDTO } from "@/models/roomModel";
import { getCurrentUser, isAdmin, isManager } from "@/lib/authorization";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const room = await getRoomById(Number(id));
        return NextResponse.json(room, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";
        if (message.includes("non trouvée")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        if (!(isAdmin(currentUser.role) || isManager(currentUser.role))) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await params;
        const roomId = Number(id);
        const body = (await request.json()) as UpdateRoomDTO;

        const room = await getRoomById(roomId);

        if (isManager(currentUser.role)) {
            const managerEstablishment = await getManagerEstablishment(currentUser.id);

            if (!managerEstablishment) {
                return NextResponse.json(
                    { error: "Vous n'êtes assigné à aucun établissement" },
                    { status: 403 }
                );
            }

            if (room.establishment_id !== managerEstablishment.id) {
                return NextResponse.json(
                    { error: "Vous ne pouvez modifier que les chambres de votre établissement" },
                    { status: 403 }
                );
            }
        }

        await updateRoom(roomId, body);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";

        if (message.includes("non trouvée")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        if (message.includes("non trouvé")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        if (!(isAdmin(currentUser.role) || isManager(currentUser.role))) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await params;
        const roomId = Number(id);
        const room = await getRoomById(roomId);

        if (isManager(currentUser.role)) {
            const managerEstablishment = await getManagerEstablishment(currentUser.id);

            if (!managerEstablishment) {
                return NextResponse.json(
                    { error: "Vous n'êtes assigné à aucun établissement" },
                    { status: 403 }
                );
            }

            if (room.establishment_id !== managerEstablishment.id) {
                return NextResponse.json(
                    { error: "Vous ne pouvez supprimer que les chambres de votre établissement" },
                    { status: 403 }
                );
            }
        }

        await deleteRoom(roomId);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";

        if (message.includes("réservations en cours ou futures")) {
            return NextResponse.json({ error: message }, { status: 409 });
        }

        if (message.includes("non trouvée")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}