"use client";
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const SUITE_MOCK = {
    id: 's1',
    name: 'Suite Horizon',
    description: "Vue panoramique sur l'estuaire depuis un lit king-size. Baignoire îlot, terrasse privée et service petit-déjeuner inclus. Un espace de vie généreux de 65 m², entièrement tourné vers la nature.",
    capacity: 2,
    price: 320,
    image_path: null,
    images: [null, null, null],
    etablissement_id: '1',
    etablissement_name: 'Le Manoir des Brumes',
}

function differenceEnNuits(debut: string, fin: string): number {
    if (!debut || !fin) return 0
    const d1 = new Date(debut)
    const d2 = new Date(fin)
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
}

export default function SuitePage() {
    const suite = SUITE_MOCK
    const [dateDebut, setDateDebut] = useState('')
    const [dateFin, setDateFin] = useState('')
    const [imageActive, setImageActive] = useState(0)

    const nuits = differenceEnNuits(dateDebut, dateFin)
    const prixTotal = nuits * suite.price

    return (
        <>
            <section className="bg-brand-forest text-white py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <Link
                        href={`/etablissements/${suite.etablissement_id}`}
                        className="inline-flex items-center gap-2 font-body text-sm text-white/70 hover:text-white transition-colors duration-150"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        {suite.etablissement_name}
                    </Link>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    <div className="lg:col-span-2 flex flex-col gap-6">

                        <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden bg-brand-light/20 relative">
                            {suite.images[imageActive] ? (
                                <Image
                                    src={suite.images[imageActive] as string}
                                    alt={suite.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-7xl">🛏️</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {suite.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setImageActive(i)}
                                    className={`h-24 rounded-xl overflow-hidden bg-brand-light/20 relative transition-all duration-150 ${imageActive === i ? 'ring-2 ring-brand-mid' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    {img ? (
                                        <Image src={img} alt={`${suite.name} ${i + 1}`} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-2xl">🛏️</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div>
                            <h1 className="font-subheading text-2xl md:text-3xl font-semibold text-brand-forest mb-2">
                                {suite.name}
                            </h1>
                            <div className="flex items-center gap-4 font-body text-sm text-brand-slate mb-4">
                                <span>👥 {suite.capacity} {suite.capacity > 1 ? 'personnes' : 'personne'}</span>
                                <span>·</span>
                                <span className="font-semibold text-brand-forest">{suite.price} € <span className="font-normal text-brand-slate">/ nuit</span></span>
                            </div>
                            <p className="font-body text-sm text-gray-500 leading-relaxed">
                                {suite.description}
                            </p>
                        </div>

                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-6">
                            <h2 className="font-subheading text-base font-semibold text-brand-forest mb-5">
                                Réserver cette suite
                            </h2>

                            <div className="flex flex-col gap-4 mb-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                        Date de début
                                    </label>
                                    <input
                                        type="date"
                                        value={dateDebut}
                                        onChange={e => setDateDebut(e.target.value)}
                                        className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                        Date de fin
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFin}
                                        onChange={e => setDateFin(e.target.value)}
                                        min={dateDebut}
                                        className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-5">
                                {nuits > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between font-body text-sm text-gray-500">
                                            <span>{suite.price} € × {nuits} nuit{nuits > 1 ? 's' : ''}</span>
                                            <span>{prixTotal} €</span>
                                        </div>
                                        <div className="flex justify-between font-body text-base font-semibold text-brand-forest mt-1">
                                            <span>Prix total du séjour</span>
                                            <span>{prixTotal} €</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="font-body text-sm text-brand-slate text-center">
                                        Sélectionnez vos dates pour voir le prix total
                                    </p>
                                )}
                            </div>

                            <button
                                disabled={nuits === 0}
                                className="font-body w-full bg-brand-mid hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-medium transition-colors duration-200"
                            >
                                Réserver maintenant
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}