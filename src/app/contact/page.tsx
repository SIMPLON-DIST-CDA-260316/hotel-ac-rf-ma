'use client'

import { useState } from 'react'

type FormStatus = 'idle' | 'loading' | 'success'

export default function ContactPage() {
    const [nom, setNom] = useState('')
    const [email, setEmail] = useState('')
    const [sujet, setSujet] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState<FormStatus>('idle')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!nom || !email || !sujet || !message) {
            setError('Veuillez remplir tous les champs.')
            return
        }

        setStatus('loading')

        setTimeout(() => {
            setStatus('success')
            setNom('')
            setEmail('')
            setSujet('')
            setMessage('')
        }, 600)
    }

    return (
        <>
            <section className="bg-brand-forest text-white py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-3">
                        Nous contacter
                    </h1>
                    <p className="font-body text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
                        Une question sur une réservation, un établissement ou simplement envie d'en savoir plus ?
                        Notre équipe vous répond dans les meilleurs délais.
                    </p>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">

                <aside className="flex flex-col gap-6">
                    <h2 className="font-subheading text-lg font-semibold text-brand-forest mb-1">
                        Informations
                    </h2>

                    <div className="flex flex-col gap-5">
                        <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5">📧</span>
                            <div>
                                <p className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide mb-0.5">
                                    Email
                                </p>
                                <p className="font-body text-sm text-brand-forest">
                                    contact@hotelclairdelune.fr
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5">📞</span>
                            <div>
                                <p className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide mb-0.5">
                                    Téléphone
                                </p>
                                <p className="font-body text-sm text-brand-forest">
                                    +33 1 23 45 67 89
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5">🕐</span>
                            <div>
                                <p className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide mb-0.5">
                                    Horaires
                                </p>
                                <p className="font-body text-sm text-brand-forest">
                                    Lun - Ven, 9h - 18h
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5">
                        <p className="font-body text-xs text-brand-slate leading-relaxed">
                            Pour les demandes urgentes concernant une réservation en cours, privilégiez le contact téléphonique.
                        </p>
                    </div>
                </aside>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                        {status === 'success' && (
                            <div className="bg-brand-light/20 border border-brand-mid/30 rounded-xl px-4 py-4 mb-6 text-center">
                                <p className="text-2xl mb-1">✅</p>
                                <p className="font-body text-brand-dark text-sm font-medium">
                                    Message envoyé avec succès !
                                </p>
                                <p className="font-body text-brand-slate text-xs mt-1">
                                    Nous vous répondrons dans les meilleurs délais.
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
                                <p className="font-body text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                        Nom complet
                                    </label>
                                    <input
                                        type="text"
                                        value={nom}
                                        onChange={(e) => setNom(e.target.value)}
                                        placeholder="Jean Dupont"
                                        disabled={status === 'loading'}
                                        className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50 disabled:opacity-50"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                        Adresse email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jean@exemple.fr"
                                        disabled={status === 'loading'}
                                        className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                    Sujet
                                </label>
                                <select
                                    value={sujet}
                                    onChange={(e) => setSujet(e.target.value)}
                                    disabled={status === 'loading'}
                                    className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50 disabled:opacity-50"
                                >
                                    <option value="">Sélectionner un sujet</option>
                                    <option value="reservation">Question sur une réservation</option>
                                    <option value="etablissement">Informations sur un établissement</option>
                                    <option value="annulation">Annulation ou modification</option>
                                    <option value="partenariat">Partenariat / référencement</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                    Message
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Décrivez votre demande..."
                                    rows={5}
                                    disabled={status === 'loading'}
                                    className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50 resize-none disabled:opacity-50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="font-body mt-2 w-full bg-brand-mid hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-medium transition-colors duration-200"
                            >
                                {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
                            </button>

                        </form>
                    </div>
                </div>

            </section>
        </>
    )
}