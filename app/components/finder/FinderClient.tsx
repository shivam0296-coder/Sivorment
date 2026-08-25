'use client';

import { useState } from 'react';
import type { Plant, RecommendationAnswers } from '../../../lib/types';
import { useCart } from '../marketplace/CartProvider';
import { PlantCard } from '../marketplace/PlantCard';

type Recommendation = { plant: Plant; score: number; reasons: string[]; price: number };
const steps = [
  { key: 'setting', title: 'Where will it live?', options: [['indoor', 'Inside'], ['outdoor', 'Outside'], ['both', 'Either']] },
  { key: 'light', title: 'What light reaches the space?', options: [['low', 'Low light'], ['medium', 'Soft light'], ['bright-indirect', 'Bright, indirect'], ['full-sun', 'Full sun']] },
  { key: 'watering', title: 'How often do you want to water?', options: [['low', 'Rarely'], ['moderate', 'Weekly rhythm'], ['frequent', 'I enjoy frequent care']] },
  { key: 'experience', title: 'What is your plant experience?', options: [['easy', 'New grower'], ['moderate', 'Comfortable'], ['advanced', 'Experienced']] },
  { key: 'petFriendly', title: 'Do pets share your world?', options: [['true', 'Yes, pet-safe only'], ['false', 'No restriction']] },
  { key: 'budget', title: 'What is your starting budget?', options: [['399', 'Under ₹400'], ['599', 'Under ₹600'], ['999', 'Under ₹1,000'], ['2000', 'Open budget']] },
  { key: 'roomType', title: 'Which room are you changing?', options: [['office', 'Workspace'], ['living room', 'Living room'], ['bedroom', 'Bedroom'], ['balcony', 'Balcony'], ['bathroom', 'Bathroom']] },
  { key: 'preference', title: 'What draws you in?', options: [['large foliage', 'Sculptural leaves'], ['flowering', 'Flowers'], ['easy care', 'Quiet resilience'], ['hanging', 'Trailing form'], ['colour foliage', 'Colour']] },
] as const;

export function FinderClient() {
  const { city } = useCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Recommendation[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const current = steps[step];

  const choose = async (value: string) => {
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    if (step < steps.length - 1) { setStep((value) => value + 1); return; }
    setStatus('loading');
    const payload: RecommendationAnswers = { ...next, petFriendly: next.petFriendly === 'true', budget: Number(next.budget), city } as RecommendationAnswers;
    try {
      const response = await fetch('/api/recommendations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Recommendation failed');
      const data = await response.json() as { data: Recommendation[] };
      setResults(data.data);
      setStatus('idle');
    } catch { setStatus('error'); }
  };

  if (results.length) return (
    <section className="finder-results"><p className="eyebrow dark"><span /> Your living matches</p><h1>THESE PLANTS<br /><em>FIT YOUR WORLD.</em></h1><p className="finder-method">Matched with transparent rules—not AI—using your light, care rhythm, pet needs, budget, space and current city inventory.</p><div className="recommendation-grid">{results.map((result) => <div key={result.plant.id} className="recommendation-item"><PlantCard plant={result.plant} /><ul>{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>)}</div><button className="restart-finder" type="button" onClick={() => { setResults([]); setAnswers({}); setStep(0); }}>Start again</button></section>
  );

  return (
    <section className="finder-wizard" aria-live="polite">
      <div className="finder-progress"><span>{String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span><div><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div></div>
      <div className="finder-question"><p className="eyebrow"><span /> Find your plant</p><h1>{current.title}</h1><div className="finder-options">{current.options.map(([value, label]) => <button type="button" key={value} onClick={() => choose(value)}>{label}<span>→</span></button>)}</div>{step > 0 && <button className="finder-back" type="button" onClick={() => setStep((value) => value - 1)}>← Previous question</button>}{status === 'loading' && <p>Reading your environment…</p>}{status === 'error' && <p>We could not read the forest. Please try again.</p>}</div>
      <aside><p>“The right plant is the one that can become part of your real life.”</p><span>Sivorment plant philosophy</span></aside>
    </section>
  );
}
