import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { establishment } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getEstablishmentById } from "@/controllers/establishmentController";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const manager_id = body.manager_id as string | null | undefined;

        const existing = await getEstablishmentById(Number(id));
        if (!existing) {
            return NextResponse.json({ error: "Établissement non trouvé" }, { status: 404 });
        }

        await db
            .update(establishment)
            .set({ manager_id: manager_id ?? null })
            .where(eq(establishment.id, Number(id)));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}