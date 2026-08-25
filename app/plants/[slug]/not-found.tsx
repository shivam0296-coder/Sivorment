import Link from 'next/link';

export default function PlantNotFound() {
  return <main className="route-state"><p className="eyebrow"><span /> The trail ends here</p><h1>This plant is not in our forest.</h1><Link className="button button-primary" href="/plants">Return to plants</Link></main>;
}
