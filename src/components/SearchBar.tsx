'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
    regionInitiale: string
    dateDebutInitiale: string
    dateFinInitiale: string
    personnesInitiales: string
    regions: string[]
}

export default function SearchBar({
    regionInitiale,
    dateDebutInitiale,
    dateFinInitiale,
    personnesInitiales,
    regions,
}: Props) {
    const router = useRouter()
    const [ouvert, setOuvert] = useState(false)
    const [region, setRegion] = useState(regionInitiale)
    const [dateDebut, setDateDebut] = useState(dateDebutInitiale)
    const [dateFin, setDateFin] = useState(dateFinInitiale)
    const [personnes, setPersonnes] = useState(personnesInitiales)

    function handleRecherche() {
        const params = new URLSearchParams()
        if (region) params.set('region', region)
        if (dateDebut) params.set('dateDebut', dateDebut)
        if (dateFin) params.set('dateFin', dateFin)
        if (personnes) params.set('personnes', personnes)
        router.push(`/search?${params.toString()}`)
        setOuvert(false)
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* ── Barre résumé — toujours visible, cliquable pour ouvrir ── */}
            <button
                onClick={() => setOuvert(!ouvert)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
                {/* Résumé de la recherche */}
                <div className="flex items-center gap-3 flex-wrap text-left">
                    {regionInitiale ? (
                        <span className="font-body text-sm text-brand-forest font-medium">
                            📍 {regionInitiale}
                        </span>
                    ) : (
                        <span className="font-body text-sm text-gray-400">
                            Tous les hôtels
                        </span>
                    )}
                    {dateDebutInitiale && dateFinInitiale && (
                        <span className="font-body text-sm text-brand-slate">
                            · 📅 {dateDebutInitiale} → {dateFinInitiale}
                        </span>
                    )}
                    {personnesInitiales && (
                        <span className="font-body text-sm text-brand-slate">
                            · 👥 {personnesInitiales} personne{Number(personnesInitiales) > 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Texte + flèche */}
                <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="font-body text-xs text-brand-mid hidden md:block">
                        Modifier
                    </span>
                    <span
                        className={`text-brand-slate text-sm transition-transform duration-200 ${ouvert ? 'rotate-180' : ''}`}
                    >
                        ▾
                    </span>
                </div>
            </button>

            {/* ── Formulaire dépliable ── */}
            {ouvert && (
                <div className="border-t border-gray-100 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <div className="flex flex-col gap-1.5">
                            <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                Destination
                            </label>
                            <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50"
                            >
                                <option value="">Tous les hôtels</option>
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
                                className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50"
                            >
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
                        className="font-body mt-4 w-full bg-brand-mid hover:bg-brand-dark text-white py-3 rounded-xl text-sm font-medium transition-colors duration-200"
                    >
                        Mettre à jour la recherche
                    </button>
                </div>
            )}

        </div>
    )
}