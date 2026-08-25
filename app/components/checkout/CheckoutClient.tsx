'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useCart } from '../marketplace/CartProvider';

type Totals = { subtotal: number; discount: number; delivery: number; tax: number; total: number };

export function CheckoutClient() {
  const { city, items } = useCart();
  const [totals, setTotals] = useState<Totals | null>(null);
  const [payment, setPayment] = useState('upi');
  const [status, setStatus] = useState('');
  useEffect(() => { if (items.length) fetch('/api/cart/price', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ city, items }) }).then((response) => response.json() as Promise<{ data: Totals }>).then((payload) => setTotals(payload.data)); }, [city, items]);
  if (!items.length) return <section className="empty-cart"><h1>YOUR BAG IS EMPTY.</h1><Link className="button button-dark" href="/plants">Explore plants</Link></section>;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus('Preparing secure payment…');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ city, items, paymentMethod: payment, address: Object.fromEntries(form) }) });
    const payload = await response.json() as { data?: { orderNumber: string }; error?: { message?: string } };
    setStatus(response.ok ? `Order ${payload.data?.orderNumber ?? 'created'} created.` : payload.error?.message ?? 'Checkout is unavailable.');
  };

  return (
    <section className="checkout-layout"><form onSubmit={submit}><p className="eyebrow dark"><span /> Secure checkout</p><h1>WHERE SHOULD<br />NATURE ARRIVE?</h1><fieldset><legend>Delivery address</legend><div className="form-grid"><label><span>Full name</span><input required name="fullName" autoComplete="name" /></label><label><span>Phone</span><input required name="phone" inputMode="tel" autoComplete="tel" pattern="[0-9 +()-]{8,16}" /></label><label className="full"><span>Address</span><input required name="line1" autoComplete="address-line1" /></label><label><span>Locality</span><input required name="locality" autoComplete="address-level3" /></label><label><span>PIN code</span><input required name="postalCode" inputMode="numeric" pattern="[1-9][0-9]{5}" autoComplete="postal-code" /></label><label><span>City</span><input readOnly name="city" value={city} /></label><label><span>State</span><input required name="state" autoComplete="address-level1" /></label></div></fieldset><fieldset><legend>Payment</legend><div className="payment-options"><label className={payment === 'upi' ? 'selected' : ''}><input type="radio" name="paymentMethodDisplay" value="upi" checked={payment === 'upi'} onChange={(event) => setPayment(event.target.value)} /><strong>UPI</strong><span>Razorpay-ready</span></label><label className={payment === 'card' ? 'selected' : ''}><input type="radio" name="paymentMethodDisplay" value="card" checked={payment === 'card'} onChange={(event) => setPayment(event.target.value)} /><strong>Card</strong><span>Visa, Mastercard, RuPay</span></label></div><p className="payment-note">Payment credentials are intentionally not stored in the repository. The production service creates provider orders server-side.</p></fieldset><button className="button button-dark place-order" type="submit">Pay ₹{totals?.total.toLocaleString('en-IN') ?? '—'} <span>→</span></button>{status && <p className="checkout-status" role="status">{status}</p>}</form><aside><h2>Order summary</h2><p>{items.reduce((sum, item) => sum + item.quantity, 0)} living plants · {city}</p><dl><div><dt>Plants</dt><dd>₹{totals?.subtotal.toLocaleString('en-IN') ?? '—'}</dd></div><div><dt>Delivery</dt><dd>{totals?.delivery === 0 ? 'Free' : `₹${totals?.delivery ?? '—'}`}</dd></div><div><dt>Tax</dt><dd>₹{totals?.tax.toLocaleString('en-IN') ?? '—'}</dd></div><div><dt>Total</dt><dd>₹{totals?.total.toLocaleString('en-IN') ?? '—'}</dd></div></dl></aside></section>
  );
}
