'use client';

import { FormEvent, useState } from 'react';
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function SellerApply() {
  const [status, setStatus] = useState('');
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setStatus('Submitting your nursery…'); const response = await fetch(`${apiUrl}/api/seller/apply`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }); const payload = await response.json() as { error?: { message?: string } }; setStatus(response.ok ? 'Application received. Your seller workspace is ready for review.' : payload.error?.message ?? 'Application could not be submitted.'); };
  return <form className="seller-form" onSubmit={submit}><h2>Grow with Sivorment</h2><p>Seller applications are reviewed before listings become visible.</p><label><span>Nursery display name</span><input name="displayName" required /></label><label><span>Legal name</span><input name="legalName" required /></label><label><span>Phone</span><input name="phone" required /></label><label><span>GSTIN (optional)</span><input name="gstin" /></label><button className="button button-dark" type="submit">Apply to sell <span>→</span></button>{status && <p role="status">{status}</p>}</form>;
}
