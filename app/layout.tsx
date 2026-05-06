import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/i18n/context'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif'
});

const sourceSans = Source_Sans_3({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://personales.ulpgc.es/sergio.solbes/'),
  title: 'Sergio Solbes Ferri | Catedrático de Historia Económica',
  description: 'Perfil académico de Sergio Solbes Ferri, profesor e investigador en Historia Económica en la ULPGC. Especialista en finanzas del siglo XVIII, fiscalidad y formación del Estado moderno.',
  keywords: ['Historia Económica', 'Siglo XVIII', 'ULPGC', 'Fiscalidad', 'Islas Canarias', 'Investigación', 'IATEXT', 'Finanzas Públicas'],
  authors: [{ name: 'Sergio Solbes Ferri' }],
  openGraph: {
    title: 'Sergio Solbes Ferri | Historia Económica ULPGC',
    description: 'Especialista en finanzas del siglo XVIII, fiscalidad y formación del Estado moderno.',
    url: 'https://personales.ulpgc.es/sergio.solbes/',
    siteName: 'Sergio Solbes Ferri',
    images: [
      {
        url: '/sergio-profile.png',
        width: 1200,
        height: 630,
        alt: 'Sergio Solbes Ferri',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sergio Solbes Ferri | Historia Económica',
    description: 'Investigador en finanzas del siglo XVIII y formación del Estado moderno.',
    images: ['/sergio-profile.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${playfair.variable} ${sourceSans.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}
