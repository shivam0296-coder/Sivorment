import type { Metadata } from 'next';
import { CheckoutClient } from '../components/checkout/CheckoutClient';
import { SiteHeader } from '../components/navigation/SiteHeader';

export const metadata: Metadata = { title: 'Checkout | Sivorment', robots: { index: false, follow: false } };
export default function CheckoutPage() { return <main className="light-page"><SiteHeader /><CheckoutClient /></main>; }
