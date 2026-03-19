import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-brand-forest text-white/70 mt-auto">
            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Colonne 1 — Marque */}
                <div>
                    <p className="text-brand-light font-medium mb-2">🌙 Hôtel Clair de Lune</p>
                    <p className="text-sm leading-relaxed">
                        Des hôtels ruraux au cœur des plus belles régions naturelles de France.
                    </p>
                </div>

                {/* Colonne 2 — Liens */}
                <div>
                    <p className="text-white font-medium mb-3 text-sm">Navigation</p>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-brand-light transition-colors">Accueil</Link></li>
                        <li><Link href="/etablissements" className="hover:text-brand-light transition-colors">Nos hôtels</Link></li>
                        <li><Link href="/contact" className="hover:text-brand-light transition-colors">Contact</Link></li>
                    </ul>
                </div>

                {/* Colonne 3 — Légal */}
                <div>
                    <p className="text-white font-medium mb-3 text-sm">Informations</p>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/mentions-legales" className="hover:text-brand-light transition-colors">Mentions légales</Link></li>
                        <li><Link href="/cgv" className="hover:text-brand-light transition-colors">CGV</Link></li>
                    </ul>
                </div>

            </div>

            {/* Barre du bas */}
            <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
                © {new Date().getFullYear()} Hôtel Clair de Lune — Tous droits réservés
            </div>
        </footer>
    )
}