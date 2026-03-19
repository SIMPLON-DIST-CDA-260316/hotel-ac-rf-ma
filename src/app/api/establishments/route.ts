import { NextRequest, NextResponse } from "next/server";
import {
    createEstablishment,
    deleteEstablishment,
    getAllEstablishments,
    getEstablishmentById,
    updateEstablishment,
    filterEstablishments,
} from "@/controllers/establishmentController";
import type { CreateEstablishmentDTO } from "@/models/establishmentModel";
import { getCurrentUser, isAdmin } from "@/lib/authorization";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get("id");
        if (id) {
            const est = await getEstablishmentById(Number(id));
            return NextResponse.json(est);
        }

        const region = searchParams.get("region");
        const peopleParam = searchParams.get("people");
        const startAtParam = searchParams.get("startAt");
        const finishAtParam = searchParams.get("finishAt");

        const hasFilter =
            region !== null ||
            peopleParam !== null ||
            startAtParam !== null ||
            finishAtParam !== null;

        if (hasFilter) {
            const startAt = startAtParam ? new Date(startAtParam) : null;
            const finishAt = finishAtParam ? new Date(finishAtParam) : null;

            const bothDatesPresent =
                (!!startAtParam && !!finishAtParam) ||
                (!startAtParam && !finishAtParam);

            const establishments = await filterEstablishments({
                region: region || null,
                people: peopleParam ? Number(peopleParam) : null,
                startAt: bothDatesPresent ? startAt : null,
                finishAt: bothDatesPresent ? finishAt : null,
            });

            return NextResponse.json(establishments);
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

export async function POST(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!isAdmin(currentUser?.role)) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const body = (await request.json()) as Partial<CreateEstablishmentDTO>;

        if (!body.name || !body.description || !body.address || !body.region || !body.city) {
            return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
        }

        const createdEstablishment = await createEstablishment({
            name: body.name,
            description: body.description,
            address: body.address,
            region: body.region,
            city: body.city,
            image_path: body.image_path ?? null,
            manager_id: body.manager_id ?? null,
        });

        return NextResponse.json(createdEstablishment, { status: 201 });
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

        if (!isAdmin(currentUser?.role)) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id, ...data } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID requis" }, { status: 400 });
        }

        await updateEstablishment(Number(id), data);
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
        const currentUser = await getCurrentUser(request);

        if (!isAdmin(currentUser?.role)) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

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