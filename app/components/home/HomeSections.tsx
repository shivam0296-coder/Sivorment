import Link from 'next/link';
import { plants } from '../../../data/plants';
import { PlantCard } from '../marketplace/PlantCard';
import { SiteFooter } from '../navigation/SiteFooter';

export function HomeSections() {
  const featured = plants.filter((plant) => plant.featured).slice(0, 4);
  return (
    <>
      <section className="world-intro section-pad" aria-labelledby="world-title">
        <div className="section-kicker"><span>02</span> Forest / discovery</div>
        <div className="world-copy"><p className="eyebrow"><span /> Nature is a living experience</p><h2 id="world-title">A plant is not décor.<br /><em>It changes the room.</em></h2></div>
        <div className="world-notes"><p>From one quiet leaf on a desk to a room alive with green, Sivorment helps you build the environment that feels like yours.</p><Link href="/plants">Enter the collection <span>↗</span></Link></div>
        <div className="forest-panel"><div className="forest-rings" aria-hidden="true" /><p><span>10</span> connected cities</p><p><span>40</span> living varieties</p><p><span>01</span> shared ecosystem</p></div>
      </section>

      <section className="featured-section section-pad" aria-labelledby="featured-title">
        <div className="section-heading"><div><p className="eyebrow dark"><span /> Curated for your world</p><h2 id="featured-title">Plants with<br /><em>presence.</em></h2></div><p>City-aware availability, considered care guidance, and nursery-grown plants ready to settle into your space.</p></div>
        <div className="plant-grid">{featured.map((plant) => <PlantCard key={plant.id} plant={plant} />)}</div>
        <Link className="text-link" href="/plants">Explore all 40 plants <span>→</span></Link>
      </section>

      <section className="finder-callout section-pad" aria-labelledby="finder-title">
        <div className="water-glow" aria-hidden="true" />
        <div className="finder-copy"><p className="section-kicker"><span>03</span> Mist / intuition</p><h2 id="finder-title">Not sure what<br />will thrive?</h2><p>Tell us about your light, rhythm, pets and space. Our transparent rule-based finder reveals plants that genuinely fit.</p><Link className="button button-primary" href="/finder">Find your plant <span>↗</span></Link></div>
        <ol className="finder-steps"><li><span>01</span><p>Read your space<small>Light, room and city</small></p></li><li><span>02</span><p>Understand your rhythm<small>Watering and experience</small></p></li><li><span>03</span><p>Meet your plants<small>Clear reasons, no false AI</small></p></li></ol>
      </section>

      <section className="cities-section section-pad" aria-labelledby="cities-title"><p className="eyebrow dark"><span /> One connected platform</p><div><h2 id="cities-title">Grown near you.<br /><em>Delivered thoughtfully.</em></h2><p>Inventory, sellers, delivery and prices respond to your city while the Sivorment world stays beautifully connected.</p></div><ul><li>Noida</li><li>Delhi</li><li>Lucknow</li><li>Jaipur</li><li>Mumbai</li><li>Pune</li><li>Bengaluru</li><li>Hyderabad</li></ul></section>

      <section className="final-cta"><p className="eyebrow"><span /> Your world begins here</p><h2>CREATE YOUR<br /><em>NATURE WORLD.</em></h2><p>Start with one plant. Build an entire world.</p><Link className="button button-primary" href="/plants">Explore Sivorment <span>↗</span></Link></section>
      <SiteFooter />
    </>
  );
}
