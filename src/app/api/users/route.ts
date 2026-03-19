import { NextRequest, NextResponse } from "next/server";
import { getUserById, deleteUser, getAllUsers } from "@/controllers/userController";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");

        if (userId) {
            const user = await getUserById(userId);
            return NextResponse.json(user);
        }

        const users = await getAllUsers();
        return NextResponse.json(users);
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
        const userId = searchParams.get("id");

        if (!userId) {
            return NextResponse.json({ error: "ID requis" }, { status: 400 });
        }

        await deleteUser(userId);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur" },
            { status: 500 }
        );
    }
}



