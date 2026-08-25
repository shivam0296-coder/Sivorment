import Link from 'next/link';
import { BotanicalForeground } from './components/environment/BotanicalForeground';
import { LeafParticles } from './components/environment/LeafParticles';
import { MistLayer } from './components/environment/MistLayer';
import { MountainLayer } from './components/environment/MountainLayer';
import { NatureSky } from './components/environment/NatureSky';
import { HomeSections } from './components/home/HomeSections';
import { SiteHeader } from './components/navigation/SiteHeader';

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <NatureSky />
        <MountainLayer />
        <MistLayer />
        <LeafParticles />

        <SiteHeader overlay />

        <div className="hero-content">
          <p className="eyebrow"><span /> A digital ecosystem for living spaces</p>
          <h1 id="hero-title">CREATE A<br /><em>NATURE WORLD.</em></h1>
          <p className="hero-lead">Create a natural world with plants.</p>
          <p className="hero-copy">Discover plants that transform ordinary spaces into living environments.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/plants">Explore plants <span aria-hidden="true">↗</span></Link>
            <Link className="button button-ghost" href="/finder">Find your plant <span aria-hidden="true">→</span></Link>
          </div>
        </div>

        <div className="hero-aside" aria-label="Sivorment promise">
          <span className="aside-number">01</span>
          <div><p>One living platform</p><span>Curated by city. Grown for your world.</span></div>
        </div>

        <div className="scroll-cue" aria-hidden="true"><span /> Enter the forest</div>
        <BotanicalForeground />
      </section>
      <HomeSections />
    </main>
  );
}
