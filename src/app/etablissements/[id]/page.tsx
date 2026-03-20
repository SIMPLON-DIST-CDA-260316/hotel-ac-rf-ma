import Link from 'next/link'
import Image from 'next/image'
import SuiteCard from '@/components/cards/SuiteCard'

const ETABLISSEMENT_MOCK = {
    id: "1",
    name: "Le Manoir des Brumes",
    city: "Honfleur",
    region: "Normandie",
    address: "12 route des falaises, 14600 Honfleur",
    description:
        "Niché en lisière de forêt, cet hôtel offre un cadre paisible face à l'estuaire de la Seine. Chaque chambre est décorée avec soin, mêlant matières naturelles et confort contemporain. Un lieu hors du temps pour se ressourcer en toute sérénité.",
    image_path: null,
};

const SUITES_MOCK = [
    {
        id: "s1",
        name: "Suite Horizon",
        description:
            "Vue panoramique sur l'estuaire depuis un lit king-size. Baignoire îlot, terrasse privée et service petit-déjeuner inclus.",
        capacity: 2,
        price: 320,
        image_path: null,
    },
    {
        id: "s2",
        name: "Chambre Forêt",
        description:
            "Immergée dans la verdure, cette chambre douillet allie bois brut et linge de maison haut de gamme. Idéale pour une escapade en amoureux.",
        capacity: 2,
        price: 195,
        image_path: null,
    },
    {
        id: "s3",
        name: "Suite Familiale Brumes",
        description:
            "Deux espaces distincts reliés par un salon commun. Parfaite pour les familles ou groupes d'amis souhaitant partager un séjour sans sacrifier l'intimité.",
        capacity: 4,
        price: 450,
        image_path: null,
    },
    {
        id: "s4",
        name: "Chambre Normande",
        description:
            "Inspirée des colombages traditionnels, cette chambre charme par ses poutres apparentes et sa cheminée en pierre. Confort moderne garanti.",
        capacity: 2,
        price: 160,
        image_path: null,
    },
];

export default function EtablissementPage() {
    const e = ETABLISSEMENT_MOCK
    const suites = SUITES_MOCK

    return (
        <>
            <section className="bg-brand-forest text-white py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <Link
                        href="/etablissements"
                        className="inline-flex items-center gap-2 font-body text-sm text-white/70 hover:text-white transition-colors duration-150 mb-8"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Retour aux établissements
                    </Link>

                    <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-8 bg-brand-light/20 relative">
                        {e.image_path ? (
                            <Image
                                src={e.image_path}
                                alt={e.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-7xl">🏡</span>
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <h1 className="font-subheading text-3xl md:text-4xl font-semibold mb-2">
                            {e.name}
                        </h1>
                        <p className="font-body text-sm text-white/70 mb-4">
                            📍 {e.city}, {e.region} — {e.address}
                        </p>
                        <p className="font-body text-sm text-white/70 leading-relaxed max-w-2xl mx-auto">
                            {e.description}
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-6 py-20">
                <div className="flex items-baseline justify-between mb-10">
                    <div>
                        <h2 className="font-subheading text-2xl md:text-3xl font-semibold text-brand-forest mb-1">
                            Nos suites &amp; chambres
                        </h2>
                        <p className="font-body text-sm text-brand-slate">
                            {suites.length} hébergement{suites.length > 1 ? 's' : ''} disponible{suites.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {suites.map((suite) => (
                        <SuiteCard key={suite.id} suite={suite} />
                    ))}
                </div>
            </section>
        </>
    )
}
