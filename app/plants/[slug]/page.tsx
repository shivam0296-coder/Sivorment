import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { plants } from '../../../data/plants';
import { getPlantBySlug } from '../../../lib/catalogue-service';
import { ProductPurchasePanel } from '../../components/marketplace/ProductPurchasePanel';
import { SiteFooter } from '../../components/navigation/SiteFooter';
import { SiteHeader } from '../../components/navigation/SiteHeader';

export function generateStaticParams() {
  return plants.map((plant) => ({ slug: plant.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plant = getPlantBySlug(slug);
  if (!plant) return { title: 'Plant not found | Sivorment' };
  return {
    title: plant.seoTitle,
    description: plant.seoDescription,
    alternates: { canonical: `/plants/${plant.slug}` },
    openGraph: { title: plant.seoTitle, description: plant.seoDescription, images: [{ url: plant.images[0].webpUrl, alt: plant.images[0].altText }] },
    twitter: { card: 'summary_large_image', title: plant.seoTitle, description: plant.seoDescription, images: [plant.images[0].webpUrl] },
  };
}

export default async function PlantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plant = getPlantBySlug(slug);
  if (!plant) notFound();
  const imageOffset = Number(plant.id.slice(-2)) % 4;
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'Product', name: plant.name, scientificName: plant.scientificName,
    image: plant.images.map((image) => image.imageUrl), description: plant.description, sku: plant.id,
    brand: { '@type': 'Brand', name: 'Sivorment' },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: Math.min(...plant.inventory.map((item) => item.salePrice ?? item.price)), highPrice: Math.max(...plant.variants.map((item) => item.price)), offerCount: plant.inventory.filter((item) => item.stock > 0).length, availability: 'https://schema.org/InStock' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: plant.rating, reviewCount: plant.reviewCount },
  };
  return (
    <main className="light-page">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/plants">Plants</Link><span>/</span><span aria-current="page">{plant.name}</span></nav>
      <section className="product-layout">
        <div className="product-gallery"><div className="product-main-image"><Image src={plant.images[0].webpUrl} alt={plant.images[0].altText} fill priority sizes="(max-width: 860px) 100vw, 55vw" style={{ objectFit: 'cover', objectPosition: `${imageOffset * 31}% center` }} /><span>Nursery grown</span></div><div className="product-gallery-note"><strong>Living form</strong><p>Every plant grows differently. Natural variation is part of what makes yours unique.</p></div></div>
        <div className="product-info"><p className="eyebrow dark"><span /> {plant.category}</p><h1>{plant.name}</h1><p className="product-scientific">{plant.scientificName}</p><div className="product-rating"><span aria-hidden="true">★</span> {plant.rating} <a href="#reviews">{plant.reviewCount} reviews</a></div><p className="product-description">{plant.description}</p><ProductPurchasePanel plant={plant} /></div>
      </section>
      <section className="care-grid" aria-labelledby="care-title"><div className="care-intro"><p className="eyebrow dark"><span /> Care rhythm</p><h2 id="care-title">Help it<br /><em>thrive.</em></h2><p>{plant.careInstructions}</p></div><dl><div><dt>Light</dt><dd>{plant.lightRequirement.replace('-', ' ')}</dd></div><div><dt>Water</dt><dd>{plant.waterRequirement}</dd></div><div><dt>Difficulty</dt><dd>{plant.difficulty}</dd></div><div><dt>Pet safety</dt><dd>{plant.petSafe ? 'Pet-friendly' : 'Keep away from pets'}</dd></div><div><dt>Location</dt><dd>{plant.setting}</dd></div><div><dt>Pot & size</dt><dd>{plant.variants[0].potSize}, {plant.variants[0].plantSize}</dd></div></dl></section>
      <section id="reviews" className="reviews-section"><p className="eyebrow dark"><span /> Shared experiences</p><h2>Healthy arrivals.<br /><em>Living stories.</em></h2><p>Verified reviews are available after fulfilled purchases. This seed catalogue displays aggregate sample ratings for interface testing.</p></section>
      <SiteFooter />
    </main>
  );
}
