import { queryPlants } from '../../../lib/catalogue-service';
import type { Difficulty, LightRequirement, PlantSetting, WaterRequirement } from '../../../lib/types';

const list = (value: string | null) => value?.split(',').filter(Boolean);

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const result = queryPlants({
    city: params.get('city') ?? undefined,
    search: params.get('search') ?? params.get('q') ?? undefined,
    category: list(params.get('category')),
    setting: list(params.get('setting')) as PlantSetting[] | undefined,
    light: list(params.get('light')) as LightRequirement[] | undefined,
    water: list(params.get('water')) as WaterRequirement[] | undefined,
    difficulty: list(params.get('difficulty')) as Difficulty[] | undefined,
    petSafe: params.get('petSafe') === 'true' || undefined,
    size: list(params.get('size')),
    available: params.get('available') === 'true' || undefined,
    minRating: params.get('minRating') ? Number(params.get('minRating')) : undefined,
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    page: params.get('page') ? Number(params.get('page')) : undefined,
    limit: params.get('limit') ? Number(params.get('limit')) : undefined,
  });
  return Response.json(result, { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' } });
}
