import type { Metadata } from 'next';
import { FinderClient } from '../components/finder/FinderClient';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { SiteHeader } from '../components/navigation/SiteHeader';

export const metadata: Metadata = { title: 'Find Your Plant | Sivorment', description: 'Get transparent, rule-based plant recommendations for your light, space, care rhythm, pets, budget and city.' };

export default function FinderPage() {
  return <main><SiteHeader /><FinderClient /><SiteFooter /></main>;
}
