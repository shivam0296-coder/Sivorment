import { getPlantBySlug } from '../../../../lib/catalogue-service';

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const plant = getPlantBySlug(slug);
  if (!plant) return Response.json({ error: { code: 'PLANT_NOT_FOUND', message: 'This plant is no longer growing in our catalogue.' } }, { status: 404 });
  return Response.json({ data: plant }, { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=600' } });
}
