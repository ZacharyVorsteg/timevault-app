import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers';
import { ToastProvider } from '@/contexts/ToastContext';
import { ServiceWorkerRegister } from './sw-register';
import { CookieConsent } from '@/components/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://timevault.app'),
  title: {
    default: 'TimeVault - Privacy-First Time Tracking',
    template: '%s | TimeVault',
  },
  description:
    'Track your time, understand your habits, boost your productivity. All without sending a single byte of data to any server.',
  keywords: ['time tracking', 'productivity', 'privacy', 'offline', 'PWA', 'time management'],
  authors: [{ name: 'TimeVault' }],
  creator: 'TimeVault',
  publisher: 'TimeVault',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TimeVault',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://timevault.app',
    siteName: 'TimeVault',
    title: 'TimeVault - Privacy-First Time Tracking',
    description: 'Track your time with complete privacy. Your data never leaves your device.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TimeVault - Privacy-First Time Tracking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeVault - Privacy-First Time Tracking',
    description: 'Track your time with complete privacy. Your data never leaves your device.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TimeVault',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    description: 'Privacy-first time tracking app. Your data never leaves your device.',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '49',
      priceCurrency: 'USD',
      offerCount: '3',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1200',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <ToastProvider>
            <ServiceWorkerRegister />
            {children}
            <CookieConsent />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
