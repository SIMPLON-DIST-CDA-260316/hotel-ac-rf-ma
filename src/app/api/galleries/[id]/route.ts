import { NextRequest, NextResponse } from "next/server";
import {
    deleteGallery,
    getGalleryById,
    updateGallery,
    canManagerAccessGallery,
} from "@/controllers/galleryController";
import type { UpdateGalleryDTO } from "@/models/galleryModel";
import { getCurrentUser, isAdmin, isManager } from "@/lib/authorization";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const gallery = await getGalleryById(Number(id));
        return NextResponse.json(gallery, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";
        if (message.includes("non trouvée")) {
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
        const currentUser = await getCurrentUser(request);

        if (!(isAdmin(currentUser?.role) || isManager(currentUser?.role))) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await params;
        const galleryId = Number(id);

        if (isManager(currentUser.role)) {
            const hasAccess = await canManagerAccessGallery(currentUser.id, galleryId);
            if (!hasAccess) {
                return NextResponse.json(
                    { error: "Vous ne pouvez modifier que les galeries de votre établissement" },
                    { status: 403 }
                );
            }
        }

        const body = (await request.json()) as UpdateGalleryDTO;

        await updateGallery(galleryId, body);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";
        if (message.includes("non trouvée")) {
            return NextResponse.json({ error: message }, { status: 404 });
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
        const currentUser = await getCurrentUser(request);

        if (!(isAdmin(currentUser?.role) || isManager(currentUser?.role))) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await params;
        const galleryId = Number(id);

        if (isManager(currentUser.role)) {
            const hasAccess = await canManagerAccessGallery(currentUser.id, galleryId);
            if (!hasAccess) {
                return NextResponse.json(
                    { error: "Vous ne pouvez supprimer que les galeries de votre établissement" },
                    { status: 403 }
                );
            }
        }

        await deleteGallery(galleryId);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";
        if (message.includes("non trouvée")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}