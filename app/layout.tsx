import type { Metadata } from 'next'
import { Cormorant_Garamond, Aref_Ruqaa } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif'
});

const arefRuqaa = Aref_Ruqaa({ 
  subsets: ["arabic"],
  weight: ['400', '700'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'متجر ريتال | كريم ريتال للجسم',
  description: 'كريم ريتال الفاخر للعناية بالجسم - مكونات طبيعية 100% لبشرة ناعمة ومشرقة',
  generator: 'v0.app',
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
    <html lang="ar" dir="rtl">
      <body className={`${arefRuqaa.variable} ${cormorant.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
