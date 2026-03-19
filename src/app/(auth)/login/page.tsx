"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!email || !password) {
                throw new Error("Email et mot de passe requis");
            }

            const response = await authClient.signIn.email({
                email,
                password,
            });

            if (response.error) {
                throw new Error(response.error.message || "Erreur lors de la connexion");
            }

            alert("Connecté avec succès !");
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

                {/* Titre */}
                <div className="text-center mb-8">
                    <h1 className="font-heading text-2xl font-semibold text-brand-forest mb-1">
                        Se connecter
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

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">

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

                        {/* Bouton soumettre */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="font-body w-full bg-brand-mid hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-medium transition-colors duration-200 mt-2"
                        >
                            {loading ? "Connexion en cours..." : "Se connecter"}
                        </button>

                    </form>

                    {/* Lien vers register */}
                    <p className="font-body text-center text-sm text-brand-slate mt-6">
                        Pas encore de compte ?{" "}
                        <Link
                            href="/register"
                            className="text-brand-mid hover:text-brand-dark font-medium transition-colors"
                        >
                            Créer un compte
                        </Link>
                    </p>

                </div>

            </div>
        </div>
    );
}