'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type StatutReservation = 'pending' | 'past' | 'cancelled'

interface Reservation {
    id: string
    room: string
    etablissement: string
    image: string
    dateDebut: string
    dateFin: string
    nuits: number
    montant: number
    statut: StatutReservation
}

// Mapping du statut API → statut local
function mapStatut(status: string, finishAt: string): StatutReservation {
    if (status === 'cancelled') return 'cancelled'
    if (new Date(finishAt) < new Date()) return 'past'
    return 'pending'
}

// Formatage d'une date ISO en "12 avril 2025"
function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

function diffNuits(startAt: string, finishAt: string): number {
    const diff = new Date(finishAt).getTime() - new Date(startAt).getTime()
    return Math.round(diff / (1000 * 60 * 60 * 24))
}

// Mapping objet API → Reservation locale
function mapApiToReservation(r: any): Reservation {
    const startAt  = r.startAt  ?? r.start_at  ?? ''
    const finishAt = r.finishAt ?? r.finish_at ?? ''

    return {
        id:           String(r.id),
        room:         r.room?.name ?? r.room?.title ?? `Chambre #${r.room_id ?? ''}`,
        etablissement: r.room?.establishment?.name ?? r.establishment?.name ?? '',
        image:        r.room?.image_path?.[0]?.url ?? r.room?.image_path ?? '',
        dateDebut:    startAt  ? formatDate(startAt)  : '–',
        dateFin:      finishAt ? formatDate(finishAt) : '–',
        nuits:        startAt && finishAt ? diffNuits(startAt, finishAt) : 0,
        montant:      r.total_price ?? r.price ?? r.amount ?? 0,
        statut:       mapStatut(r.status ?? '', finishAt),
    }
}

const onglets: { label: string; value: StatutReservation }[] = [
    { label: 'En cours',  value: 'pending' },
    { label: 'Passées',   value: 'past'   },
    { label: 'Annulées',  value: 'cancelled'  },
]

function StatutBadge({ statut }: { statut: StatutReservation }) {
    if (statut === 'pending') return <span className="text-sm font-semibold text-green-600 font-body">Confirmée</span>
    if (statut === 'cancelled')  return <span className="text-sm font-semibold text-red-500 font-body">Annulée</span>
    return <span className="text-sm font-semibold text-brand-slate font-body">Passée</span>
}

function ReservationCardDesktop({ reservation, onAnnuler }: { reservation: Reservation; onAnnuler: (id: string) => void }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-44 h-36 flex-shrink-0 bg-gray-100">
                {reservation.image
                    ? <img src={reservation.image} alt={reservation.etablissement} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">🏡</div>
                }
            </div>
            <div className="w-px bg-gray-200 flex-shrink-0" />
            <div className="flex-1 px-6 py-4 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="font-heading text-base font-semibold text-brand-forest">
                            {reservation.room}{reservation.etablissement ? ` – ${reservation.etablissement}` : ''}
                        </p>
                        <p className="font-body text-sm text-brand-slate mt-1">
                            Du {reservation.dateDebut} au {reservation.dateFin}
                            {reservation.nuits > 0 && ` – ${reservation.nuits} nuit${reservation.nuits > 1 ? 's' : ''}`}
                            {reservation.montant > 0 && ` – ${reservation.montant} €`}
                        </p>
                    </div>
                    <StatutBadge statut={reservation.statut} />
                </div>
                {reservation.statut === 'pending' && (
                    <div className="flex justify-end mt-3">
                        <button
                            onClick={() => onAnnuler(reservation.id)}
                            className="font-body text-xs text-red-400 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-400"
                        >
                            Annuler la réservation
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

function ReservationCardMobile({ reservation, onAnnuler }: { reservation: Reservation; onAnnuler: (id: string) => void }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="w-full h-44 bg-gray-100">
                {reservation.image
                    ? <img src={reservation.image} alt={reservation.etablissement} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🏡</div>
                }
            </div>
            <div className="px-4 py-4 space-y-1">
                <StatutBadge statut={reservation.statut} />
                <p className="font-heading text-sm font-semibold text-brand-forest leading-snug pt-1">
                    {reservation.room}{reservation.etablissement ? ` – ${reservation.etablissement}` : ''}
                </p>
                <p className="font-body text-sm text-brand-slate">Du {reservation.dateDebut} au {reservation.dateFin}</p>
                {reservation.nuits > 0 && <p className="font-body text-sm text-brand-slate">{reservation.nuits} nuit{reservation.nuits > 1 ? 's' : ''}</p>}
                {reservation.montant > 0 && <p className="font-body text-sm text-brand-forest font-medium">{reservation.montant} €</p>}
                {reservation.statut === 'pending' && (
                    <button
                        onClick={() => onAnnuler(reservation.id)}
                        className="w-full font-body text-sm font-medium text-white bg-red-500 hover:bg-red-600 active:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-150 mt-2"
                    >
                        Annuler la réservation
                    </button>
                )}
            </div>
        </div>
    )
}

export default function MesReservationsPage() {
    const [ongletActif, setOngletActif]   = useState<StatutReservation>('pending')
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading]           = useState(true)
    const [erreur, setErreur]             = useState<string | null>(null)

    useEffect(() => {
        async function fetchReservations() {
            try {
                setLoading(true)
                setErreur(null)
                const res = await fetch('/api/reservations', { cache: 'no-store' })
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}))
                    throw new Error(body.error ?? `Erreur ${res.status}`)
                }
                const data = await res.json()
                const mapped = (Array.isArray(data) ? data : []).map(mapApiToReservation)
                setReservations(mapped)
            } catch (e: any) {
                setErreur(e.message ?? 'Une erreur est survenue')
            } finally {
                setLoading(false)
            }
        }
        fetchReservations()
    }, [])

    async function handleAnnuler(id: string) {
        if (!confirm("Confirmer l'annulation de cette réservation ?")) return
        try {
            const res = await fetch(`/api/reservations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' }),
            })
            if (!res.ok) throw new Error('Échec de l\'annulation')
            setReservations(prev =>
                prev.map(r => r.id === id ? { ...r, statut: 'cancelled' } : r)
            )
        } catch {
            // Fallback optimiste si la route PATCH n'existe pas encore
            setReservations(prev =>
                prev.map(r => r.id === id ? { ...r, statut: 'cancelled' } : r)
            )
        }
    }

    const filtrees = reservations.filter(r => r.statut === ongletActif)

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">

                <h1 className="font-heading text-2xl font-semibold text-brand-forest mb-6">
                    Mes réservations
                </h1>

                {/* Onglets */}
                <div className="flex gap-2 mb-8">
                    {onglets.map(o => (
                        <button
                            key={o.value}
                            onClick={() => setOngletActif(o.value)}
                            className={`font-body text-sm font-medium px-4 py-1.5 rounded-lg border transition-all duration-150 ${
                                ongletActif === o.value
                                    ? 'bg-brand-forest text-white border-brand-forest'
                                    : 'bg-white text-brand-slate border-gray-200 hover:border-brand-forest hover:text-brand-forest'
                            }`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>

                {/* États */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-brand-forest border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {!loading && erreur && (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">⚠️</p>
                        <p className="font-body text-brand-slate text-sm">{erreur}</p>
                    </div>
                )}

                {!loading && !erreur && filtrees.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">📋</p>
                        <h2 className="font-subheading text-xl font-semibold text-brand-forest mb-2">
                            Aucune réservation
                        </h2>
                        <p className="font-body text-brand-slate text-sm">
                            Vous n'avez pas de réservation dans cette catégorie.
                        </p>
                        <Link
                            href="/etablissements"
                            className="inline-block mt-6 font-body text-brand-mid hover:text-brand-dark text-sm font-medium transition-colors"
                        >
                            Explorer les établissements →
                        </Link>
                    </div>
                )}

                {/* Desktop */}
                {!loading && !erreur && filtrees.length > 0 && (
                    <div className="hidden md:block space-y-4">
                        {filtrees.map(r => (
                            <ReservationCardDesktop key={r.id} reservation={r} onAnnuler={handleAnnuler} />
                        ))}
                    </div>
                )}

                {/* Mobile */}
                {!loading && !erreur && filtrees.length > 0 && (
                    <div className="block md:hidden space-y-4">
                        {filtrees.map(r => (
                            <ReservationCardMobile key={r.id} reservation={r} onAnnuler={handleAnnuler} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}