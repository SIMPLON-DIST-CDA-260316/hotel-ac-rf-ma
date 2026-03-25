import { NextRequest, NextResponse } from "next/server";
import {
    cancelReservation,
    getReservationById,
    updateReservation,
} from "@/controllers/reservationController";
import type { UpdateReservationDTO } from "@/models/reservationModel";
import { getCurrentUser, isAdmin, isManager } from "@/lib/authorization";
import { getRoomById } from "@/controllers/roomController";
import { getEstablishmentByManagerId } from "@/controllers/establishmentController";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const reservation = await getReservationById(Number(id));

        if (
            !isAdmin(currentUser.role) &&
            !isManager(currentUser.role) &&
            reservation.user_id !== currentUser.id
        ) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        return NextResponse.json(reservation, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";
        if (message.includes("non trouvée")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const reservation = await getReservationById(Number(id));

        const isOwner = reservation.user_id === currentUser.id;
        const isAdminOrManager = isAdmin(currentUser.role) || isManager(currentUser.role);

        if (!isOwner && !isAdminOrManager) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        if (isManager(currentUser.role) && !isAdmin(currentUser.role)) {
            const managerEstablishment = await getEstablishmentByManagerId(currentUser.id);
            if (!managerEstablishment) {
                return NextResponse.json(
                    { error: "Vous n'êtes assigné à aucun établissement" },
                    { status: 403 }
                );
            }

            if (reservation.room_id) {
                const room = await getRoomById(reservation.room_id);
                if (room.establishment_id !== managerEstablishment.id) {
                    return NextResponse.json(
                        { error: "Vous ne pouvez modifier que les réservations de votre établissement" },
                        { status: 403 }
                    );
                }
            }
        }

        const body = (await request.json()) as UpdateReservationDTO;

        if (body.room_id && body.room_id !== reservation.room_id) {
            if (!isAdmin(currentUser.role)) {
                return NextResponse.json(
                    { error: "Seul un admin peut modifier la chambre d'une réservation" },
                    { status: 403 }
                );
            }
        }

        await updateReservation(Number(id), body);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";
        if (message.includes("non trouvée")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const reservation = await getReservationById(Number(id));

        const isOwner = reservation.user_id === currentUser.id;
        const canBypassDeadline = isAdmin(currentUser.role) || isManager(currentUser.role);

        if (!isOwner && !canBypassDeadline) {
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 }
            );
        }

        if (isManager(currentUser.role) && !isAdmin(currentUser.role)) {
            const managerEstablishment = await getEstablishmentByManagerId(currentUser.id);
            if (!managerEstablishment) {
                return NextResponse.json(
                    { error: "Vous n'êtes assigné à aucun établissement" },
                    { status: 403 }
                );
            }

            if (reservation.room_id) {
                const room = await getRoomById(reservation.room_id);
                if (room.establishment_id !== managerEstablishment.id) {
                    return NextResponse.json(
                        { error: "Vous ne pouvez annuler que les réservations de votre établissement" },
                        { status: 403 }
                    );
                }
            }
        }

        await cancelReservation(Number(id), {
            bypassDeadline: canBypassDeadline,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur";

        if (message.includes("au moins 3 jours")) {
            return NextResponse.json({ error: message }, { status: 409 });
        }

        if (message.includes("non trouvée")) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}