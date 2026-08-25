'use client';

export default function PlantsError({ reset }: { reset: () => void }) {
  return <main className="route-state"><p className="eyebrow"><span /> A path is blocked</p><h1>The collection could not be reached.</h1><button className="button button-primary" type="button" onClick={reset}>Try again</button></main>;
}
