'use client';

import Link from 'next/link';
import { cities } from '../../../data/cities';
import { useCart } from '../marketplace/CartProvider';

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const { city, itemCount, setCity } = useCart();
  return (
    <header className={`site-header ${overlay ? 'site-header-overlay' : 'site-header-solid'}`}>
      <Link className="brand" href="/" aria-label="Sivorment home"><span className="brand-mark" aria-hidden="true">S</span><span>SIVORMENT</span></Link>
      <nav className="primary-nav" aria-label="Primary navigation">
        <Link href="/plants">Plants</Link><Link href="/finder">Plant finder</Link><Link href="/sell">Sell</Link><Link href="/care">Plant care</Link>
      </nav>
      <div className="header-actions">
        <label className="city-control"><span aria-hidden="true">⌖</span><span className="sr-only">Delivery city</span>
          <select value={city} onChange={(event) => setCity(event.target.value)}>{cities.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select>
        </label>
        <Link className="bag-link" href="/cart" aria-label={`Open cart with ${itemCount} items`}>Bag <span>{itemCount}</span></Link>
      </div>
    </header>
  );
}
