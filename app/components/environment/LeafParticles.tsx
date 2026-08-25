const particles = [[12, 22], [24, 68], [39, 36], [53, 77], [67, 18], [76, 62], [84, 31], [92, 72]];

export function LeafParticles() {
  return <div className="leaf-particles" aria-hidden="true">{particles.map(([x, y]) => <span key={`${x}-${y}`} className="leaf-particle" style={{ '--x': x, '--y': y } as React.CSSProperties} />)}</div>;
}
