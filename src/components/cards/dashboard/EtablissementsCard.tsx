'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

export default function EtablissementsCard() {
    const router = useRouter()
    const [etablissements, setEtablissements] = useState<Etablissement[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEtablissements()
    }, [])

    async function fetchEtablissements() {
        try {
            setLoading(true)
            const res = await fetch('/api/establishments')
            if (res.ok) {
                const data = await res.json()
                setEtablissements(data)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des établissements:', error)
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-subheading text-lg font-semibold text-brand-forest">
                    Établissements
                </h2>
                <button
                    onClick={() => router.push('/dashboard/etablissements/new')}
                    className="font-body bg-brand-mid hover:bg-brand-dark text-white text-xs px-4 py-2 rounded-lg transition-colors"
                >
                    + Ajouter
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide text-left px-6 py-3">Nom</th>
                            <th className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide text-left px-6 py-3">Région</th>
                            <th className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide text-left px-6 py-3">Ville</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {etablissements.map((etab) => (
                            <tr key={etab.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="font-body text-sm text-brand-forest px-6 py-4">{etab.name}</td>
                                <td className="font-body text-sm text-brand-slate px-6 py-4">{etab.region}</td>
                                <td className="font-body text-sm text-brand-slate px-6 py-4">{etab.city}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 justify-end">
                                        <button
                                            onClick={() => router.push(`/dashboard/etablissements/${etab.id}/edit`)}
                                            className="font-body text-xs text-brand-mid hover:text-brand-dark font-medium transition-colors px-3 py-1.5 rounded-lg border border-brand-mid/30 hover:border-brand-mid"
                                        >
                                            Éditer
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (confirm('Supprimer cet établissement ?')) {
                                                    try {
                                                        const res = await fetch(`/api/establishments/${etab.id}`, {
                                                            method: 'DELETE'
                                                        })
                                                        if (res.ok) {
                                                            // Reload or update list
                                                            location.reload()
                                                        } else {
                                                            alert('Erreur lors de la suppression')
                                                        }
                                                    } catch (error) {
                                                        console.error('Erreur:', error)
                                                        alert('Erreur lors de la suppression')
                                                    }
                                                }
                                            }}
                                            className="font-body text-xs text-red-400 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-400"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}