import { useMemo } from 'react';

type PieceShape =
  | 'chocolateChunk'
  | 'earFragment'
  | 'bodyChunk'
  | 'irregularShard'
  | 'chocolateBar'
  | 'truffle'
  | 'candy'
  | 'confetti'
  | 'wrappedCandy'
  | 'star';

interface Piece {
  id: number;
  shape: PieceShape;
  x: number;
  delay: number;
  duration: number;
  driftX: number;
  rotate: number;
  size: number;
  color: string;
  settleDelay: number;
}

const CONFETTI_COLORS = ['#FF6B9D', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8E3C', '#C780FF'];
const CHOC_COLORS = ['#6B3A1A', '#8B4513', '#5C2E0E', '#7B4020', '#4A2010', '#9B5523'];

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function buildPieces(kind: 'loss' | 'win'): Piece[] {
  if (kind === 'loss') {
    const lossShapes: PieceShape[] = [
      'chocolateChunk', 'chocolateChunk', 'chocolateChunk',
      'earFragment', 'earFragment',
      'bodyChunk', 'bodyChunk',
      'irregularShard', 'irregularShard', 'irregularShard',
      'chocolateBar',
    ];
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      shape: lossShapes[i % lossShapes.length],
      x: rand(5, 88),
      delay: rand(0, 600),
      duration: rand(1400, 2400),
      driftX: rand(-25, 25),
      rotate: rand(-60, 60),
      size: rand(22, 42),
      color: CHOC_COLORS[Math.floor(Math.random() * CHOC_COLORS.length)],
      settleDelay: rand(0, 400),
    }));
  }

  const winShapes: PieceShape[] = [
    'truffle', 'truffle',
    'candy', 'candy',
    'confetti', 'confetti', 'confetti',
    'wrappedCandy', 'wrappedCandy',
    'star',
  ];
  return Array.from({ length: 22 }, (_, i) => ({
    id: i,
    shape: winShapes[i % winShapes.length],
    x: rand(3, 90),
    delay: rand(0, 800),
    duration: rand(1300, 2200),
    driftX: rand(-30, 30),
    rotate: rand(-180, 180),
    size: rand(18, 38),
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    settleDelay: rand(0, 500),
  }));
}

function PieceSvg({ piece }: { piece: Piece }) {
  const { shape, size, color } = piece;

  if (shape === 'chocolateChunk') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" style={{ overflow: 'visible' }}>
        <path
          d="M6 8 L18 4 L34 10 L36 22 L28 34 L12 36 L4 26 Z"
          fill={color}
          stroke="#3D1A08"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M10 12 L20 10 L30 14" stroke="#3D1A08" strokeWidth="0.8" fill="none" opacity="0.4" />
        <ellipse cx="16" cy="18" rx="5" ry="3" fill="white" opacity="0.12" />
      </svg>
    );
  }

  if (shape === 'earFragment') {
    return (
      <svg width={size * 0.6} height={size * 1.4} viewBox="0 0 24 56" style={{ overflow: 'visible' }}>
        <path
          d="M8 4 Q12 2 16 6 Q20 20 18 40 Q14 52 8 50 Q4 36 6 18 Z"
          fill={color}
          stroke="#3D1A08"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 10 Q12 8 14 12 Q16 24 14 38 Q12 44 10 42 Q8 28 10 10 Z"
          fill="#D06870"
          opacity="0.5"
        />
      </svg>
    );
  }

  if (shape === 'bodyChunk') {
    return (
      <svg width={size} height={size * 0.85} viewBox="0 0 44 36" style={{ overflow: 'visible' }}>
        <path
          d="M4 10 Q8 4 18 6 Q30 4 38 10 Q42 18 40 26 Q34 32 24 32 Q12 34 6 28 Q2 20 4 10 Z"
          fill={color}
          stroke="#3D1A08"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <ellipse cx="16" cy="14" rx="6" ry="4" fill="white" opacity="0.1" />
        <circle cx="28" cy="20" r="2.5" fill="#3D1A08" opacity="0.3" />
      </svg>
    );
  }

  if (shape === 'irregularShard') {
    return (
      <svg width={size * 0.8} height={size * 0.7} viewBox="0 0 32 28" style={{ overflow: 'visible' }}>
        <path
          d="M4 8 L10 4 L20 6 L28 4 L30 14 L26 22 L16 24 L8 20 L2 14 Z"
          fill={color}
          stroke="#3D1A08"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M8 10 L16 8 L24 12" stroke="#3D1A08" strokeWidth="0.6" fill="none" opacity="0.3" />
      </svg>
    );
  }

  if (shape === 'chocolateBar') {
    return (
      <svg width={size} height={size * 0.7} viewBox="0 0 40 28" style={{ overflow: 'visible' }}>
        <rect x="4" y="4" width="32" height="20" rx="3" fill={color} stroke="#3D1A08" strokeWidth="1.5" />
        <line x1="14" y1="4" x2="14" y2="24" stroke="#3D1A08" strokeWidth="1" opacity="0.5" />
        <line x1="26" y1="4" x2="26" y2="24" stroke="#3D1A08" strokeWidth="1" opacity="0.5" />
        <line x1="4" y1="14" x2="36" y2="14" stroke="#3D1A08" strokeWidth="1" opacity="0.5" />
        <rect x="6" y="6" width="6" height="6" rx="1" fill="white" opacity="0.1" />
      </svg>
    );
  }

  if (shape === 'truffle') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" style={{ overflow: 'visible' }}>
        <circle cx="16" cy="18" r="12" fill={`url(#truffleGrad${piece.id})`} stroke="#3D1A08" strokeWidth="1" />
        <ellipse cx="13" cy="14" rx="5" ry="3" fill="white" opacity="0.2" />
        <defs>
          <radialGradient id={`truffleGrad${piece.id}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#A06030" />
            <stop offset="100%" stopColor="#4A2010" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  if (shape === 'candy') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" style={{ overflow: 'visible' }}>
        <circle cx="16" cy="16" r="9" fill={color} stroke="white" strokeWidth="2" />
        <circle cx="13" cy="13" r="3" fill="white" opacity="0.4" />
      </svg>
    );
  }

  if (shape === 'confetti') {
    return (
      <div
        style={{
          width: size,
          height: size * 0.45,
          borderRadius: '2px',
          background: color,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}
      />
    );
  }

  if (shape === 'wrappedCandy') {
    return (
      <svg width={size * 1.2} height={size * 0.7} viewBox="0 0 40 24" style={{ overflow: 'visible' }}>
        <path d="M4 12 L10 4 L10 20 Z" fill={color} opacity="0.7" />
        <path d="M36 12 L30 4 L30 20 Z" fill={color} opacity="0.7" />
        <rect x="10" y="6" width="20" height="12" rx="6" fill={color} stroke="white" strokeWidth="1.5" />
        <ellipse cx="16" cy="10" rx="4" ry="2" fill="white" opacity="0.4" />
      </svg>
    );
  }

  // star
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ overflow: 'visible' }}>
      <path
        d="M16 2 L20 12 L30 12 L22 18 L26 28 L16 22 L6 28 L10 18 L2 12 L12 12 Z"
        fill={color}
        stroke="white"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface Props {
  kind: 'loss' | 'win';
}

export function StageParticles({ kind }: Props) {
  const pieces = useMemo(() => buildPieces(kind), [kind]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '2%',
            animation: `pieceFall ${p.duration}ms cubic-bezier(0.35, 0.05, 0.5, 1) forwards`,
            animationDelay: `${p.delay}ms`,
            '--fall-distance': 'calc(100% - 4px)',
            '--drift-x': `${p.driftX}px`,
            '--drift-rotate': `${p.rotate}deg`,
            '--settle-delay': `${p.settleDelay}ms`,
          } as React.CSSProperties}
        >
          <div
            style={{
              animation: `pieceSpin ${p.duration * 0.7}ms ease-out forwards`,
              animationDelay: `${p.delay}ms`,
              transformOrigin: 'center',
            }}
          >
            <PieceSvg piece={p} />
          </div>
        </div>
      ))}
    </div>
  );
}
