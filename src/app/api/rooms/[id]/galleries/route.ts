import { NextRequest, NextResponse } from "next/server";
import { getRoomById } from "@/controllers/roomController";
import { getGalleriesByRoomId, createGalleryForRoom } from "@/controllers/galleryController";
import type { CreateGalleryDTO } from "@/models/galleryModel";
import { getCurrentUser, isAdmin, isManager } from "@/lib/authorization";
import { getEstablishmentByManagerId } from "@/controllers/establishmentController";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const room = await getRoomById(Number(id));
        if (!room) {
            return NextResponse.json({ error: "Chambre non trouvée" }, { status: 404 });
        }

        const galleries = await getGalleriesByRoomId(Number(id));
        return NextResponse.json(galleries, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!(isAdmin(currentUser?.role) || isManager(currentUser?.role))) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await params;
        const roomId = Number(id);
        const room = await getRoomById(roomId);

        if (!room) {
            return NextResponse.json({ error: "Chambre non trouvée" }, { status: 404 });
        }

        if (isManager(currentUser.role)) {
            const managerEstablishment = await getEstablishmentByManagerId(currentUser.id);

            if (!managerEstablishment) {
                return NextResponse.json(
                    { error: "Vous n'êtes assigné à aucun établissement" },
                    { status: 403 }
                );
            }

            if (room.establishment_id !== managerEstablishment.id) {
                return NextResponse.json(
                    { error: "Vous ne pouvez gérer que les images des chambres de votre établissement" },
                    { status: 403 }
                );
            }
        }

        const body = (await request.json()) as Partial<CreateGalleryDTO>;

        const createdGallery = await createGalleryForRoom(roomId, {
            image_path: body.image_path ?? null,
        });

        return NextResponse.json(createdGallery, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur lors de la création" },
            { status: 500 }
        );
    }
}