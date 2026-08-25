import { Router } from 'express';
import { getPlantBySlug, queryPlants } from '../../../../lib/catalogue-service.js';
import type { Difficulty, LightRequirement, PlantSetting, WaterRequirement } from '../../../../lib/types.js';

const list = (value: unknown) => typeof value === 'string' ? value.split(',').filter(Boolean) : undefined;
export const plantsRouter = Router();

plantsRouter.get('/', (request, response) => {
  const result = queryPlants({
    city: typeof request.query.city === 'string' ? request.query.city : undefined,
    search: typeof request.query.search === 'string' ? request.query.search : typeof request.query.q === 'string' ? request.query.q : undefined,
    category: list(request.query.category), setting: list(request.query.setting) as PlantSetting[] | undefined,
    light: list(request.query.light) as LightRequirement[] | undefined, water: list(request.query.water) as WaterRequirement[] | undefined,
    difficulty: list(request.query.difficulty) as Difficulty[] | undefined, petSafe: request.query.petSafe === 'true' || undefined,
    size: list(request.query.size), available: request.query.available === 'true' || undefined,
    minRating: request.query.minRating ? Number(request.query.minRating) : undefined, minPrice: request.query.minPrice ? Number(request.query.minPrice) : undefined,
    maxPrice: request.query.maxPrice ? Number(request.query.maxPrice) : undefined, page: request.query.page ? Number(request.query.page) : undefined,
    limit: request.query.limit ? Number(request.query.limit) : undefined,
  });
  response.setHeader('Cache-Control', 'public, max-age=60');
  return response.json(result);
});

plantsRouter.get('/:slug', (request, response) => {
  const plant = getPlantBySlug(request.params.slug);
  if (!plant) return response.status(404).json({ error: { code: 'PLANT_NOT_FOUND', message: 'This plant is not in the catalogue.' } });
  return response.json({ data: plant });
});
