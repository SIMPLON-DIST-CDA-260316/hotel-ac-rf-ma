import { NextRequest, NextResponse } from "next/server";
import {
    createRoom,
    getAllRooms,
    getManagerEstablishment,
} from "@/controllers/roomController";
import type { CreateRoomDTO } from "@/models/roomModel";
import { getCurrentUser, isAdmin, isManager } from "@/lib/authorization";

export async function GET(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        if (!isAdmin(currentUser.role)) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        const rooms = await getAllRooms();
        return NextResponse.json(rooms, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        if (!(isAdmin(currentUser.role) || isManager(currentUser.role))) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const body = (await request.json()) as Partial<CreateRoomDTO>;

        if (
            !body.name ||
            !body.description ||
            body.establishment_id === undefined ||
            body.establishment_id === null
        ) {
            return NextResponse.json(
                { error: "Champs obligatoires manquants" },
                { status: 400 }
            );
        }

        if (isManager(currentUser.role)) {
            const managerEstablishment = await getManagerEstablishment(currentUser.id);

            if (!managerEstablishment) {
                return NextResponse.json(
                    { error: "Vous n'êtes assigné à aucun établissement" },
                    { status: 403 }
                );
            }

            if (managerEstablishment.id !== body.establishment_id) {
                return NextResponse.json(
                    { error: "Vous ne pouvez gérer que les chambres de votre établissement" },
                    { status: 403 }
                );
            }
        }

        const createdRoom = await createRoom({
            name: body.name,
            description: body.description,
            image_path: body.image_path ?? null,
            capacity: body.capacity ?? null,
            price: body.price ?? null,
            establishment_id: body.establishment_id,
        });

        return NextResponse.json(createdRoom, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur lors de la création";

        if (message.includes("non trouvé")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}