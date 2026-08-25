import { cities } from '../../../data/cities';

export function GET() {
  return Response.json({ data: cities.filter((city) => city.active) }, { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600' } });
}
