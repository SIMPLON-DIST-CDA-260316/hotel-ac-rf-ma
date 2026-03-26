'use client'

import { useRouter } from 'next/navigation'

export default function EstablishmentsBack() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 font-body text-sm text-white/70 hover:text-white transition-colors duration-150 mb-8"
        >
            ← Retour aux résultats
        </button>
    )
}