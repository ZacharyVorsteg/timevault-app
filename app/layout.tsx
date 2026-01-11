import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers';
import { ToastProvider } from '@/contexts/ToastContext';
import { ServiceWorkerRegister } from './sw-register';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TimeVault - Privacy-First Time Tracking',
  description:
    'Track your time, understand your habits, boost your productivity. All without sending a single byte of data to any server.',
  keywords: ['time tracking', 'productivity', 'privacy', 'offline', 'PWA'],
  authors: [{ name: 'TimeVault' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TimeVault',
  },
  openGraph: {
    type: 'website',
    title: 'TimeVault - Privacy-First Time Tracking',
    description: 'Track your time with complete privacy. Your data never leaves your device.',
    siteName: 'TimeVault',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeVault - Privacy-First Time Tracking',
    description: 'Track your time with complete privacy. Your data never leaves your device.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <ToastProvider>
            <ServiceWorkerRegister />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
