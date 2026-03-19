import { NextRequest, NextResponse } from "next/server";
import { getRoomById, getAllRooms, updateRoom, deleteRoom } from "@/controllers/roomController";

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

export async function PUT(request: NextRequest) {
    try {
        const { id, ...data } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID requis" }, { status: 400 });
        }

        await updateRoom(id, data);
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

