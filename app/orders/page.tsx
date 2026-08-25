import type { Metadata } from 'next';
import { OrdersClient } from '../components/account/OrdersClient';
import { SiteHeader } from '../components/navigation/SiteHeader';
export const metadata: Metadata = { title: 'Orders | Sivorment', robots: { index: false, follow: false } };
export default function OrdersPage(){return <main className="light-page"><SiteHeader/><OrdersClient/></main>;}
