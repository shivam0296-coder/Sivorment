import { recommendPlants } from '../../../lib/catalogue-service';
import type { RecommendationAnswers } from '../../../lib/types';

export async function POST(request: Request) {
  try {
    const answers = await request.json() as RecommendationAnswers;
    return Response.json({ data: recommendPlants(answers), methodology: 'Transparent rule-based matching across light, care, space, pets, budget and availability.' });
  } catch {
    return Response.json({ error: { code: 'INVALID_RECOMMENDATION_REQUEST', message: 'Please check your plant finder answers.' } }, { status: 400 });
  }
}
