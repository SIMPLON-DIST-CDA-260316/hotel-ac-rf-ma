import { NextRequest, NextResponse } from "next/server";
import {
    createReservation,
    deleteReservation,
    getAllReservations,
    getReservationById,
    updateReservation,
} from "@/controllers/reservationController";
import type { CreateReservationDTO } from "@/models/reservationModel";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            const reservation = await getReservationById(Number(id));
            return NextResponse.json(reservation);
        }

        const reservations = await getAllReservations();
        return NextResponse.json(reservations);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as Partial<CreateReservationDTO>;

        if (!body.startAt || !body.finishAt || !body.status) {
            return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
        }

        const createdReservation = await createReservation({
            user_id: body.user_id ?? null,
            room_id: body.room_id ?? null,
            startAt: new Date(body.startAt),
            finishAt: new Date(body.finishAt),
            person_number: body.person_number ?? null,
            status: body.status,
        });

        return NextResponse.json(createdReservation, { status: 201 });
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

        await updateReservation(Number(id), data);
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

        await deleteReservation(Number(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}