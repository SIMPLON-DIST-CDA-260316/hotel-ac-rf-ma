'use client'

import { Dispatch, SetStateAction } from 'react'

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

interface ManagerCardProps {
    gerants: Gerant[]
    etablissements: Etablissement[]
    gerantEnEdition: string | null
    gerantEdit: Gerant | null
    setGerantEdit: Dispatch<SetStateAction<Gerant | null>>
    setGerantEnEdition: Dispatch<SetStateAction<string | null>>
    saveGerant: () => void
    deleteGerant: (id: string) => void
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
            </div>

            {/* Tableau gérants */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide text-left px-6 py-3">Nom</th>
                            <th className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide text-left px-6 py-3">E-mail</th>
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
                                            <select
                                                value={gerantEdit?.establishmentName || ''}
                                                onChange={(event) => {
                                                    const selectedName = event.target.value
                                                    const selectedEst = etablissements.find(est => est.name === selectedName)
                                                    setGerantEdit({
                                                        ...gerantEdit!,
                                                        establishmentName: selectedName,
                                                        establishmentId: selectedEst?.id
                                                    })
                                                }}
                                                className="font-body border border-brand-mid/50 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-mid"
                                            >
                                                <option value="">— Aucun établissement</option>
                                                {etablissements.map(est => (
                                                    <option key={est.id} value={est.name}>{est.name}</option>
                                                ))}
                                            </select>
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