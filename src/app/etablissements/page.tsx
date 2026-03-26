import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import EtablissementCard from '@/components/cards/EtablissementCard'
import { headers } from 'next/headers'

type SearchParams = Promise<{
    region?: string
    dateDebut?: string
    dateFin?: string
    personnes?: string
}>

async function getBaseUrl() {
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    return `${protocol}://${host}/api`
}

export default async function RecherchePage({searchParams,}: {
    searchParams: SearchParams
}) {
    const params = await searchParams
    const region    = params.region    ?? ''
    const dateDebut = params.dateDebut ?? ''
    const dateFin   = params.dateFin   ?? ''
    const personnes = params.personnes ?? ''

    const baseUrl = await getBaseUrl()

    const query = new URLSearchParams()
    if (region)    query.set('region', region)
    if (personnes) query.set('people', personnes)
    if (dateDebut) query.set('startAt', new Date(dateDebut).toISOString())
    if (dateFin)   query.set('finishAt', new Date(dateFin).toISOString())

    const [etablissementsRes, allRes] = await Promise.all([
        fetch(`${baseUrl}/establishments?${query.toString()}`, { cache: 'no-store' }),
        fetch(`${baseUrl}/establishments`, { next: { revalidate: 3600 } }),
    ])

    const etablissements = etablissementsRes.ok ? await etablissementsRes.json() : []
    const allEtablissements = allRes.ok ? await allRes.json() : []

    const regions: string[] = [...new Set<string>(
        allEtablissements.map((e: any) => e.region).filter(Boolean)
    )]

    return (
        <div className="min-h-screen bg-gray-50">

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

            <div className="max-w-5xl mx-auto px-4 py-10">

                <div className="mb-8">
                    <h1 className="font-heading text-2xl font-semibold text-brand-forest mb-1">
                        {etablissements.length > 0
                            ? `${etablissements.length} établissement${etablissements.length > 1 ? 's' : ''} disponible${etablissements.length > 1 ? 's' : ''}`
                            : 'Aucun résultat'
                        }
                    </h1>
                </div>

                {etablissements.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">🔍</p>
                        <h2 className="font-subheading text-xl font-semibold text-brand-forest mb-2">
                            Aucun établissement trouvé
                        </h2>
                        <p className="font-body text-brand-slate text-sm mb-6">
                            Essaie avec une autre destination ou des dates différentes.
                        </p>
                        <Link
                            href="/etablissements"
                            className="font-body text-brand-mid hover:text-brand-dark text-sm font-medium transition-colors"
                        >
                            Effacer les filtres →
                        </Link>
                    </div>
                )}

                {etablissements.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {etablissements.map((e: any) => (
                            <EtablissementCard key={e.id} etablissement={e} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}