import { useMemo } from 'react';

type ParticleKind = 'crumb' | 'confetti' | 'truffle' | 'wrapped';

interface Particle {
  id: number;
  kind: ParticleKind;
  x: number; // percent across stage
  delay: number; // ms
  duration: number; // ms
  driftX: number; // px horizontal drift
  driftDistance: number; // px vertical fall
  rotate: number; // deg
  size: number; // px
  color: string;
}

const CONFETTI_COLORS = ['#FF6B9D', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8E3C', '#C780FF'];
const CRUMB_COLORS = ['#6B3A1A', '#8B4513', '#5C2E0E', '#7B4020', '#4A2010'];

function buildParticles(kind: 'loss' | 'win'): Particle[] {
  const count = kind === 'loss' ? 12 : 18;
  const types: ParticleKind[] = kind === 'loss'
    ? ['crumb']
    : ['confetti', 'confetti', 'confetti', 'truffle', 'wrapped'];

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      id: i,
      kind: type,
      x: Math.random() * 90 + 5,
      delay: Math.random() * 800,
      duration: 2200 + Math.random() * 1500,
      driftX: (Math.random() - 0.5) * 40,
      driftDistance: 180 + Math.random() * 60,
      rotate: (Math.random() - 0.5) * 720,
      size: type === 'crumb' ? 4 + Math.random() * 3 : 7 + Math.random() * 5,
      color: type === 'crumb'
        ? CRUMB_COLORS[Math.floor(Math.random() * CRUMB_COLORS.length)]
        : CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    };
  });
}

function ParticleShape({ particle }: { particle: Particle }) {
  const { kind, size, color } = particle;

  if (kind === 'crumb') {
    return (
      <div
        style={{
          width: size,
          height: size * 0.8,
          borderRadius: '40%',
          background: color,
        }}
      />
    );
  }

  if (kind === 'confetti') {
    return (
      <div
        style={{
          width: size,
          height: size * 0.5,
          borderRadius: '2px',
          background: color,
        }}
      />
    );
  }

  if (kind === 'truffle') {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, #A06030, #4A2010)`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    );
  }

  // wrapped chocolate
  return (
    <div
      style={{
        width: size,
        height: size * 0.8,
        borderRadius: '3px',
        background: color,
        position: 'relative',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
      }}
    >
      <div style={{
        position: 'absolute',
        left: '50%',
        top: -size * 0.3,
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: `${size * 0.3}px solid transparent`,
        borderRight: `${size * 0.3}px solid transparent`,
        borderBottom: `${size * 0.3}px solid ${color}`,
      }} />
    </div>
  );
}

interface Props {
  kind: 'loss' | 'win';
}

export function StageParticles({ kind }: Props) {
  const particles = useMemo(() => buildParticles(kind), [kind]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '5%',
            animation: `particleDrift ${p.duration}ms ease-in forwards`,
            animationDelay: `${p.delay}ms`,
            '--drift-distance': `${p.driftDistance}px`,
            '--drift-x': `${p.driftX}px`,
            '--drift-rotate': `${p.rotate}deg`,
          } as React.CSSProperties}
        >
          <ParticleShape particle={p} />
        </div>
      ))}
    </div>
  );
}
