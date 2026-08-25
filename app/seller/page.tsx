import type { Metadata } from 'next';
import { PortalClient } from '../components/account/PortalClient';
import { SiteHeader } from '../components/navigation/SiteHeader';
export const metadata: Metadata = { title: 'Seller Portal | Sivorment', robots: { index: false, follow: false } };
export default function SellerPage() { return <main className="light-page"><SiteHeader /><PortalClient role="seller" /></main>; }
