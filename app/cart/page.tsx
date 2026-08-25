import type { Metadata } from 'next';
import { CartPageClient } from '../components/checkout/CartPageClient';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { SiteHeader } from '../components/navigation/SiteHeader';

export const metadata: Metadata = { title: 'Your Bag | Sivorment', description: 'Review plants, city availability, delivery, tax and verified pricing before checkout.' };

export default function CartPage() { return <main className="light-page"><SiteHeader /><CartPageClient /><SiteFooter /></main>; }
