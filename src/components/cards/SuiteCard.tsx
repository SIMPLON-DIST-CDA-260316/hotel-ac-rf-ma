import Link from 'next/link'
import Image from 'next/image'

type Suite = {
    id: string
    name: string
    description: string | null
    image_path: string | null
    capacity: number
    price: number
    etablissement_id?: string
}

export default function SuiteCard({ suite }: { suite: Suite }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-brand-mid hover:shadow-sm transition-all duration-200 flex flex-col md:flex-row">
            <div className="h-48 md:h-auto md:w-52 md:shrink-0 bg-brand-light/20 relative">
                {suite.image_path ? (
                    <Image
                        src={suite.image_path}
                        alt={suite.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl">🛏️</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 p-5">

                <h3 className="font-subheading text-base font-semibold text-brand-forest mb-1">
                    {suite.name}
                </h3>

                <p className="font-body text-brand-slate text-xs mb-2">
                    👥 {suite.capacity} {suite.capacity > 1 ? 'personnes' : 'personne'}
                </p>

                {suite.description && (
                    <p className="font-body text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {suite.description}
                    </p>
                )}

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="font-body text-sm text-gray-400">
                        à partir de{' '}
                        <span className="text-brand-forest font-semibold text-base">
                            {suite.price} €
                        </span>
                        <span className="text-xs"> / nuit</span>
                    </p>

                    <Link
                        href={`${suite.establishment_id}/suites/${suite.id}`}
                        className="font-body text-center bg-brand-dark hover:bg-brand-forest text-white text-xs px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        Voir la suite →
                    </Link>
                </div>

            </div>
        </div>
    )
}