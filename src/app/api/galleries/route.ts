import { NextRequest, NextResponse } from "next/server";
import {
    createGallery,
    deleteGallery,
    getAllGalleries,
    getGalleryById,
    getGalleriesByRoomId,
    updateGallery,
} from "@/controllers/galleryController";
import type { CreateGalleryDTO } from "@/models/galleryModel";
import { getCurrentUser, isAdmin, isManager } from "@/lib/authorization";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const roomId = searchParams.get("roomId");

        if (id) {
            const gallery = await getGalleryById(Number(id));
            return NextResponse.json(gallery, { status: 200 });
        }

        if (roomId) {
            const galleries = await getGalleriesByRoomId(Number(roomId));
            return NextResponse.json(galleries, { status: 200 });
        }

        const galleries = await getAllGalleries();
        return NextResponse.json(galleries, { status: 200 });
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

        if (!(isAdmin(currentUser?.role) || isManager(currentUser?.role))) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const body = (await request.json()) as Partial<CreateGalleryDTO>;

        if (body.room_id === undefined || body.room_id === null) {
            return NextResponse.json({ error: "room_id requis" }, { status: 400 });
        }

        const createdGallery = await createGallery({
            image_path: body.image_path ?? null,
            room_id: body.room_id,
        });

        return NextResponse.json(createdGallery, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur lors de la création" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!(isAdmin(currentUser?.role) || isManager(currentUser?.role))) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id, ...data } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID requis" }, { status: 400 });
        }

        await updateGallery(Number(id), data);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!(isAdmin(currentUser?.role) || isManager(currentUser?.role))) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID requis" }, { status: 400 });
        }

        await deleteGallery(Number(id));
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}