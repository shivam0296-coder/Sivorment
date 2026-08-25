export type LightRequirement = 'low' | 'medium' | 'bright-indirect' | 'full-sun';
export type WaterRequirement = 'low' | 'moderate' | 'frequent';
export type Difficulty = 'easy' | 'moderate' | 'advanced';
export type PlantSetting = 'indoor' | 'outdoor' | 'both';

export interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
  active: boolean;
}

export interface PlantImage {
  imageUrl: string;
  thumbnailUrl: string;
  mobileUrl: string;
  webpUrl: string;
  altText: string;
}

export interface PlantVariant {
  id: string;
  name: 'Small' | 'Medium' | 'Large' | 'Premium pot';
  potSize: string;
  plantSize: string;
  price: number;
  stock: number;
  imageUrl: string;
  shippingWeightGrams: number;
}

export interface CityInventory {
  citySlug: string;
  sellerId: string;
  sellerName: string;
  price: number;
  salePrice: number | null;
  promotionalPrice: number | null;
  stock: number;
  deliveryDays: number;
  deliveryFee: number;
}

export interface Plant {
  id: string;
  name: string;
  slug: string;
  scientificName: string;
  description: string;
  category: string;
  setting: PlantSetting;
  basePrice: number;
  salePrice: number | null;
  currency: 'INR';
  lightRequirement: LightRequirement;
  waterRequirement: WaterRequirement;
  difficulty: Difficulty;
  petSafe: boolean;
  rating: number;
  reviewCount: number;
  featured: boolean;
  tags: string[];
  careInstructions: string;
  seoTitle: string;
  seoDescription: string;
  images: PlantImage[];
  variants: PlantVariant[];
  inventory: CityInventory[];
}

export interface PlantQuery {
  city?: string;
  search?: string;
  category?: string[];
  setting?: PlantSetting[];
  light?: LightRequirement[];
  water?: WaterRequirement[];
  difficulty?: Difficulty[];
  petSafe?: boolean;
  size?: string[];
  available?: boolean;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface RecommendationAnswers {
  setting?: PlantSetting;
  light?: LightRequirement;
  watering?: WaterRequirement;
  experience?: Difficulty;
  petFriendly?: boolean;
  budget?: number;
  roomType?: string;
  preference?: string;
  city?: string;
}
