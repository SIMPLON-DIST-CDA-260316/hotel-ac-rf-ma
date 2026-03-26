'use client'

import { useState, useEffect } from 'react'
import ManagerCard from '@/components/cards/dashboard/ManagersCard'
import EtablissementsCard from '@/components/cards/dashboard/EtablissementsCard'

type Gerant = {
    id: string
    name: string
    email: string
    role: string
    establishmentName?: string
    establishmentId?: number
}

type Etablissement = {
    id: number
    name: string
    description: string
    image_path: string | null
    address: string
    region: string
    city: string
    manager_id: string | null
}

export default function DashboardPage() {

    const [gerants, setGerants] = useState<Gerant[]>([])
    const [etablissements, setEtablissements] = useState<Etablissement[]>([])
    const [loading, setLoading] = useState(true)
    const [gerantEnEdition, setGerantEnEdition] = useState<string | null>(null)
    const [gerantEdit, setGerantEdit] = useState<Gerant | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setLoading(true)
            const [gerantsRes, etablissementsRes] = await Promise.all([
                fetch('/api/users?role=manager'),
                fetch('/api/establishments')
            ])

            let etablissementsData: Etablissement[] = []

            if (etablissementsRes.ok) {
                etablissementsData = await etablissementsRes.json()
                setEtablissements(etablissementsData)
            }

            if (gerantsRes.ok) {
                const gerantsData = await gerantsRes.json()
                // Enrichir les gérants avec le nom de leur établissement
                const enrichedGerants = gerantsData.map((gerant: Gerant) => {
                    const establishment = etablissementsData.find((e: Etablissement) => e.manager_id === gerant.id)
                    return {
                        ...gerant,
                        establishmentName: establishment?.name || '—'
                    }
                })
                setGerants(enrichedGerants)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error)
        } finally {
            setLoading(false)
        }
    }

    async function saveGerant() {
        if (!gerantEdit) return
        try {
            const res = await fetch(`/api/users/${gerantEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: gerantEdit.name,
                    email: gerantEdit.email,
                    role: gerantEdit.role
                })
            })

            if (!res.ok) {
                throw new Error('Erreur lors de la mise à jour du gérant')
            }

            // 2. Si l'établissement a changé, le mettre à jour
            const oldGerant = gerants.find(g => g.id === gerantEdit.id)
            if (oldGerant && gerantEdit.establishmentId !== oldGerant.establishmentId && gerantEdit.establishmentId) {
                // D'abord, détacher l'ancien établissement s'il existe
                if (oldGerant.establishmentId) {
                    await fetch(`/api/establishments/${oldGerant.establishmentId}/manager`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ manager_id: null })
                    })
                }

                // Ensuite, assigner le nouveau
                await fetch(`/api/establishments/${gerantEdit.establishmentId}/manager`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ manager_id: gerantEdit.id })
                })
            }

            setGerants(gerants.map(g => g.id === gerantEdit.id ? gerantEdit : g))
            setGerantEnEdition(null)
            setGerantEdit(null)
            alert('Gérant mis à jour avec succès')
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error)
            alert('Erreur lors de la sauvegarde')
        }
    }

    async function deleteGerant(id: string) {
        if (confirm('Supprimer ce gérant ?')) {
            try {
                const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
                if (res.ok) {
                    setGerants(gerants.filter(g => g.id !== id))
                }
            } catch (error) {
                console.error('Erreur lors de la suppression:', error)
            }
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            {/* ── En-tête ── */}
            <div className="mb-10">
                <h1 className="font-heading text-3xl font-semibold text-brand-forest mb-1">
                    Dashboard
                </h1>
                <p className="font-body text-brand-slate text-sm">
                    Gérez les gérants, établissements, suites et réservations
                </p>
            </div>
            <ManagerCard
                gerants={gerants}
                etablissements={etablissements}
                gerantEnEdition={gerantEnEdition}
                gerantEdit={gerantEdit}
                setGerantEdit={setGerantEdit}
                setGerantEnEdition={setGerantEnEdition}
                saveGerant={saveGerant}
                deleteGerant={deleteGerant}
            />
            <EtablissementsCard />
        </div>
    )
}