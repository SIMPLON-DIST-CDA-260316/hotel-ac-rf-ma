import Link from 'next/link'

export default function Header() {
    return (
        <header className="bg-brand-forest text-white">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-brand-light text-xl">🌙</span>
                    <span className="text-brand-light font-medium text-lg tracking-wide">
                        Hôtel Clair de Lune
                    </span>
                </Link>

                {/* Bouton connexion */}
                <Link href="/login">

                    {/* Version desktop */}
                    <span className="hidden md:block bg-brand-mid hover:bg-brand-dark text-white text-sm px-4 py-2 rounded-lg transition-colors font-body">
                        Se connecter
                    </span>

                    {/* Version mobile — bouton rond avec icône */}
                    <span className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-brand-mid hover:bg-brand-dark transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-5 h-5"
                        >
                            {/* Tête */}
                            <circle cx="12" cy="8" r="4" />
                            {/* Corps */}
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                    </span>

                </Link>

            </div>
        </header>
    )
}