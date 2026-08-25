import type { Metadata } from 'next';
import Link from 'next/link';
import { plants } from '../../data/plants';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { SiteHeader } from '../components/navigation/SiteHeader';
export const metadata: Metadata = { title: 'Plant Care | Sivorment', description: 'Practical guidance for light, watering, pet safety and growing healthy plants in Indian homes.' };
export default function CarePage() { const guides = plants.slice(0, 9); return <main className="light-page"><SiteHeader /><section className="care-hero"><p className="eyebrow dark"><span /> The care library</p><h1>LEARN THE<br /><em>LIVING RHYTHM.</em></h1><p>Observe first. Water with intention. Give every plant the light and time it actually needs.</p></section><section className="care-guides">{guides.map((plant) => <article key={plant.id}><span>{plant.lightRequirement.replace('-', ' ')} light</span><h2>{plant.name}</h2><p>{plant.careInstructions}</p><Link href={`/plants/${plant.slug}`}>Read plant profile →</Link></article>)}</section><SiteFooter /></main>; }
