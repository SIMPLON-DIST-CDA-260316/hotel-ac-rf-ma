'use client'

import { Dispatch, SetStateAction } from 'react'

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

interface ManagerCardProps {
    gerants: Gerant[]
    etablissements: Etablissement[]
    gerantEnEdition: string | null
    gerantEdit: Gerant | null
    setGerantEdit: Dispatch<SetStateAction<Gerant | null>>
    setGerantEnEdition: Dispatch<SetStateAction<string | null>>
    saveGerant: () => void
    deleteGerant: (id: string) => void
    ajoutGerant: boolean
    setAjoutGerant: Dispatch<SetStateAction<boolean>>
    nouveauGerant: Omit<Gerant, 'id'>
    setNouveauGerant: Dispatch<SetStateAction<Omit<Gerant, 'id'>>>
    addGerant: () => void
}

export default function ManagerCard(props: ManagerCardProps) {
    const {
        gerants,
        etablissements,
        gerantEnEdition,
        gerantEdit,
        setGerantEdit,
        setGerantEnEdition,
        saveGerant,
        deleteGerant,
        ajoutGerant,
        setAjoutGerant,
        nouveauGerant,
        setNouveauGerant,
        addGerant
    } = props

    function startEditGerant(gerant: Gerant) {
        setGerantEnEdition(gerant.id)
        setGerantEdit({ ...gerant })
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">

            {/* Header du bloc */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-subheading text-lg font-semibold text-brand-forest">
                    Gérants
                </h2>
                <button
                    onClick={() => setAjoutGerant(!ajoutGerant)}
                    className="font-body bg-brand-mid hover:bg-brand-dark text-white text-xs px-4 py-2 rounded-lg transition-colors"
                >
                    + Ajouter
                </button>
            </div>

            {/* Formulaire ajout gérant */}
            {ajoutGerant && (
                <div className="px-6 py-4 bg-brand-light/10 border-b border-gray-100">
                    <p className="font-body text-xs text-brand-slate uppercase tracking-wide font-medium mb-3">
                        Nouveau gérant
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                            type="text"
                            placeholder="Nom"
                            value={nouveauGerant.name}
                            onChange={(e) => setNouveauGerant({ ...nouveauGerant, name: e.target.value })}
                            className="font-body border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={nouveauGerant.email}
                            onChange={(e) => setNouveauGerant({ ...nouveauGerant, email: e.target.value })}
                            className="font-body border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
                        />
                        <select
                            value={nouveauGerant.establishmentName || ''}
                            onChange={(e) => setNouveauGerant({ ...nouveauGerant, establishmentName: e.target.value })}
                            className="font-body border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
                        >
                            <option value="">Choisir un établissement</option>
                            {etablissements.map(e => (
                                <option key={e.id} value={e.name}>{e.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            onClick={() => setAjoutGerant(false)}
                            className="font-body text-sm text-brand-slate hover:text-brand-forest transition-colors px-4 py-2"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={addGerant}
                            className="font-body bg-brand-mid hover:bg-brand-dark text-white text-sm px-5 py-2 rounded-lg transition-colors"
                        >
                            Valider
                        </button>
                    </div>
                </div>
            )}

            {/* Tableau gérants */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide text-left px-6 py-3">Nom</th>
                            <th className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide text-left px-6 py-3">E-mail</th>
                            <th className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide text-left px-6 py-3">Rôle</th>
                            <th className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide text-left px-6 py-3">Établissement</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {gerants.map((gerant) => (
                            <tr key={gerant.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                                {/* Mode lecture */}
                                {gerantEnEdition !== gerant.id ? (
                                    <>
                                        <td className="font-body text-sm text-brand-forest px-6 py-4">{gerant.name}</td>
                                        <td className="font-body text-sm text-brand-slate px-6 py-4">{gerant.email}</td>
                                        <td className="font-body text-sm text-brand-slate px-6 py-4">{gerant.role}</td>
                                        <td className="font-body text-sm text-brand-slate px-6 py-4">{gerant.establishmentName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => startEditGerant(gerant)}
                                                    className="font-body text-xs text-brand-mid hover:text-brand-dark font-medium transition-colors px-3 py-1.5 rounded-lg border border-brand-mid/30 hover:border-brand-mid"
                                                >
                                                    Éditer
                                                </button>
                                                <button
                                                    onClick={() => deleteGerant(gerant.id)}
                                                    className="font-body text-xs text-red-400 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-400"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    /* Mode édition inline */
                                    <>
                                        <td className="px-6 py-3">
                                            <input
                                                value={gerantEdit?.name}
                                                onChange={(e) => setGerantEdit({ ...gerantEdit!, name: e.target.value })}
                                                className="font-body border border-brand-mid/50 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-mid"
                                            />
                                        </td>
                                        <td className="px-6 py-3">
                                            <input
                                                type="email"
                                                value={gerantEdit?.email}
                                                onChange={(e) => setGerantEdit({ ...gerantEdit!, email: e.target.value })}
                                                className="font-body border border-brand-mid/50 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-mid"
                                            />
                                        </td>
                                        <td className="px-6 py-3">
                                            <input
                                                value={gerantEdit?.role}
                                                onChange={(e) => setGerantEdit({ ...gerantEdit!, role: e.target.value })}
                                                className="font-body border border-brand-mid/50 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-mid"
                                            />
                                        </td>
                                        <td className="px-6 py-3">
                                            <input
                                                value={gerantEdit?.establishmentName || ''}
                                                disabled
                                                className="font-body border border-gray-200 bg-gray-50 rounded-lg px-3 py-1.5 text-sm w-full text-gray-500"
                                            />
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={saveGerant}
                                                    className="font-body text-xs text-white bg-brand-mid hover:bg-brand-dark font-medium transition-colors px-3 py-1.5 rounded-lg"
                                                >
                                                    Valider
                                                </button>
                                                <button
                                                    onClick={() => setGerantEnEdition(null)}
                                                    className="font-body text-xs text-brand-slate hover:text-brand-forest transition-colors px-3 py-1.5 rounded-lg border border-gray-200"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
}