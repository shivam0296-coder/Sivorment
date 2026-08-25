import type { Metadata } from 'next';
import { plants } from '../../data/plants';
import { CatalogueClient } from '../components/marketplace/CatalogueClient';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { SiteHeader } from '../components/navigation/SiteHeader';

export const metadata: Metadata = {
  title: 'Explore Plants | Sivorment',
  description: 'Search and filter 40 nursery-grown plants by city, light, care level, price, availability and pet safety.',
};

export default function PlantsPage() {
  return (
    <main className="light-page">
      <SiteHeader />
      <section className="catalogue-hero"><p className="eyebrow dark"><span /> The living collection</p><h1>FIND YOUR<br /><em>GREEN.</em></h1><p>Every plant is more than an object. It is light, rhythm, growth and atmosphere—chosen for the world you are creating.</p></section>
      <CatalogueClient initialPlants={plants} />
      <SiteFooter />
    </main>
  );
}
