"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <form onSubmit={handleRegister}>
            <input value={firstname} onChange={e => setFirstname(e.target.value)} placeholder="Prénom" disabled={loading} />
            <input value={lastname} onChange={e => setLastname(e.target.value)} placeholder="Nom" disabled={loading} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" disabled={loading} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" disabled={loading} />
            {error && <div style={{ color: "red" }}>{error}</div>}
            <button type="submit" disabled={loading}>{loading ? "Inscription..." : "S'inscrire"}</button>
        </form>
    );
}