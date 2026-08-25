import { plants } from '../data/plants.js';
import type { Plant, PlantQuery, RecommendationAnswers } from './types.js';

const effectivePrice = (plant: Plant, city = 'noida') => {
  const offer = plant.inventory.find((item) => item.citySlug === city);
  return offer?.promotionalPrice ?? offer?.salePrice ?? offer?.price ?? plant.salePrice ?? plant.basePrice;
};

const matchesNaturalSearch = (plant: Plant, rawSearch: string, city: string) => {
  const search = rawSearch.toLowerCase().trim();
  if (!search) return true;
  const searchable = [plant.name, plant.scientificName, plant.category, plant.setting, plant.lightRequirement, plant.waterRequirement, plant.difficulty, ...plant.tags].join(' ').toLowerCase();
  const underMatch = search.match(/under\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  if (underMatch && effectivePrice(plant, city) > Number(underMatch[1])) return false;
  const semanticTerms: Record<string, (candidate: Plant) => boolean> = {
    'low light': (candidate) => candidate.lightRequirement === 'low',
    office: (candidate) => candidate.tags.includes('office'),
    'pet friendly': (candidate) => candidate.petSafe,
    balcony: (candidate) => candidate.tags.includes('balcony') || candidate.setting !== 'indoor',
    'easy care': (candidate) => candidate.difficulty === 'easy',
  };
  const matchedSemantic = Object.entries(semanticTerms).filter(([term]) => search.includes(term));
  if (matchedSemantic.length) return matchedSemantic.every(([, matcher]) => matcher(plant));
  const ignored = new Set(['plants', 'plant', 'for', 'the', 'under']);
  const terms = search.split(/\s+/).filter((term) => term.length > 1 && !ignored.has(term) && !/^₹?\d+$/.test(term));
  return terms.every((term) => searchable.includes(term));
};

export function queryPlants(query: PlantQuery) {
  const city = query.city ?? 'noida';
  let filtered = plants.filter((plant) => {
    const inventory = plant.inventory.find((item) => item.citySlug === city);
    const price = effectivePrice(plant, city);
    return matchesNaturalSearch(plant, query.search ?? '', city)
      && (!query.category?.length || query.category.includes(plant.category))
      && (!query.setting?.length || query.setting.includes(plant.setting))
      && (!query.light?.length || query.light.includes(plant.lightRequirement))
      && (!query.water?.length || query.water.includes(plant.waterRequirement))
      && (!query.difficulty?.length || query.difficulty.includes(plant.difficulty))
      && (query.petSafe !== true || plant.petSafe)
      && (!query.size?.length || plant.variants.some((variant) => query.size?.includes(variant.name.toLowerCase())))
      && (query.available !== true || Boolean(inventory && inventory.stock > 0))
      && (!query.minRating || plant.rating >= query.minRating)
      && (!query.minPrice || price >= query.minPrice)
      && (!query.maxPrice || price <= query.maxPrice);
  });
  filtered = filtered.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(40, Math.max(1, query.limit ?? 12));
  return { data: filtered.slice((page - 1) * limit, page * limit), meta: { page, limit, total: filtered.length, pages: Math.ceil(filtered.length / limit), city } };
}

export function getPlantBySlug(slug: string) {
  return plants.find((plant) => plant.slug === slug) ?? null;
}

export function recommendPlants(answers: RecommendationAnswers) {
  return plants.map((plant) => {
    const city = answers.city ?? 'noida';
    const inventory = plant.inventory.find((item) => item.citySlug === city);
    const reasons: string[] = [];
    let score = 0;
    if (answers.setting && (plant.setting === answers.setting || plant.setting === 'both')) { score += 24; reasons.push(`suited to ${answers.setting} spaces`); }
    if (answers.light && plant.lightRequirement === answers.light) { score += 22; reasons.push(`matches your ${answers.light.replace('-', ' ')} light`); }
    if (answers.watering && plant.waterRequirement === answers.watering) { score += 15; reasons.push('fits your watering rhythm'); }
    if (answers.experience && plant.difficulty === answers.experience) { score += 14; reasons.push(`${plant.difficulty} care level`); }
    if (answers.petFriendly && plant.petSafe) { score += 18; reasons.push('pet-friendly'); }
    if (answers.budget && effectivePrice(plant, city) <= answers.budget) { score += 12; reasons.push(`within ₹${answers.budget}`); }
    if (answers.roomType && plant.tags.some((tag) => tag.includes(answers.roomType!.toLowerCase()))) { score += 8; reasons.push(`works in a ${answers.roomType}`); }
    if (answers.preference && plant.tags.some((tag) => tag.includes(answers.preference!.toLowerCase()))) { score += 7; reasons.push(`matches your ${answers.preference} preference`); }
    if (inventory?.stock) score += 4;
    return { plant, score, reasons: reasons.slice(0, 3), price: effectivePrice(plant, city), available: Boolean(inventory?.stock) };
  }).filter((result) => result.available).sort((a, b) => b.score - a.score || b.plant.rating - a.plant.rating).slice(0, 6);
}

export function priceCart(items: Array<{ plantId: string; variantId: string; quantity: number }>, city: string, couponCode?: string) {
  const pricedItems = items.map((item) => {
    const plant = plants.find((candidate) => candidate.id === item.plantId);
    const variant = plant?.variants.find((candidate) => candidate.id === item.variantId);
    const inventory = plant?.inventory.find((candidate) => candidate.citySlug === city);
    if (!plant || !variant || !inventory || inventory.stock < item.quantity) throw new Error('One or more plants are unavailable in the requested quantity for this city.');
    const cityBase = inventory.promotionalPrice ?? inventory.salePrice ?? inventory.price;
    const unitPrice = Math.round(cityBase * (variant.price / plant.basePrice));
    return { plantId: plant.id, variantId: variant.id, sellerId: inventory.sellerId, name: plant.name, variant: variant.name, quantity: item.quantity, unitPrice, lineTotal: unitPrice * item.quantity };
  });
  const subtotal = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const discount = couponCode?.toUpperCase() === 'GROW10' ? Math.min(Math.round(subtotal * .1), 500) : 0;
  const delivery = subtotal - discount >= 999 ? 0 : 79;
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * .05);
  return { items: pricedItems, currency: 'INR' as const, subtotal, discount, delivery, tax, total: taxable + delivery + tax };
}
