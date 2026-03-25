'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ManagerCard from '@/components/cards/dashboard/ManagersCard'

type Gerant = {
    id: string
    name: string
    email: string
    role: string
    establishmentName?: string
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
    const router = useRouter()

    const [gerants, setGerants] = useState<Gerant[]>([])
    const [etablissements, setEtablissements] = useState<Etablissement[]>([])
    const [loading, setLoading] = useState(true)
    const [gerantEnEdition, setGerantEnEdition] = useState<string | null>(null)
    const [gerantEdit, setGerantEdit] = useState<Gerant | null>(null)
    const [ajoutGerant, setAjoutGerant] = useState(false)
    const [nouveauGerant, setNouveauGerant] = useState<Omit<Gerant, 'id'>>({
        name: '', email: '', role: '', establishmentName: ''
    })

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


    function startEditGerant(gerant: Gerant) {
        setGerantEnEdition(gerant.id)
        setGerantEdit({ ...gerant })
    }

    async function saveGerant() {
        if (!gerantEdit) return
        try {
            const res = await fetch(`/api/users/${gerantEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gerantEdit)
            })
            if (res.ok) {
                setGerants(gerants.map(g => g.id === gerantEdit.id ? gerantEdit : g))
                setGerantEnEdition(null)
                setGerantEdit(null)
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error)
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

    async function addGerant() {
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...nouveauGerant, role: 'manager', establishmentName: undefined })
            })
            if (res.ok) {
                const newGerant = await res.json()

                // 2. Si un établissement est sélectionné, le lier au manager
                if (nouveauGerant.establishmentName) {
                    const establishment = etablissements.find(e => e.name === nouveauGerant.establishmentName)
                    if (establishment) {
                        await fetch(`/api/establishments/${establishment.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ manager_id: newGerant.id })
                        })
                    }
                }

                setGerants([...gerants, { ...newGerant, establishmentName: nouveauGerant.establishmentName }])
                setAjoutGerant(false)
                setNouveauGerant({ name: '', email: '', role: '', establishmentName: '' })
                // Recharger les données pour avoir la mise à jour
                fetchData()
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error)
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
                ajoutGerant={ajoutGerant}
                setAjoutGerant={setAjoutGerant}
                nouveauGerant={nouveauGerant}
                setNouveauGerant={setNouveauGerant}
                addGerant={addGerant}
            />
        </div>
    )
}