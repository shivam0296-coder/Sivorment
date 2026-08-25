import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { CartProvider } from './components/marketplace/CartProvider';

const display = Cormorant_Garamond({ variable: '--font-display', subsets: ['latin'], weight: ['500', '600', '700'] });
const sans = Manrope({ variable: '--font-sans', subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Sivorment — Create a Nature World',
  description: 'Discover plants that transform ordinary spaces into living environments.',
  applicationName: 'Sivorment',
  keywords: ['plants online India', 'indoor plants', 'plant marketplace', 'plant care', 'Sivorment'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'Sivorment', title: 'Sivorment — Create a Nature World', description: 'Create a natural world with plants.', images: [{ url: '/og.png', width: 1734, height: 907, alt: 'Sivorment — Create a Nature World' }] },
  twitter: { card: 'summary_large_image', title: 'Sivorment — Create a Nature World', description: 'Create a natural world with plants.', images: ['/og.png'] },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#08130f', colorScheme: 'dark light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${sans.variable}`}><CartProvider>{children}</CartProvider></body></html>;
}
