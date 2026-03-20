'use client'

import EtablissementCard from '@/components/cards/EtablissementCard'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Données fictives temporaires
const ETABLISSEMENTS_MOCK = [
    {
        id: '1',
        name: 'Le Manoir des Brumes',
        city: 'Honfleur',
        region: 'Normandie',
        address: '12 route des falaises, 14600 Honfleur',
        description: 'Niché en lisière de forêt, cet hôtel offre un cadre paisible face à l\'estuaire de la Seine.',
        image_path: null,
        manager_id: '1',
    },
    {
        id: '2',
        name: 'La Bastide du Périgord',
        city: 'Sarlat-la-Canéda',
        region: 'Dordogne',
        address: '5 chemin des chênes, 24200 Sarlat',
        description: 'Au cœur du Périgord noir, une bastide authentique entourée de chênes centenaires.',
        image_path: null,
        manager_id: '2',
    },
    {
        id: '3',
        name: 'Chalet de la Clarée',
        city: 'Névache',
        region: 'Hautes-Alpes',
        address: 'Route de la Clarée, 05100 Névache',
        description: 'Perché à 1 700 m d\'altitude, un chalet d\'exception avec vue sur le massif des Écrins.',
        image_path: null,
        manager_id: '3',
    },
]

const regions = [...new Set(ETABLISSEMENTS_MOCK.map(e => e.region))]

export default function HomePage() {
    const router = useRouter()

    const [region, setRegion] = useState('')
    const [dateDebut, setDateDebut] = useState('')
    const [dateFin, setDateFin] = useState('')
    const [personnes, setPersonnes] = useState('')

    function handleRecherche() {
        const params = new URLSearchParams()
        if (region) params.set('region', region)
        if (dateDebut) params.set('dateDebut', dateDebut)
        if (dateFin) params.set('dateFin', dateFin)
        if (personnes) params.set('personnes', personnes)
        router.push(`/search?${params.toString()}`)
    }
    return (
        <>
            {/* ── Hero ── */}
            <section className="bg-brand-forest text-white py-24 px-6">
                <div className="max-w-5xl mx-auto w-full flex justify-center">

                    {/* ── Bloc recherche ── */}
                    <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-sm">
                        <h2 className="font-subheading text-brand-forest text-lg font-semibold mb-5">
                            Rechercher un séjour
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                            <div className="flex flex-col gap-1.5">
                                <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                    Destination
                                </label>
                                <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50">
                                    <option value="">Toutes les régions</option>
                                    {regions.map((region) => (
                                        <option key={region} value={region}>
                                            {region}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                    Nombre de personnes
                                </label>
                                <select
                                    value={personnes}
                                    onChange={(e) => setPersonnes(e.target.value)}
                                    className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50">
                                    <option value="">Sélectionner</option>
                                    <option value="1">1 personne</option>
                                    <option value="2">2 personnes</option>
                                    <option value="3">3 personnes</option>
                                    <option value="4">4 personnes</option>
                                    <option value="5">5 personnes et plus</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                    Arrivée
                                </label>
                                <input
                                    type="date"
                                    value={dateDebut}
                                    onChange={(e) => {
                                        setDateDebut(e.target.value)
                                        if (dateFin && e.target.value > dateFin) {
                                            setDateFin('')
                                        }
                                    }}
                                    max={dateFin || undefined}
                                    className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                    Départ
                                </label>
                                <input
                                    type="date"
                                    value={dateFin}
                                    onChange={(e) => setDateFin(e.target.value)}
                                    min={dateDebut || undefined}
                                    className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50"
                                />
                            </div>

                        </div>

                        <button
                            onClick={handleRecherche}
                            className="font-body mt-5 w-full bg-brand-mid hover:bg-brand-dark text-white py-3 rounded-xl text-sm font-medium transition-colors duration-200">
                            Rechercher la disponibilité
                        </button>
                    </div>

                </div>
            </section>

            {/* ── Établissements mis en avant ── */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="flex items-baseline justify-between mb-10">
                    <div>
                        <h2 className="font-subheading text-2xl md:text-3xl font-semibold text-brand-forest mb-1">
                            Nos coups de cœur
                        </h2>
                    </div>

                    <a href="/etablissements" className="font-body text-brand-mid hover:text-brand-dark text-sm font-medium transition-colors hidden md:block">
                        Voir tous les hôtels →
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ETABLISSEMENTS_MOCK.map((e) => (
                        <EtablissementCard key={e.id} etablissement={e} />
                    ))}
                </div>

                {/* Lien visible sur mobile sous les cartes */}
                <div className="mt-8 text-center md:hidden">

                    <a href="/etablissements" className="font-body text-brand-mid hover:text-brand-dark text-sm font-medium transition-colors">
                        Voir tous les hôtels →
                    </a>
                </div>
            </section>
        </>
    )
}