import assert from 'node:assert/strict';
import test from 'node:test';
import { plants } from '../data/plants.js';
import { priceCart, queryPlants, recommendPlants } from '../lib/catalogue-service.js';

test('catalogue contains the 40 normalized seed plants', () => {
  assert.equal(plants.length, 40);
  assert.equal(new Set(plants.map((plant) => plant.slug)).size, 40);
  for (const plant of plants) {
    assert.equal(plant.currency, 'INR');
    assert.equal(plant.inventory.length, 10);
    assert.equal(plant.variants.length, 4);
    assert.ok(plant.images[0].imageUrl.startsWith('/images/'));
  }
});

test('natural search understands low light, price and city availability', () => {
  const lowLight = queryPlants({ city: 'noida', search: 'low light plants', limit: 40 });
  assert.ok(lowLight.data.length > 0);
  assert.ok(lowLight.data.every((plant) => plant.lightRequirement === 'low'));
  const affordable = queryPlants({ city: 'delhi', search: 'plants under ₹500', limit: 40 });
  assert.ok(affordable.data.length > 0);
  assert.ok(affordable.data.every((plant) => {
    const offer = plant.inventory.find((item) => item.citySlug === 'delhi')!;
    return (offer.promotionalPrice ?? offer.salePrice ?? offer.price) <= 500;
  }));
});

test('filters combine pet safety, difficulty and setting', () => {
  const result = queryPlants({ petSafe: true, difficulty: ['easy'], setting: ['indoor'], limit: 40 });
  assert.ok(result.data.length > 0);
  assert.ok(result.data.every((plant) => plant.petSafe && plant.difficulty === 'easy' && plant.setting === 'indoor'));
});

test('cart pricing ignores client prices and derives totals', () => {
  const plant = plants[2];
  const totals = priceCart([{ plantId: plant.id, variantId: plant.variants[0].id, quantity: 2 }], 'noida', 'GROW10');
  assert.equal(totals.items.length, 1);
  assert.equal(totals.subtotal, totals.items[0].unitPrice * 2);
  assert.ok(totals.discount > 0);
  assert.equal(totals.total, totals.subtotal - totals.discount + totals.delivery + totals.tax);
});

test('recommendations expose clear matching reasons', () => {
  const results = recommendPlants({ city: 'noida', setting: 'indoor', light: 'low', experience: 'easy', petFriendly: true, budget: 800 });
  assert.ok(results.length > 0);
  assert.ok(results[0].reasons.length > 0);
  assert.ok(results.every((result) => result.available));
});
