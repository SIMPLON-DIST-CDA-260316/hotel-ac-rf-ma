'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type CreateEstablishmentForm = {
    name: string
    description: string
    address: string
    region: string
    city: string
    image_path: string | null
    manager_id: string | null
}

export default function NewEtablissementPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<CreateEstablishmentForm>({
        name: '',
        description: '',
        address: '',
        region: '',
        city: '',
        image_path: null,
        manager_id: null,
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        try {
            setLoading(true)
            const res = await fetch('/api/establishments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    address: form.address,
                    region: form.region,
                    city: form.city,
                    image_path: null,
                    manager_id: null,
                })
            })

            if (!res.ok) {
                throw new Error('Erreur lors de la création')
            }

            alert('Établissement créé avec succès')
            router.push('/dashboard')
        } catch (error) {
            console.error('Erreur:', error)
            alert('Erreur lors de la création de l\'établissement')
        } finally {
            setLoading(false)
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-semibold text-brand-forest mb-2">
                    Créer un établissement
                </h1>
                <p className="font-body text-brand-slate text-sm">
                    Remplissez les informations ci-dessous pour créer un nouvel établissement
                </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                {/* Nom */}
                <div className="mb-6">
                    <label className="font-body text-sm font-medium text-brand-forest block mb-2">
                        Nom de l'établissement *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Hôtel Le Clair de Lune"
                        className="w-full font-body border border-brand-mid/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
                    />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="font-body text-sm font-medium text-brand-forest block mb-2">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        placeholder="Décrivez votre établissement..."
                        rows={4}
                        className="w-full font-body border border-brand-mid/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid resize-none"
                    />
                </div>

                {/* Adresse */}
                <div className="mb-6">
                    <label className="font-body text-sm font-medium text-brand-forest block mb-2">
                        Adresse *
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        placeholder="Ex: 123 Rue de la Paix"
                        className="w-full font-body border border-brand-mid/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
                    />
                </div>

                {/* Région et Ville */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="font-body text-sm font-medium text-brand-forest block mb-2">
                            Région *
                        </label>
                        <input
                            type="text"
                            name="region"
                            value={form.region}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Île-de-France"
                            className="w-full font-body border border-brand-mid/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
                        />
                    </div>
                    <div>
                        <label className="font-body text-sm font-medium text-brand-forest block mb-2">
                            Ville *
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Paris"
                            className="w-full font-body border border-brand-mid/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
                        />
                    </div>
                </div>

                {/* Boutons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="font-body text-sm text-white bg-brand-mid hover:bg-brand-dark font-medium transition-colors px-6 py-2.5 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Création...' : 'Créer l\'établissement'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        className="font-body text-sm text-brand-slate hover:text-brand-forest font-medium transition-colors px-6 py-2.5 rounded-lg border border-gray-200"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    )
}
