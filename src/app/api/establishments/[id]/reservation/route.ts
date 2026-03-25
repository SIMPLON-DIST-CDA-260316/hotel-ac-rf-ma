import { NextRequest, NextResponse } from "next/server";
import { getEstablishmentById } from "@/controllers/establishmentController";
import { getReservationsByEstablishmentId } from "@/controllers/reservationController";
import { getCurrentUser, isAdmin, isManager } from "@/lib/authorization";
import { db } from "@/db/client";
import { establishment } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await params;
        const establishmentId = Number(id);

        const existingEstablishment = await getEstablishmentById(establishmentId);
        if (!existingEstablishment) {
            return NextResponse.json({ error: "Établissement non trouvé" }, { status: 404 });
        }

        if (isAdmin(currentUser.role)) {
            const reservations = await getReservationsByEstablishmentId(establishmentId);
            return NextResponse.json(reservations, { status: 200 });
        }

        if (isManager(currentUser.role)) {
            const managerEstablishment = await db
                .select({ id: establishment.id, manager_id: establishment.manager_id })
                .from(establishment)
                .where(eq(establishment.manager_id, currentUser.id))
                .limit(1);

            if (!managerEstablishment[0]) {
                return NextResponse.json(
                    { error: "Vous n'êtes assigné à aucun établissement" },
                    { status: 403 }
                );
            }

            if (managerEstablishment[0].id !== establishmentId) {
                return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
            }

            const reservations = await getReservationsByEstablishmentId(establishmentId);
            return NextResponse.json(reservations, { status: 200 });
        }

        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";

        if (message.includes("non trouvé")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}