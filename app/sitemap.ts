import type { MetadataRoute } from 'next';
import { plants } from '../data/plants';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const routes = ['', '/plants', '/finder', '/care', '/sell'].map((path) => ({ url: `${origin}${path}`, lastModified: new Date(), changeFrequency: path === '/plants' ? 'daily' as const : 'weekly' as const, priority: path === '' ? 1 : .8 }));
  return [...routes, ...plants.map((plant) => ({ url: `${origin}/plants/${plant.slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: .7 }))];
}
