'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function PortalClient({ role }: { role: 'seller' | 'admin' }) {
  const [state, setState] = useState<'loading' | 'ready' | 'unauthorized' | 'error'>('loading');
  const [data, setData] = useState<Record<string, number | string>>({});
  useEffect(() => { fetch(`${apiUrl}/api/${role}/${role === 'seller' ? 'dashboard' : 'overview'}`, { credentials: 'include' }).then(async (response) => { if (response.status === 401 || response.status === 403) { setState('unauthorized'); return; } if (!response.ok) throw new Error(); const payload = await response.json() as { data: Record<string, number | string> }; setData(payload.data); setState('ready'); }).catch(() => setState('error')); }, [role]);
  if (state === 'loading') return <section className="portal-state"><h1>Opening the {role} garden…</h1></section>;
  if (state === 'unauthorized') return <section className="portal-state"><p className="eyebrow dark"><span /> Protected space</p><h1>{role === 'admin' ? 'ADMIN ACCESS REQUIRED.' : 'SELLER ACCESS REQUIRED.'}</h1><p>Permissions are verified by the API for every request.</p><Link className="button button-dark" href="/account">Sign in</Link></section>;
  if (state === 'error') return <section className="portal-state"><h1>The portal is unavailable.</h1><p>Connect the database service and sign in with the correct role.</p></section>;
  return <section className="portal"><p className="eyebrow dark"><span /> {role} workspace</p><h1>{role === 'admin' ? 'THE ECOSYSTEM.' : 'YOUR NURSERY.'}</h1><div className="portal-metrics">{Object.entries(data).map(([key, value]) => <div key={key}><strong>{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</strong><span>{key.replaceAll('_', ' ')}</span></div>)}</div><div className="portal-panels"><article><h2>{role === 'admin' ? 'Platform controls' : 'Inventory & prices'}</h2><p>{role === 'admin' ? 'Manage plants, cities, sellers, users, orders, reviews, coupons and homepage content through role-protected endpoints.' : 'Update city stock, variant pricing, images and fulfilment through seller-owned records.'}</p><button type="button">Open controls →</button></article><article><h2>{role === 'admin' ? 'Order health' : 'Orders & sales'}</h2><p>See current orders, status changes and verified sales without exposing customer or payment secrets.</p><button type="button">View orders →</button></article></div></section>;
}
