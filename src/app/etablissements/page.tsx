import SearchBar from '@/components/SearchBar'
import EtablissementCard from '@/components/cards/EtablissementCard'

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
    {
        id: '4',
        name: 'Chalet de la Clarée',
        city: 'Névache',
        region: 'Hautes-Alpes',
        address: 'Route de la Clarée, 05100 Névache',
        description: 'Perché à 1 700 m d\'altitude, un chalet d\'exception avec vue sur le massif des Écrins.',
        image_path: null,
        manager_id: '3',
    },
]

const regions = [...new Set(ETABLISSEMENTS_MOCK.map((e) => e.region))]

type SearchParams = Promise<{
    region?: string
    dateDebut?: string
    dateFin?: string
    personnes?: string
}>

export default async function RecherchePage({
    searchParams,
}: {
    searchParams: SearchParams
}) {
    const params = await searchParams
    const region = params.region ?? ''
    const dateDebut = params.dateDebut ?? ''
    const dateFin = params.dateFin ?? ''
    const personnes = params.personnes ?? ''

    // Filtre les établissements selon la région choisie
    const etablissementsFiltres = region
        ? ETABLISSEMENTS_MOCK.filter((e) => e.region === region)
        : ETABLISSEMENTS_MOCK

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Bande verte avec bloc recherche réduit ── */}
            <div className="bg-brand-forest px-4 py-6">
                <div className="max-w-5xl mx-auto">
                    <SearchBar
                        regionInitiale={region}
                        dateDebutInitiale={dateDebut}
                        dateFinInitiale={dateFin}
                        personnesInitiales={personnes}
                        regions={regions}
                    />
                </div>
            </div>

            {/* ── Résultats ── */}
            <div className="max-w-5xl mx-auto px-4 py-10">

                {/* Titre + compteur */}
                <div className="mb-8">
                    <h1 className="font-heading text-2xl font-semibold text-brand-forest mb-1">
                        {etablissementsFiltres.length > 0
                            ? `${etablissementsFiltres.length} établissement${etablissementsFiltres.length > 1 ? 's' : ''} disponible${etablissementsFiltres.length > 1 ? 's' : ''}`
                            : 'Aucun résultat'
                        }
                    </h1>
                </div>

                {/* ── Aucun résultat ── */}
                {etablissementsFiltres.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">🔍</p>
                        <h2 className="font-subheading text-xl font-semibold text-brand-forest mb-2">
                            Aucun établissement trouvé
                        </h2>
                        <p className="font-body text-brand-slate text-sm mb-6">
                            Essaie avec une autre destination ou des dates différentes.
                        </p>
                        <button
                            onClick={() => { }}
                            className="font-body text-brand-mid hover:text-brand-dark text-sm font-medium transition-colors"
                        >
                            Effacer les filtres →
                        </button>
                    </div>
                )}

                {/* ── Grille de 3 cartes ── */}
                {etablissementsFiltres.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {etablissementsFiltres.map((e) => (
                            <EtablissementCard key={e.id} etablissement={e} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}