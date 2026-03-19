import { NextRequest, NextResponse } from "next/server";
import {
    createRoom,
    deleteRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
} from "@/controllers/roomController";
import type { CreateRoomDTO } from "@/models/roomModel";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            const room = await getRoomById(Number(id));
            return NextResponse.json(room);
        }

        const rooms = await getAllRooms();
        return NextResponse.json(rooms);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as Partial<CreateRoomDTO>;

        if (!body.name || !body.description) {
            return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
        }

        const createdRoom = await createRoom({
            name: body.name,
            description: body.description,
            image_path: body.image_path ?? null,
            capacity: body.capacity ?? null,
            price: body.price ?? null,
            establishment_id: body.establishment_id ?? null,
        });

        return NextResponse.json(createdRoom, { status: 201 });
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

        await updateRoom(Number(id), data);
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

        await deleteRoom(Number(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}