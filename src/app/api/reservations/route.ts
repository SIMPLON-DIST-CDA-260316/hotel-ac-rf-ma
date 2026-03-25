import { NextRequest, NextResponse } from "next/server";
import {
    createReservation,
    getAllReservations,
    getReservationsByUserId,
    getReservationsByEstablishmentId,
} from "@/controllers/reservationController";
import type { CreateReservationDTO } from "@/models/reservationModel";
import { getCurrentUser, isAdmin, isManager } from "@/lib/authorization";
import { getEstablishmentByManagerId } from "@/controllers/establishmentController";
import { getUserById } from "@/controllers/userController";

export async function GET(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (userId) {
            if (isAdmin(currentUser.role)) {
                const reservations = await getReservationsByUserId(userId);
                return NextResponse.json(reservations, { status: 200 });
            }

            if (currentUser.id !== userId) {
                return NextResponse.json(
                    { error: "Accès refusé" },
                    { status: 403 }
                );
            }

            const reservations = await getReservationsByUserId(userId);
            return NextResponse.json(reservations, { status: 200 });
        }

        if (isAdmin(currentUser.role)) {
            const reservations = await getAllReservations();
            return NextResponse.json(reservations, { status: 200 });
        }

        if (isManager(currentUser.role)) {
            const managerEstablishment = await getEstablishmentByManagerId(currentUser.id);
            if (managerEstablishment) {
                const reservations = await getReservationsByEstablishmentId(managerEstablishment.id);
                return NextResponse.json(reservations, { status: 200 });
            }
            return NextResponse.json([], { status: 200 });
        }

        const reservations = await getReservationsByUserId(currentUser.id);
        return NextResponse.json(reservations, { status: 200 });
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

        if (!currentUser) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const body = (await request.json()) as Partial<CreateReservationDTO>;

        if (!body.room_id || !body.startAt || !body.finishAt) {
            return NextResponse.json(
                { error: "Champs obligatoires manquants" },
                { status: 400 }
            );
        }

        let userId = currentUser.id;

        if (body.user_id && body.user_id !== currentUser.id) {
            if (!isAdmin(currentUser.role) && !isManager(currentUser.role)) {
                return NextResponse.json(
                    { error: "Accès refusé" },
                    { status: 403 }
                );
            }

            const targetUser = await getUserById(body.user_id);
            if (!targetUser) {
                return NextResponse.json(
                    { error: "Utilisateur cible introuvable" },
                    { status: 404 }
                );
            }

            if (isManager(currentUser.role)) {
                const managerEstablishment = await getEstablishmentByManagerId(currentUser.id);
                if (!managerEstablishment) {
                    return NextResponse.json(
                        { error: "Vous n'êtes assigné à aucun établissement" },
                        { status: 403 }
                    );
                }

                const room = await (await import("@/controllers/roomController")).getRoomById(body.room_id);
                if (room.establishment_id !== managerEstablishment.id) {
                    return NextResponse.json(
                        { error: "Vous ne pouvez créer des réservations que pour les chambres de votre établissement" },
                        { status: 403 }
                    );
                }
            }

            userId = body.user_id;
        }

        const reservation = await createReservation({
            user_id: userId,
            room_id: body.room_id,
            startAt: new Date(body.startAt),
            finishAt: new Date(body.finishAt),
            person_number: body.person_number ?? null,
            status: body.status ?? "pending",
        });

        return NextResponse.json(reservation, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";

        if (message.includes("n'est pas disponible")) {
            return NextResponse.json({ error: message }, { status: 409 });
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}