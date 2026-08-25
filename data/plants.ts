import { cities } from './cities.js';
import type { Difficulty, LightRequirement, Plant, PlantSetting, WaterRequirement } from '../lib/types.js';

type PlantSeed = {
  name: string;
  scientificName: string;
  category: string;
  basePrice: number;
  light: LightRequirement;
  water: WaterRequirement;
  difficulty: Difficulty;
  petSafe: boolean;
  setting: PlantSetting;
  tags: string[];
};

const seeds: PlantSeed[] = [
  { name: 'Money Plant', scientificName: 'Epipremnum aureum', category: 'Climbers', basePrice: 249, light: 'low', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['office', 'low light', 'air purifying'] },
  { name: 'Golden Money Plant', scientificName: 'Epipremnum aureum Golden', category: 'Climbers', basePrice: 269, light: 'medium', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['office', 'golden foliage', 'easy care'] },
  { name: 'Snake Plant', scientificName: 'Dracaena trifasciata', category: 'Air Purifying', basePrice: 329, light: 'low', water: 'low', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['bedroom', 'office', 'low light', 'easy care'] },
  { name: 'Peace Lily', scientificName: 'Spathiphyllum wallisii', category: 'Flowering Indoor', basePrice: 349, light: 'medium', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['flowering', 'air purifying', 'living room'] },
  { name: 'Spider Plant', scientificName: 'Chlorophytum comosum', category: 'Air Purifying', basePrice: 279, light: 'medium', water: 'moderate', difficulty: 'easy', petSafe: true, setting: 'indoor', tags: ['pet friendly', 'hanging', 'office'] },
  { name: 'ZZ Plant', scientificName: 'Zamioculcas zamiifolia', category: 'Air Purifying', basePrice: 449, light: 'low', water: 'low', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['office', 'low light', 'easy care'] },
  { name: 'Jade Plant', scientificName: 'Crassula ovata', category: 'Succulents', basePrice: 249, light: 'bright-indirect', water: 'low', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['tabletop', 'succulent', 'easy care'] },
  { name: 'Monstera Deliciosa', scientificName: 'Monstera deliciosa', category: 'Statement Plants', basePrice: 649, light: 'bright-indirect', water: 'moderate', difficulty: 'moderate', petSafe: false, setting: 'indoor', tags: ['statement', 'living room', 'large foliage'] },
  { name: 'Monstera Broken Heart', scientificName: 'Monstera adansonii', category: 'Statement Plants', basePrice: 449, light: 'bright-indirect', water: 'moderate', difficulty: 'moderate', petSafe: false, setting: 'indoor', tags: ['hanging', 'statement', 'large foliage'] },
  { name: 'Areca Palm', scientificName: 'Dypsis lutescens', category: 'Palms', basePrice: 549, light: 'bright-indirect', water: 'moderate', difficulty: 'easy', petSafe: true, setting: 'indoor', tags: ['pet friendly', 'air purifying', 'living room'] },
  { name: 'Bamboo Palm', scientificName: 'Chamaedorea seifrizii', category: 'Palms', basePrice: 499, light: 'medium', water: 'moderate', difficulty: 'easy', petSafe: true, setting: 'indoor', tags: ['pet friendly', 'air purifying', 'office'] },
  { name: 'Lucky Bamboo', scientificName: 'Dracaena sanderiana', category: 'Tabletop', basePrice: 299, light: 'low', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['tabletop', 'gift', 'low light'] },
  { name: 'Aglaonema Green', scientificName: 'Aglaonema commutatum', category: 'Colour Foliage', basePrice: 399, light: 'low', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['office', 'low light', 'colour foliage'] },
  { name: 'Aglaonema Pink', scientificName: 'Aglaonema Pink Beauty', category: 'Colour Foliage', basePrice: 449, light: 'medium', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['pink foliage', 'tabletop', 'gift'] },
  { name: 'Aglaonema Red', scientificName: 'Aglaonema Red Siam', category: 'Colour Foliage', basePrice: 469, light: 'medium', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['red foliage', 'office', 'gift'] },
  { name: 'Syngonium Pink', scientificName: 'Syngonium podophyllum Neon', category: 'Colour Foliage', basePrice: 299, light: 'medium', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['pink foliage', 'tabletop', 'easy care'] },
  { name: 'Syngonium Green', scientificName: 'Syngonium podophyllum', category: 'Colour Foliage', basePrice: 269, light: 'low', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['low light', 'tabletop', 'easy care'] },
  { name: 'Rubber Plant', scientificName: 'Ficus elastica', category: 'Statement Plants', basePrice: 499, light: 'bright-indirect', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['statement', 'living room', 'air purifying'] },
  { name: 'Fiddle Leaf Fig', scientificName: 'Ficus lyrata', category: 'Statement Plants', basePrice: 849, light: 'bright-indirect', water: 'moderate', difficulty: 'advanced', petSafe: false, setting: 'indoor', tags: ['statement', 'large foliage', 'living room'] },
  { name: 'Dracaena', scientificName: 'Dracaena fragrans', category: 'Air Purifying', basePrice: 449, light: 'medium', water: 'low', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['office', 'easy care', 'air purifying'] },
  { name: 'Croton', scientificName: 'Codiaeum variegatum', category: 'Colour Foliage', basePrice: 349, light: 'full-sun', water: 'moderate', difficulty: 'moderate', petSafe: false, setting: 'both', tags: ['balcony', 'colour foliage', 'sun loving'] },
  { name: 'Schefflera', scientificName: 'Heptapleurum arboricola', category: 'Air Purifying', basePrice: 399, light: 'bright-indirect', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'indoor', tags: ['office', 'easy care', 'living room'] },
  { name: 'Boston Fern', scientificName: 'Nephrolepis exaltata', category: 'Ferns', basePrice: 349, light: 'medium', water: 'frequent', difficulty: 'moderate', petSafe: true, setting: 'indoor', tags: ['pet friendly', 'bathroom', 'hanging'] },
  { name: 'English Ivy', scientificName: 'Hedera helix', category: 'Climbers', basePrice: 299, light: 'medium', water: 'moderate', difficulty: 'moderate', petSafe: false, setting: 'both', tags: ['hanging', 'balcony', 'climber'] },
  { name: 'Anthurium', scientificName: 'Anthurium andraeanum', category: 'Flowering Indoor', basePrice: 699, light: 'bright-indirect', water: 'moderate', difficulty: 'moderate', petSafe: false, setting: 'indoor', tags: ['flowering', 'gift', 'living room'] },
  { name: 'Tulsi', scientificName: 'Ocimum tenuiflorum', category: 'Herbs', basePrice: 199, light: 'full-sun', water: 'moderate', difficulty: 'easy', petSafe: true, setting: 'outdoor', tags: ['herb', 'balcony', 'pet friendly'] },
  { name: 'Aloe Vera', scientificName: 'Aloe barbadensis miller', category: 'Succulents', basePrice: 239, light: 'bright-indirect', water: 'low', difficulty: 'easy', petSafe: false, setting: 'both', tags: ['succulent', 'balcony', 'easy care'] },
  { name: 'Bougainvillea', scientificName: 'Bougainvillea glabra', category: 'Flowering Outdoor', basePrice: 349, light: 'full-sun', water: 'low', difficulty: 'easy', petSafe: true, setting: 'outdoor', tags: ['flowering', 'balcony', 'sun loving'] },
  { name: 'Jasmine', scientificName: 'Jasminum sambac', category: 'Flowering Outdoor', basePrice: 299, light: 'full-sun', water: 'moderate', difficulty: 'easy', petSafe: true, setting: 'outdoor', tags: ['fragrant', 'flowering', 'balcony'] },
  { name: 'Hibiscus', scientificName: 'Hibiscus rosa-sinensis', category: 'Flowering Outdoor', basePrice: 299, light: 'full-sun', water: 'frequent', difficulty: 'easy', petSafe: true, setting: 'outdoor', tags: ['flowering', 'balcony', 'sun loving'] },
  { name: 'Lavender', scientificName: 'Lavandula angustifolia', category: 'Herbs', basePrice: 399, light: 'full-sun', water: 'low', difficulty: 'advanced', petSafe: false, setting: 'outdoor', tags: ['fragrant', 'herb', 'balcony'] },
  { name: 'Rosemary', scientificName: 'Salvia rosmarinus', category: 'Herbs', basePrice: 299, light: 'full-sun', water: 'low', difficulty: 'moderate', petSafe: true, setting: 'outdoor', tags: ['herb', 'balcony', 'pet friendly'] },
  { name: 'Marigold', scientificName: 'Tagetes erecta', category: 'Flowering Outdoor', basePrice: 149, light: 'full-sun', water: 'moderate', difficulty: 'easy', petSafe: false, setting: 'outdoor', tags: ['flowering', 'balcony', 'seasonal'] },
  { name: 'Rose Plant', scientificName: 'Rosa indica', category: 'Flowering Outdoor', basePrice: 279, light: 'full-sun', water: 'moderate', difficulty: 'moderate', petSafe: true, setting: 'outdoor', tags: ['flowering', 'gift', 'balcony'] },
  { name: 'Calathea', scientificName: 'Goeppertia ornata', category: 'Prayer Plants', basePrice: 549, light: 'medium', water: 'frequent', difficulty: 'advanced', petSafe: true, setting: 'indoor', tags: ['pet friendly', 'patterned foliage', 'bathroom'] },
  { name: 'Maranta', scientificName: 'Maranta leuconeura', category: 'Prayer Plants', basePrice: 499, light: 'medium', water: 'frequent', difficulty: 'moderate', petSafe: true, setting: 'indoor', tags: ['pet friendly', 'patterned foliage', 'tabletop'] },
  { name: 'Alocasia', scientificName: 'Alocasia amazonica', category: 'Statement Plants', basePrice: 599, light: 'bright-indirect', water: 'moderate', difficulty: 'advanced', petSafe: false, setting: 'indoor', tags: ['statement', 'patterned foliage', 'living room'] },
  { name: 'Bird of Paradise', scientificName: 'Strelitzia reginae', category: 'Statement Plants', basePrice: 899, light: 'bright-indirect', water: 'moderate', difficulty: 'moderate', petSafe: false, setting: 'indoor', tags: ['statement', 'large foliage', 'sunroom'] },
  { name: 'Peperomia', scientificName: 'Peperomia obtusifolia', category: 'Tabletop', basePrice: 349, light: 'medium', water: 'low', difficulty: 'easy', petSafe: true, setting: 'indoor', tags: ['pet friendly', 'tabletop', 'easy care'] },
  { name: 'Raphis Palm', scientificName: 'Rhapis excelsa', category: 'Palms', basePrice: 749, light: 'low', water: 'moderate', difficulty: 'easy', petSafe: true, setting: 'indoor', tags: ['pet friendly', 'low light', 'statement'] },
];

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const money = (value: number) => Math.round(value / 10) * 10 - 1;
const sellerNames = ['Canopy Nursery', 'Moss & Soil Collective', 'Urban Root House'];

export const plants: Plant[] = seeds.map((seed, index) => {
  const slug = slugify(seed.name);
  const imageUrl = `/images/plants/sivorment-plant-atlas.png`;
  const variants = [
    { name: 'Small' as const, potSize: '4 inch nursery pot', plantSize: '15–25 cm', factor: 1, weight: 550 },
    { name: 'Medium' as const, potSize: '6 inch nursery pot', plantSize: '30–50 cm', factor: 1.55, weight: 1100 },
    { name: 'Large' as const, potSize: '8 inch nursery pot', plantSize: '55–90 cm', factor: 2.35, weight: 2400 },
    { name: 'Premium pot' as const, potSize: '7 inch ceramic pot', plantSize: '35–65 cm', factor: 2.1, weight: 2900 },
  ].map((variant, variantIndex) => ({
    id: `variant_${index + 1}_${variantIndex + 1}`,
    name: variant.name,
    potSize: variant.potSize,
    plantSize: variant.plantSize,
    price: money(seed.basePrice * variant.factor),
    stock: 8 + ((index * 7 + variantIndex * 3) % 34),
    imageUrl,
    shippingWeightGrams: variant.weight,
  }));

  const inventory = cities.map((city, cityIndex) => {
    const adjustment = 1 + (((cityIndex % 5) - 2) * 0.018);
    const price = money(seed.basePrice * adjustment);
    const onSale = (index + cityIndex) % 4 === 0;
    return {
      citySlug: city.slug,
      sellerId: `seller_${(index + cityIndex) % 3 + 1}`,
      sellerName: sellerNames[(index + cityIndex) % sellerNames.length],
      price,
      salePrice: onSale ? money(price * 0.88) : null,
      promotionalPrice: (index + cityIndex) % 11 === 0 ? money(price * 0.82) : null,
      stock: (index * 13 + cityIndex * 7) % 36,
      deliveryDays: 1 + ((index + cityIndex) % 5),
      deliveryFee: price >= 599 ? 0 : 49 + ((cityIndex % 3) * 20),
    };
  });

  return {
    id: `plant_${String(index + 1).padStart(3, '0')}`,
    name: seed.name,
    slug,
    scientificName: seed.scientificName,
    description: `${seed.name} brings a distinct living rhythm to ${seed.setting === 'outdoor' ? 'sunlit balconies and gardens' : 'homes and workspaces'}. Each plant is nursery-grown, health checked, and selected for dependable growth in Indian conditions.`,
    category: seed.category,
    setting: seed.setting,
    basePrice: seed.basePrice,
    salePrice: index % 4 === 0 ? money(seed.basePrice * 0.9) : null,
    currency: 'INR',
    lightRequirement: seed.light,
    waterRequirement: seed.water,
    difficulty: seed.difficulty,
    petSafe: seed.petSafe,
    rating: Number((4.1 + ((index * 7) % 9) / 10).toFixed(1)),
    reviewCount: 18 + ((index * 47) % 340),
    featured: index < 8 || [17, 24, 37].includes(index),
    tags: seed.tags,
    careInstructions: `Place in ${seed.light.replace('-', ' ')} light. Water ${seed.water === 'low' ? 'only after the potting mix dries well' : seed.water === 'frequent' ? 'when the top layer begins to dry' : 'when the top 2–3 cm of soil feels dry'}. Rotate the pot monthly for balanced growth.`,
    seoTitle: `${seed.name} Plant Online in India | Sivorment`,
    seoDescription: `Buy a nursery-grown ${seed.name} (${seed.scientificName}) with city-specific stock, care guidance and delivery from Sivorment.`,
    images: [{ imageUrl, thumbnailUrl: imageUrl, mobileUrl: imageUrl, webpUrl: imageUrl, altText: `${seed.name} in a natural Sivorment setting` }],
    variants,
    inventory,
  };
});

export const categories = [...new Set(plants.map((plant) => plant.category))].sort();
