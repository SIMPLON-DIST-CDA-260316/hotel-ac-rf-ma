"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password || !firstname || !lastname) {
            setError("Tous les champs sont requis");
            return;
        }

        if (password !== passwordConfirm) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);

        try {
            const response = await authClient.signUp.email({
                email,
                password,
                name: `${firstname} ${lastname}`,
            });

            if (response.error) {
                throw new Error(response.error.message || "Erreur lors de l'inscription");
            }

            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="font-heading text-2xl font-semibold text-brand-forest mb-1">
                        Créer un compte
                    </h1>
                </div>

                {/* Carte formulaire */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                    {/* Message d'erreur */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
                            <p className="font-body text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-5">

                        {/* Prénom + Nom côte à côte */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    placeholder="Prénom"
                                    disabled={loading}
                                    className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    placeholder="Nom"
                                    disabled={loading}
                                    className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                Adresse email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                disabled={loading}
                                className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50"
                            />
                        </div>

                        {/* Mot de passe */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mot de passe"
                                disabled={loading}
                                className="font-body border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50"
                            />
                        </div>

                        {/* Confirmation mot de passe */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="Confirmer le mot de passe"
                                className={`font-body border rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-mid bg-gray-50 ${passwordConfirm.length > 0 && password !== passwordConfirm
                                    ? 'border-red-300'
                                    : 'border-gray-200'
                                    }`}
                            />
                            {/* Message si les mots de passe ne correspondent pas */}
                            {passwordConfirm.length > 0 && password !== passwordConfirm && (
                                <p className="font-body text-red-500 text-xs mt-0.5">
                                    Les mots de passe ne correspondent pas
                                </p>
                            )}
                        </div>

                        {/* Bouton soumettre */}
                        <button
                            type='submit'
                            onClick={handleRegister}
                            disabled={loading}
                            className="font-body w-full bg-brand-mid hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-medium transition-colors duration-200 mt-2"
                        >
                            {loading ? 'Création en cours...' : 'Créer mon compte'}
                        </button>

                    </div>

                    {/* Lien vers login */}
                    <p className="font-body text-center text-sm text-brand-slate mt-6">
                        Déjà un compte ?{' '}
                        <Link
                            href="/login"
                            className="text-brand-mid hover:text-brand-dark font-medium transition-colors"
                        >
                            Se connecter
                        </Link>
                    </p>

                </div>

            </div>
        </div>
    )
}