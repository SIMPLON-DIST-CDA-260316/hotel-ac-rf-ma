import { NextRequest, NextResponse } from "next/server";
import { getRoomsByEstablishmentId } from "@/controllers/roomController";
import { getEstablishmentById } from "@/controllers/establishmentController";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // ✅ PUBLIC - Tout le monde peut voir les chambres d'un établissement
    try {
        const { id } = await params;
        const establishmentId = Number(id);

        // Vérifier que l'établissement existe
        const establishment = await getEstablishmentById(establishmentId);
        if (!establishment) {
            return NextResponse.json(
                { error: "Établissement non trouvé" },
                { status: 404 }
            );
        }

        // Récupérer les chambres de l'établissement
        const rooms = await getRoomsByEstablishmentId(establishmentId);
        return NextResponse.json(rooms, { status: 200 });
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