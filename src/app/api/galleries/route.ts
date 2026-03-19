import { NextRequest, NextResponse } from "next/server";
import {
    createGallery,
    deleteGallery,
    getAllGalleries,
    getGalleryById,
    updateGallery,
} from "@/controllers/galleryController";
import type { CreateGalleryDTO } from "@/models/galleryModel";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            const gallery = await getGalleryById(Number(id));
            return NextResponse.json(gallery);
        }

        const galleries = await getAllGalleries();
        return NextResponse.json(galleries);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as Partial<CreateGalleryDTO>;

        const createdGallery = await createGallery({
            image_path: body.image_path ?? null,
            room_id: body.room_id ?? null,
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
        const { id, ...data } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID requis" }, { status: 400 });
        }

        await updateGallery(Number(id), data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID requis" }, { status: 400 });
        }

        await deleteGallery(Number(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}