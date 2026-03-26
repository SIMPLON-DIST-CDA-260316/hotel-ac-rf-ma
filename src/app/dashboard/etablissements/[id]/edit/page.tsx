'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

type Etablissement = {
    id: number
    name: string
    description: string
    address: string
    region: string
    city: string
    image_path: string | null
    manager_id: string | null
}

export default function EditEtablissementPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState<Etablissement>({
        id: 0,
        name: '',
        description: '',
        address: '',
        region: '',
        city: '',
        image_path: null,
        manager_id: null,
    })

    useEffect(() => {
        fetchEtablissement()
    }, [id])

    async function fetchEtablissement() {
        try {
            setLoading(true)
            const res = await fetch(`/api/establishments/${id}`)
            if (res.ok) {
                const data = await res.json()
                setForm(data)
            } else {
                alert('Établissement non trouvé')
                router.push('/dashboard')
            }
        } catch (error) {
            console.error('Erreur:', error)
            alert('Erreur lors du chargement')
            router.push('/dashboard')
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        try {
            setSaving(true)
            const res = await fetch(`/api/establishments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    address: form.address,
                    region: form.region,
                    city: form.city,
                    image_path: form.image_path,
                    manager_id: form.manager_id,
                })
            })

            if (!res.ok) {
                throw new Error('Erreur lors de la modification')
            }

            alert('Établissement modifié avec succès')
            router.push('/dashboard')
        } catch (error) {
            console.error('Erreur:', error)
            alert('Erreur lors de la modification de l\'établissement')
        } finally {
            setSaving(false)
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10">
                <p className="font-body text-brand-slate">Chargement...</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-semibold text-brand-forest mb-2">
                    Modifier l'établissement
                </h1>
                <p className="font-body text-brand-slate text-sm">
                    Modifiez les informations ci-dessous
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
                            className="w-full font-body border border-brand-mid/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
                        />
                    </div>
                </div>

                {/* Boutons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={saving}
                        className="font-body text-sm text-white bg-brand-mid hover:bg-brand-dark font-medium transition-colors px-6 py-2.5 rounded-lg disabled:opacity-50"
                    >
                        {saving ? 'Modification...' : 'Enregistrer les modifications'}
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
