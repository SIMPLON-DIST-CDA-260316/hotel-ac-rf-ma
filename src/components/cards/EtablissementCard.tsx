import Link from 'next/link'
import Image from 'next/image'

type Etablissement = {
    id: string
    name: string
    description: string | null
    image_path: string | null
    city: string
    region: string
    address: string
    manager_id: string
}

export default function EtablissementCard({ etablissement }: { etablissement: Etablissement }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-brand-mid hover:shadow-sm transition-all duration-200">

            {/* Image */}
            <div className="h-48 bg-brand-light/20 relative">
                {etablissement.image_path ? (
                    <Image
                        src={etablissement.image_path}
                        alt={etablissement.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    // Placeholder si pas d'image
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl">🏡</span>
                    </div>
                )}
            </div>

            <div className="p-5">

                <h3 className="font-subheading text-base font-semibold text-brand-forest mb-1">
                    {etablissement.name}
                </h3>

                <p className="font-body text-brand-slate text-sm mb-3">
                    📍 {etablissement.city}, {etablissement.region}
                </p>

                {etablissement.description && (
                    <p className="font-body text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {etablissement.description}
                    </p>
                )}

                <div className="pt-3 border-t border-gray-100">
                    <Link
                        href={`/etablissements/${etablissement.id}`}
                        className="font-body block text-center bg-brand-dark hover:bg-brand-forest text-white text-xs px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        Voir les suites →
                    </Link>
                </div>

            </div>
        </div>
    )
}