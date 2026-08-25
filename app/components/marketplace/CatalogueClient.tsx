'use client';

import { useEffect, useMemo, useState } from 'react';
import { categories } from '../../../data/plants';
import type { Plant } from '../../../lib/types';
import { useCart } from './CartProvider';
import { PlantCard } from './PlantCard';

type ApiResponse = { data: Plant[]; meta: { total: number; city: string } };

export function CatalogueClient({ initialPlants }: { initialPlants: Plant[] }) {
  const { city } = useCart();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [light, setLight] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [petSafe, setPetSafe] = useState(false);
  const [available, setAvailable] = useState(true);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [plants, setPlants] = useState(initialPlants);
  const [total, setTotal] = useState(initialPlants.length);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const query = useMemo(() => {
    const params = new URLSearchParams({ city, limit: '40', maxPrice: String(maxPrice) });
    if (search.trim()) params.set('search', search.trim());
    if (category) params.set('category', category);
    if (light) params.set('light', light);
    if (difficulty) params.set('difficulty', difficulty);
    if (petSafe) params.set('petSafe', 'true');
    if (available) params.set('available', 'true');
    return params.toString();
  }, [available, category, city, difficulty, light, maxPrice, petSafe, search]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus('loading');
      try {
        const response = await fetch(`/api/plants?${query}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Catalogue request failed');
        const payload = await response.json() as ApiResponse;
        setPlants(payload.data);
        setTotal(payload.meta.total);
        setStatus('idle');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setStatus('error');
      }
    }, 320);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [query]);

  const clearFilters = () => { setSearch(''); setCategory(''); setLight(''); setDifficulty(''); setPetSafe(false); setAvailable(true); setMaxPrice(1500); };

  return (
    <div className="catalogue-layout">
      <aside className="filters" aria-label="Plant filters">
        <div className="filter-heading"><h2>Filter the forest</h2><button type="button" onClick={clearFilters}>Reset</button></div>
        <label className="filter-search"><span>Search</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Low light plants…" /></label>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>Light</span><select value={light} onChange={(event) => setLight(event.target.value)}><option value="">Any light</option><option value="low">Low</option><option value="medium">Medium</option><option value="bright-indirect">Bright indirect</option><option value="full-sun">Full sun</option></select></label>
        <label><span>Care level</span><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option value="">Any level</option><option value="easy">Easy</option><option value="moderate">Moderate</option><option value="advanced">Advanced</option></select></label>
        <label className="range-label"><span>Up to <strong>₹{maxPrice.toLocaleString('en-IN')}</strong></span><input type="range" min="199" max="2200" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></label>
        <label className="check-label"><input type="checkbox" checked={petSafe} onChange={(event) => setPetSafe(event.target.checked)} /><span>Pet friendly</span></label>
        <label className="check-label"><input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} /><span>Available in my city</span></label>
      </aside>

      <section className="catalogue-results" aria-live="polite" aria-busy={status === 'loading'}>
        <div className="results-heading"><p><strong>{total}</strong> plants growing in this collection</p><span>{city.replace(/^./, (value) => value.toUpperCase())}</span></div>
        {status === 'error' ? <div className="catalogue-state"><h2>The forest is temporarily offline.</h2><p>Check your connection and try changing a filter.</p></div> : plants.length === 0 ? <div className="catalogue-state"><h2>No plants found in this forest.</h2><p>Try widening your filters or exploring another city.</p><button type="button" onClick={clearFilters}>Clear all filters</button></div> : <div className={`plant-grid catalogue-grid ${status === 'loading' ? 'is-loading' : ''}`}>{plants.map((plant) => <PlantCard key={plant.id} plant={plant} />)}</div>}
      </section>
    </div>
  );
}
