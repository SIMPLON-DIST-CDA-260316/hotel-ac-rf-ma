"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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
        <form onSubmit={handleLogin}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" disabled={loading} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" disabled={loading} />
            {error && <div style={{ color: "red" }}>{error}</div>}
            <button type="submit" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
        </form>
    );
}