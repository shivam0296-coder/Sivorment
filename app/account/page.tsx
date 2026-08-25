import type { Metadata } from 'next';
import { AccountClient } from '../components/account/AccountClient';
import { SiteHeader } from '../components/navigation/SiteHeader';

export const metadata: Metadata = { title: 'Account | Sivorment', robots: { index: false, follow: false } };
export default function AccountPage() { return <main><SiteHeader /><AccountClient /></main>; }
