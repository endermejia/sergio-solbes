import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
  title: 'Sergio Solbes Ferri | Historiador',
  description: 'Profesor e investigador en Historia Económica. Universidad de Las Palmas de Gran Canaria. Especialista en finanzas del siglo XVIII, fiscalidad y formación del Estado moderno.',
  keywords: ['Historia Económica', 'Siglo XVIII', 'ULPGC', 'Fiscalidad', 'Islas Canarias', 'Investigación'],
  authors: [{ name: 'Sergio Solbes Ferri' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
