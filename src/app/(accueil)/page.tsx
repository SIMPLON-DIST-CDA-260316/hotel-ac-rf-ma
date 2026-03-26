'use client'

import EtablissementCard from '@/components/cards/EtablissementCard'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HomePage() {
    const router = useRouter()

    const [region, setRegion] = useState('')
    const [dateDebut, setDateDebut] = useState('')
    const [dateFin, setDateFin] = useState('')
    const [personnes, setPersonnes] = useState('')

    const [etablissements, setEtablissements] = useState<any[]>([])
    const [regions, setRegions] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchEtablissements() {
            try {
                const res = await fetch('/api/establishments')
                const data = await res.json()

                const shuffled = [...data].sort(() => Math.random() - 0.5)
                const picked = shuffled.slice(0, 3)

                setEtablissements(picked)

                // Extraction des régions uniques depuis tous les résultats
                const uniqueRegions = [...new Set<string>(data.map((e: any) => e.region).filter(Boolean))]
                setRegions(uniqueRegions)
            } catch (err) {
                console.error('Erreur lors du chargement des établissements :', err)
            } finally {
                setLoading(false)
            }
        }

        fetchEtablissements()
    }, [])

    function handleRecherche() {
        const params = new URLSearchParams()
        if (region) params.set('region', region)
        if (dateDebut) params.set('dateDebut', dateDebut)
        if (dateFin) params.set('dateFin', dateFin)
        if (personnes) params.set('personnes', personnes)
        router.push(`/etablissements?${params.toString()}`)
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
                                    {regions.map((r) => (
                                        <option key={r} value={r}>{r}</option>
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
                                        if (dateFin && e.target.value > dateFin) setDateFin('')
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

                    <Link href="/etablissements" className="font-body text-brand-mid hover:text-brand-dark text-sm font-medium transition-colors hidden md:block">
                        Voir tous les hôtels →
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-64" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {etablissements.map((e) => (
                            <EtablissementCard key={e.id} etablissement={e} />
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center md:hidden">
                    <Link href="/etablissements" className="font-body text-brand-mid hover:text-brand-dark text-sm font-medium transition-colors">
                        Voir tous les hôtels →
                    </Link>
                </div>
            </section>
        </>
    )
}