import Link from 'next/link'
import Image from 'next/image'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import SuiteCard from '@/components/cards/SuiteCard'

type Props = {
    params: Promise<{ id: string }>
}

async function getBaseUrl() {
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    return `${protocol}://${host}/api`
}

export default async function EtablissementPage({ params }: Props) {
    const { id } = await params
    const baseUrl = await getBaseUrl()

    const [etablissementRes, chambresRes] = await Promise.all([
        fetch(`${baseUrl}/establishments/${id}`, { cache: 'no-store' }),
        fetch(`${baseUrl}/establishments/${id}/rooms`, { cache: 'no-store' }),
    ])

    if (!etablissementRes.ok) notFound()

    const e = await etablissementRes.json()
    const chambres = chambresRes.ok ? await chambresRes.json() : []

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
                            {chambres.length} hébergement{chambres.length > 1 ? 's' : ''} disponible{chambres.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {chambres.map((suite: any) => (
                        <SuiteCard key={suite.id} suite={suite} />
                    ))}
                </div>
            </section>
        </>
    )
}