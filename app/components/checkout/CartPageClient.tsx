'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { plants } from '../../../data/plants';
import { useCart } from '../marketplace/CartProvider';

type Totals = { items: Array<{ plantId: string; variantId: string; name: string; variant: string; quantity: number; unitPrice: number; lineTotal: number }>; subtotal: number; discount: number; delivery: number; tax: number; total: number };

export function CartPageClient() {
  const { city, items, updateQuantity, removeItem } = useCart();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [totals, setTotals] = useState<Totals | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!items.length) return;
    const controller = new AbortController();
    fetch('/api/cart/price', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal, body: JSON.stringify({ city, items, couponCode: appliedCoupon }) })
      .then(async (response) => { const payload = await response.json() as { data: Totals; error?: { message?: string } }; if (!response.ok) throw new Error(payload.error?.message ?? 'Cart could not be priced.'); setTotals(payload.data); setError(''); })
      .catch((reason) => { if (reason.name !== 'AbortError') setError(reason.message); })
    return () => controller.abort();
  }, [appliedCoupon, city, items]);

  if (!items.length) return <section className="empty-cart"><p className="eyebrow dark"><span /> Your bag</p><h1>YOUR WORLD IS<br />WAITING TO GROW.</h1><p>No plants have joined your world yet.</p><Link className="button button-dark" href="/plants">Explore plants <span>→</span></Link></section>;

  return (
    <section className="cart-layout">
      <div className="cart-items"><p className="eyebrow dark"><span /> Your bag</p><h1>A LIVING<br />COLLECTION.</h1>{items.map((item) => { const plant = plants.find((candidate) => candidate.id === item.plantId); const variant = plant?.variants.find((candidate) => candidate.id === item.variantId); if (!plant || !variant) return null; return <article className="cart-item" key={`${item.plantId}-${item.variantId}`}><Image src={plant.images[0].thumbnailUrl} alt={plant.images[0].altText} width={150} height={150} /><div><p className="plant-scientific">{plant.scientificName}</p><h2>{plant.name}</h2><span>{variant.name} · {variant.potSize}</span><div className="cart-quantity"><button type="button" onClick={() => updateQuantity(item.plantId, item.variantId, item.quantity - 1)}>−</button><output>{item.quantity}</output><button type="button" onClick={() => updateQuantity(item.plantId, item.variantId, item.quantity + 1)}>+</button></div></div><div className="cart-line-price"><strong>₹{totals?.items.find((priced) => priced.plantId === item.plantId && priced.variantId === item.variantId)?.lineTotal.toLocaleString('en-IN') ?? '—'}</strong><button type="button" onClick={() => removeItem(item.plantId, item.variantId)}>Remove</button></div></article>; })}</div>
      <aside className="order-summary"><h2>Order summary</h2><p className="summary-city">Delivery city <strong>{city}</strong></p>{error && <div className="cart-error">{error}</div>}<dl><div><dt>Subtotal</dt><dd>₹{totals?.subtotal.toLocaleString('en-IN') ?? '—'}</dd></div><div><dt>Discount</dt><dd>− ₹{totals?.discount.toLocaleString('en-IN') ?? '0'}</dd></div><div><dt>Delivery</dt><dd>{totals?.delivery === 0 ? 'Free' : `₹${totals?.delivery ?? '—'}`}</dd></div><div><dt>Tax</dt><dd>₹{totals?.tax.toLocaleString('en-IN') ?? '—'}</dd></div><div className="summary-total"><dt>Total</dt><dd>₹{totals?.total.toLocaleString('en-IN') ?? '—'}</dd></div></dl><div className="coupon-row"><label className="sr-only" htmlFor="coupon">Coupon code</label><input id="coupon" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Coupon code" /><button type="button" onClick={() => setAppliedCoupon(coupon.trim())}>Apply</button></div>{appliedCoupon && <p className="coupon-note">{totals?.discount ? `${appliedCoupon.toUpperCase()} applied` : 'Coupon is not valid'}</p>}<Link className={`button button-dark checkout-link ${totals && !error ? '' : 'disabled'}`} href={totals && !error ? '/checkout' : '#'}>Continue to checkout <span>→</span></Link><small>Totals are calculated on the server from current city inventory. Try GROW10 for the seeded promotion.</small></aside>
    </section>
  );
}
