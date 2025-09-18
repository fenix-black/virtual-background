import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Virtual Background Generator | AI-Powered Video Call Backgrounds',
  description: 'Create stunning, professional virtual backgrounds for Zoom, Teams, and Google Meet using AI. Match your brand with custom logo integration and multiple style options.',
  keywords: 'virtual background, video call background, Zoom background, Teams background, Google Meet background, AI background generator, professional backgrounds, brand backgrounds, logo integration',
  authors: [{ name: 'FenixBlack.ai', url: 'https://www.fenixblack.ai' }],
  creator: 'FenixBlack.ai',
  publisher: 'FenixBlack.ai',
  applicationName: 'Virtual Background Generator',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://backgrounds.fenixblack.ai'), // Replace with your actual domain
  openGraph: {
    title: 'Virtual Background Generator - AI-Powered Professional Backgrounds',
    description: 'Transform your video calls with AI-generated professional virtual backgrounds that match your brand. Upload your logo and create stunning backgrounds in seconds.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'es_ES',
    siteName: 'Virtual Background Generator',
    images: [
      {
        url: '/og-image.png', // You should add an Open Graph image
        width: 1200,
        height: 630,
        alt: 'Virtual Background Generator Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Background Generator | AI-Powered',
    description: 'Create professional virtual backgrounds with AI. Perfect for Zoom, Teams & Meet.',
    creator: '@fenixblack_ai', // Replace with your Twitter handle if you have one
    images: ['/og-image.png'], // Same as OG image
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/fenix-icon.png', type: 'image/png' },
      { url: '/fenix-icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/fenix-icon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/fenix-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/fenix-icon.png',
        color: '#6366f1',
      },
    ],
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#111827',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
