import { NextRequest, NextResponse } from "next/server";
import {
    deleteEstablishment,
    getEstablishmentById,
    updateEstablishment,
} from "@/controllers/establishmentController";
import type { UpdateEstablishmentDTO } from "@/models/establishmentModel";
import { getCurrentUser, isAdmin } from "@/lib/authorization";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const establishment = await getEstablishmentById(Number(id));
        return NextResponse.json(establishment, { status: 200 });
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
        const currentUser = await getCurrentUser(request);

        if (!isAdmin(currentUser?.role)) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await params;
        const body = (await request.json()) as UpdateEstablishmentDTO;

        await updateEstablishment(Number(id), body);

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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!isAdmin(currentUser?.role)) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await params;

        await deleteEstablishment(Number(id));

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";

        if (message.includes("réservations en cours ou futures")) {
            return NextResponse.json({ error: message }, { status: 409 });
        }

        if (message.includes("non trouvé")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}