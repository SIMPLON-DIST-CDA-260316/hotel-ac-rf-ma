import type { Metadata } from 'next'
import { Montserrat, Palanquin, Raleway } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.css'

// Police des grands titres (H1)
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
})

// Police des sous-titres (H2, H3)
const palanquin = Palanquin({
  subsets: ['latin'],
  variable: '--font-palanquin',
  weight: ['400', '500', '600', '700'],
})

// Police des paragraphes
const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Hôtel Clair de Lune',
  description: 'Réservez votre séjour dans nos hôtels ruraux au cœur de la France',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body
        className={`
          ${montserrat.variable}
          ${palanquin.variable}
          ${raleway.variable}
          flex flex-col min-h-screen bg-gray-50
        `}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}