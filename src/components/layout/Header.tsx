import Link from 'next/link'

type HeaderProps = {
    isLoggedIn: boolean
    role: string | null
}

export default function Header({ isLoggedIn, role }: HeaderProps) {
    const isManagerOrAdmin = role === 'admin' || role === 'manager'

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

                {/* Navigation droite */}
                <div className="flex items-center gap-3">

                    {/* Bouton Gérer — admin ou manager uniquement */}
                    {isLoggedIn && isManagerOrAdmin && (
                        <Link href="/dashboard">
                            <span className="hidden md:block bg-brand-mid hover:bg-brand-dark text-white text-sm px-4 py-2 rounded-lg transition-colors font-body">
                                Gérer
                            </span>
                            <span className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-brand-mid hover:bg-brand-dark transition-colors text-sm">
                                ⚙️
                            </span>
                        </Link>
                    )}

                    {/* Bouton Mes réservations — connecté uniquement */}
                    {isLoggedIn && (
                        <Link href="/reservations">
                            <span className="hidden md:block bg-brand-mid hover:bg-brand-dark text-white text-sm px-4 py-2 rounded-lg transition-colors font-body">
                                Mes réservations
                            </span>
                            <span className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-brand-mid hover:bg-brand-dark transition-colors">
                                📋
                            </span>
                        </Link>
                    )}

                    {/* Bouton Se connecter — non connecté uniquement */}
                    {!isLoggedIn && (
                        <Link href="/login">
                            <span className="hidden md:block bg-brand-mid hover:bg-brand-dark text-white text-sm px-4 py-2 rounded-lg transition-colors font-body">
                                Se connecter
                            </span>
                            <span className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-brand-mid hover:bg-brand-dark transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                    className="w-5 h-5"
                                >
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                </svg>
                            </span>
                        </Link>
                    )}

                </div>

            </div>
        </header>
    )
}