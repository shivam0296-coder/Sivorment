'use client';

import { FormEvent, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function AccountClient() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [status, setStatus] = useState('');
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus(mode === 'login' ? 'Entering your world…' : 'Creating your world…');
    const form = new FormData(event.currentTarget);
    const response = await fetch(`${apiUrl}/api/auth/${mode}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) });
    const payload = await response.json() as { data?: { user?: { displayName?: string } }; error?: { message?: string } };
    if (response.ok) { setStatus(`Welcome${payload.data?.user?.displayName ? `, ${payload.data.user.displayName}` : ''}. Your secure session is active.`); window.setTimeout(() => { window.location.href = '/plants'; }, 900); }
    else setStatus(payload.error?.message ?? 'We could not complete that request.');
  };
  return (
    <section className="account-layout"><div><p className="eyebrow"><span /> A world of your own</p><h1>{mode === 'login' ? 'WELCOME\nBACK.' : 'BEGIN YOUR\nWORLD.'}</h1><p>Save plants, follow orders, keep your city in sync and return to the living world you are building.</p></div><form onSubmit={submit}><div className="account-tabs"><button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setStatus(''); }}>Sign in</button><button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setStatus(''); }}>Create account</button></div>{mode === 'register' && <label><span>Name</span><input name="name" required minLength={2} autoComplete="name" /></label>}<label><span>Email</span><input name="email" required type="email" autoComplete="email" /></label><label><span>Password</span><input name="password" required type="password" minLength={mode === 'register' ? 10 : 1} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label><button className="button button-primary" type="submit">{mode === 'login' ? 'Enter Sivorment' : 'Create account'} <span>→</span></button>{mode === 'login' && <button className="forgot-link" type="button">Forgot your password?</button>}{status && <p className="account-status" role="status">{status}</p>}<small>The API stores only hashed passwords and issues a short-lived, HttpOnly session cookie.</small></form></section>
  );
}
