'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Plant } from '../../../lib/types';
import { useCart } from './CartProvider';

export function ProductPurchasePanel({ plant }: { plant: Plant }) {
  const { city, addItem } = useCart();
  const [variantId, setVariantId] = useState(plant.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);
  const variant = plant.variants.find((item) => item.id === variantId) ?? plant.variants[0];
  const inventory = plant.inventory.find((item) => item.citySlug === city);
  const cityPrice = inventory?.promotionalPrice ?? inventory?.salePrice ?? inventory?.price ?? plant.basePrice;
  const price = Math.round(cityPrice * (variant.price / plant.basePrice));
  const inStock = Boolean(inventory && inventory.stock >= quantity);

  const add = () => {
    if (!inStock) return;
    addItem({ plantId: plant.id, variantId, quantity });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="purchase-panel">
      <div className="product-price"><strong>₹{price.toLocaleString('en-IN')}</strong>{inventory && price < inventory.price && <del>₹{inventory.price.toLocaleString('en-IN')}</del>}<small>Inclusive of taxes</small></div>
      <div className={`availability ${inStock ? 'in-stock' : 'out-stock'}`}><span />{inStock ? `${inventory?.stock} available in ${city}` : `Unavailable in ${city}`}</div>
      <fieldset className="variant-picker"><legend>Choose a size</legend>{plant.variants.map((item) => <label key={item.id} className={variantId === item.id ? 'selected' : ''}><input type="radio" name="variant" value={item.id} checked={variantId === item.id} onChange={() => setVariantId(item.id)} /><strong>{item.name}</strong><span>{item.plantSize}</span><small>₹{Math.round(cityPrice * (item.price / plant.basePrice)).toLocaleString('en-IN')}</small></label>)}</fieldset>
      <div className="quantity-row"><span>Quantity</span><div><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><output>{quantity}</output><button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(20, value + 1))}>+</button></div></div>
      <div className="purchase-actions"><button className="button button-dark" type="button" onClick={add} disabled={!inStock}>{added ? 'Added to your world ✓' : 'Add to bag'}</button><button className={`save-product ${saved ? 'saved' : ''}`} type="button" onClick={() => setSaved((value) => !value)} aria-pressed={saved} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>{saved ? '♥' : '♡'}</button></div>
      <Link className={`buy-now ${inStock ? '' : 'disabled'}`} href={inStock ? '/checkout' : '#'} onClick={add}>Buy now <span>→</span></Link>
      <dl className="delivery-promise"><div><dt>Delivery</dt><dd>{inventory ? `${inventory.deliveryDays}–${inventory.deliveryDays + 1} days` : 'Not available'}</dd></div><div><dt>Seller</dt><dd>{inventory?.sellerName ?? 'No seller in this city'}</dd></div><div><dt>Delivery fee</dt><dd>{inventory?.deliveryFee === 0 ? 'Free' : inventory ? `₹${inventory.deliveryFee}` : '—'}</dd></div></dl>
    </div>
  );
}
