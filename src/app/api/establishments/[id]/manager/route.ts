import { NextRequest, NextResponse } from "next/server";
import { assignManagerToEstablishment } from "@/controllers/establishmentController";
import { getCurrentUser, isAdmin } from "@/lib/authorization";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!isAdmin(currentUser?.role)) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const manager_id = body.manager_id as string | null | undefined;

        await assignManagerToEstablishment(Number(id), manager_id ?? null);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";

        if (message.includes("non trouvé")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        if (message.includes("introuvable")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        if (message.includes("n'est pas un gérant")) {
            return NextResponse.json({ error: message }, { status: 400 });
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}