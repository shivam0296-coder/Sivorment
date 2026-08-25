'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Plant } from '../../../lib/types';
import { useCart } from './CartProvider';

export function PlantCard({ plant }: { plant: Plant }) {
  const { city, addItem } = useCart();
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);
  const inventory = plant.inventory.find((item) => item.citySlug === city);
  const price = inventory?.promotionalPrice ?? inventory?.salePrice ?? inventory?.price ?? plant.salePrice ?? plant.basePrice;
  const originalPrice = inventory?.price ?? plant.basePrice;
  const inStock = Boolean(inventory?.stock);
  const imageOffset = Number(plant.id.slice(-2)) % 4;

  const add = () => {
    if (!inStock) return;
    addItem({ plantId: plant.id, variantId: plant.variants[0].id, quantity: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="plant-card">
      <div className="plant-card-media">
        <Link href={`/plants/${plant.slug}`} aria-label={`View ${plant.name}`}>
          <Image src={plant.images[0].webpUrl} alt={plant.images[0].altText} fill sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw" style={{ objectFit: 'cover', objectPosition: `${imageOffset * 31}% center` }} />
        </Link>
        <button type="button" className={`wishlist-button ${saved ? 'is-saved' : ''}`} aria-label={saved ? `Remove ${plant.name} from wishlist` : `Save ${plant.name} to wishlist`} aria-pressed={saved} onClick={() => setSaved((value) => !value)}>{saved ? '♥' : '♡'}</button>
        <span className="plant-badge">{plant.petSafe ? 'Pet friendly' : plant.difficulty === 'easy' ? 'Easy care' : plant.category}</span>
      </div>
      <div className="plant-card-body">
        <div><p className="plant-scientific">{plant.scientificName}</p><h3><Link href={`/plants/${plant.slug}`}>{plant.name}</Link></h3></div>
        <div className="rating" aria-label={`${plant.rating} out of 5 from ${plant.reviewCount} reviews`}><span aria-hidden="true">★</span> {plant.rating} <small>({plant.reviewCount})</small></div>
        <div className="plant-card-buy">
          <p><strong>₹{price.toLocaleString('en-IN')}</strong>{price < originalPrice && <del>₹{originalPrice.toLocaleString('en-IN')}</del>}</p>
          <button type="button" onClick={add} disabled={!inStock}>{!inStock ? 'Unavailable' : added ? 'Added ✓' : 'Add +'}</button>
        </div>
      </div>
    </article>
  );
}
