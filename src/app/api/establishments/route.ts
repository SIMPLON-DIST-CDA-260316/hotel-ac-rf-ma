import { NextRequest, NextResponse } from "next/server";
import { getEstablishmentById, getAllEstablishments, updateEstablishment, deleteEstablishment } from "@/controllers/establishmentController";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            const est = await getEstablishmentById(Number(id));
            return NextResponse.json(est);
        }

        const establishments = await getAllEstablishments();
        return NextResponse.json(establishments);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
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

        await updateEstablishment(id, data);
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

        await deleteEstablishment(Number(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}

