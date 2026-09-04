import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

interface Props {
  bites: number;
  won?: boolean;
  onGhostAnimationComplete?: () => void;
  onWinAnimationComplete?: () => void;
  onExited?: () => void;
}

function CrumbParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
  const rotation = `${Math.random() * 360}deg`;
  return (
    <circle
      cx={x}
      cy={y}
      r={Math.random() * 2 + 1}
      fill="#6B3A1A"
      style={{
        animation: 'crumbFall 0.8s ease-out forwards',
        animationDelay: `${delay}ms`,
        '--crumb-rotate': rotation,
      } as CSSProperties}
    />
  );
}

function BiteMark({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / length;
  const ny = dx / length;
  const points: [number, number][] = [];

  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const x = x1 + dx * t;
    const y = y1 + dy * t;
    const offset = Math.sin(t * Math.PI) * 3 + (Math.random() - 0.5) * 2;
    points.push([x + nx * offset, y + ny * offset]);
  }

  const pathData = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`).join(' ');
  return <path d={pathData} fill="none" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;
}

export function BunnyCharacter({ bites, won, onGhostAnimationComplete, onWinAnimationComplete, onExited }: Props) {
  const [animating, setAnimating] = useState(false);
  const [ghostPartsFading, setGhostPartsFading] = useState(false);
  const [winAnimating, setWinAnimating] = useState(false);
  const [exiting, setExiting] = useState(false);

  const onGhostAnimationCompleteRef = useRef(onGhostAnimationComplete);
  const onWinAnimationCompleteRef = useRef(onWinAnimationComplete);
  const onExitedRef = useRef(onExited);

  useEffect(() => { onGhostAnimationCompleteRef.current = onGhostAnimationComplete; }, [onGhostAnimationComplete]);
  useEffect(() => { onWinAnimationCompleteRef.current = onWinAnimationComplete; }, [onWinAnimationComplete]);
  useEffect(() => { onExitedRef.current = onExited; }, [onExited]);

  useEffect(() => {
    if (bites > 0) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [bites]);

  useEffect(() => {
    if (bites < 8) setGhostPartsFading(false);
  }, [bites]);

  useEffect(() => {
    if (bites !== 8) return;
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setGhostPartsFading(true), 1200),
      setTimeout(() => setExiting(true), 2000),
      setTimeout(() => {
        onGhostAnimationCompleteRef.current?.();
        onExitedRef.current?.();
      }, 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [bites]);

  useEffect(() => {
    if (!won) return;
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setWinAnimating(true), 1200),
      setTimeout(() => {
        setWinAnimating(false);
        onWinAnimationCompleteRef.current?.();
      }, 2700),
      setTimeout(() => setExiting(true), 3000),
      setTimeout(() => onExitedRef.current?.(), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [won]);

  const showEarLeft = bites < 1;
  const showEarRight = bites < 2;
  const showArmRight = bites < 3;
  const showArmLeft = bites < 4;
  const showLegRight = bites < 5;
  const showLegLeft = bites < 6;
  const showBody = bites < 7;
  const showHead = bites < 8;
  const ghostHeadOutline = bites === 8;

  type Expression = 'neutral' | 'concerned' | 'worried' | 'scared' | 'terrified' | 'happy';
  const expression: Expression = won
    ? 'happy'
    : bites === 0
      ? 'neutral'
      : bites <= 2
        ? 'concerned'
        : bites <= 4
          ? 'worried'
          : bites <= 6
            ? 'scared'
            : 'terrified';

  const outline = 'rgba(200, 180, 160, 0.6)';
  const faceInk = ghostHeadOutline ? outline : '#3B170B';
  const mouthInk = ghostHeadOutline ? outline : '#692334';
  const cheekOpacity = expression === 'happy' ? 0.7 : expression === 'neutral' ? 0.55 : expression === 'concerned' ? 0.4 : expression === 'worried' ? 0.28 : 0.18;

  return (
    <div
      className="select-none relative w-full mx-auto flex justify-center"
      style={{
        animation: exiting
          ? bites === 8 ? 'ghostFloatAway 1.2s ease-in forwards' : 'bunnyHopOff 0.8s ease-in forwards'
          : animating ? 'bunnyShake 0.4s ease' : undefined,
      }}
    >
      <svg
        viewBox="0 0 200 270"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-auto max-w-[210px] md:max-w-[280px]"
        style={{ maxHeight: 'calc(clamp(240px, 42vh, 340px) - 12px)', aspectRatio: '200 / 270' }}
      >
        <defs>
          <radialGradient id="bunnyChocolate" cx="34%" cy="24%" r="76%">
            <stop offset="0%" stopColor="#C9874C" />
            <stop offset="38%" stopColor="#9A5028" />
            <stop offset="76%" stopColor="#642B13" />
            <stop offset="100%" stopColor="#321006" />
          </radialGradient>
          <radialGradient id="bunnyHead" cx="34%" cy="25%" r="72%">
            <stop offset="0%" stopColor="#D2955C" />
            <stop offset="38%" stopColor="#A85B30" />
            <stop offset="78%" stopColor="#6A2D16" />
            <stop offset="100%" stopColor="#3B1408" />
          </radialGradient>
          <linearGradient id="bunnyEar" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B96A38" />
            <stop offset="58%" stopColor="#713019" />
            <stop offset="100%" stopColor="#3B1408" />
          </linearGradient>
          <linearGradient id="bunnyInnerEar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E49A8A" />
            <stop offset="100%" stopColor="#9C4050" />
          </linearGradient>
          <radialGradient id="bunnyLimb" cx="32%" cy="22%" r="80%">
            <stop offset="0%" stopColor="#C47A42" />
            <stop offset="52%" stopColor="#83401F" />
            <stop offset="100%" stopColor="#421707" />
          </radialGradient>
          <linearGradient id="heartChocolate" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CF7B49" />
            <stop offset="45%" stopColor="#8F3B22" />
            <stop offset="100%" stopColor="#4A160D" />
          </linearGradient>
          <radialGradient id="eyeGloss" cx="35%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#6B3620" />
            <stop offset="55%" stopColor="#241007" />
            <stop offset="100%" stopColor="#090403" />
          </radialGradient>
          <filter id="bunnyShadow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#220A03" floodOpacity="0.35" />
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        <ellipse cx="100" cy="260" rx="51" ry="7" fill="#35160B" opacity={exiting ? 0 : 0.14} style={{ transition: 'opacity 0.6s ease-in' }} />

        <g style={{ animation: winAnimating ? 'bunnyWiggle 1.5s ease-in-out' : 'none' }}>
          <g style={{ animation: ghostPartsFading ? 'ghostWobble 0.8s ease-out forwards' : 'none', pointerEvents: ghostPartsFading ? 'none' : 'auto' }}>
            {/* Ghost positions preserve the eight-piece silhouette during the loss sequence. */}
            {bites > 0 && <ellipse cx="72" cy="42" rx="14" ry="37" fill="rgba(200,180,160,0.38)" transform="rotate(-12 72 42)" />}
            {bites > 1 && <ellipse cx="128" cy="42" rx="14" ry="37" fill="rgba(200,180,160,0.38)" transform="rotate(12 128 42)" />}
            {bites > 2 && <ellipse cx="143" cy="166" rx="20" ry="12" fill="rgba(200,180,160,0.38)" transform="rotate(28 143 166)" />}
            {bites > 3 && <ellipse cx="57" cy="166" rx="20" ry="12" fill="rgba(200,180,160,0.38)" transform="rotate(-28 57 166)" />}
            {bites > 4 && <ellipse cx="126" cy="235" rx="23" ry="15" fill="rgba(200,180,160,0.38)" />}
            {bites > 5 && <ellipse cx="74" cy="235" rx="23" ry="15" fill="rgba(200,180,160,0.38)" />}
            {bites > 6 && <ellipse cx="100" cy="187" rx="43" ry="54" fill="rgba(200,180,160,0.38)" />}

            {ghostPartsFading && bites === 8 && (
              <g opacity="0.55" fill="none" stroke={outline} strokeLinecap="round">
                <path d="M62 69 Q57 48 62 19 Q66 5 75 8 Q84 14 82 35 Q80 54 82 68" strokeWidth="2" />
                <path d="M118 68 Q120 50 118 32 Q116 13 125 8 Q135 5 139 19 Q144 48 138 69" strokeWidth="2" />
                <ellipse cx="100" cy="104" rx="49" ry="47" strokeWidth="2" />
                <ellipse cx="100" cy="181" rx="42" ry="54" strokeWidth="2" />
                <ellipse cx="56" cy="166" rx="20" ry="12" strokeWidth="1.5" transform="rotate(-28 56 166)" />
                <ellipse cx="144" cy="166" rx="20" ry="12" strokeWidth="1.5" transform="rotate(28 144 166)" />
                <ellipse cx="74" cy="235" rx="23" ry="15" strokeWidth="1.5" />
                <ellipse cx="126" cy="235" rx="23" ry="15" strokeWidth="1.5" />
                <circle cx="84" cy="102" r="11" strokeWidth="1.5" />
                <circle cx="116" cy="102" r="11" strokeWidth="1.5" />
                <path d="M92 120 Q100 128 108 120" strokeWidth="2" />
              </g>
            )}
          </g>

          {/* Piece 2: right ear */}
          {showEarRight && (
            <g>
              <path d="M119 72 Q119 50 119 27 Q120 7 131 7 Q143 9 143 28 Q142 51 134 76 Z" fill="url(#bunnyEar)" stroke="#421607" strokeWidth="1.4" />
              <path d="M126 62 Q126 43 127 28 Q128 17 133 17 Q138 19 137 30 Q136 48 132 63 Z" fill="url(#bunnyInnerEar)" opacity="0.86" />
              <path d="M128 14 Q133 10 138 16" fill="none" stroke="#F4C5A2" strokeWidth="2.3" strokeLinecap="round" opacity="0.72" />
              <ellipse cx="130" cy="23" rx="3" ry="7" fill="#FFF0DE" opacity="0.18" transform="rotate(14 130 23)" />
            </g>
          )}

          {/* Piece 1: left ear */}
          {showEarLeft && (
            <g>
              <path d="M81 72 Q81 50 81 27 Q80 7 69 7 Q57 9 57 28 Q58 51 66 76 Z" fill="url(#bunnyEar)" stroke="#421607" strokeWidth="1.4" />
              <path d="M74 62 Q74 43 73 28 Q72 17 67 17 Q62 19 63 30 Q64 48 68 63 Z" fill="url(#bunnyInnerEar)" opacity="0.86" />
              <path d="M72 14 Q67 10 62 16" fill="none" stroke="#F4C5A2" strokeWidth="2.3" strokeLinecap="round" opacity="0.72" />
              <ellipse cx="70" cy="23" rx="3" ry="7" fill="#FFF0DE" opacity="0.18" transform="rotate(-14 70 23)" />
            </g>
          )}

          {bites === 2 && showHead && <BiteMark x1="61" y1="22" x2="139" y2="22" />}

          {/* Piece 7: body */}
          {showBody && (
            <g filter="url(#bunnyShadow)">
              <ellipse cx="100" cy="184" rx="43" ry="55" fill="url(#bunnyChocolate)" stroke="#451706" strokeWidth="1.2" />
              <ellipse cx="86" cy="164" rx="18" ry="29" fill="#F5C08A" opacity="0.09" transform="rotate(20 86 164)" />
              <ellipse cx="82" cy="151" rx="10" ry="17" fill="#FFF2D8" opacity="0.1" transform="rotate(28 82 151)" />
              <path d="M79 190 Q100 201 121 190" fill="none" stroke="#421607" strokeWidth="2" opacity="0.24" />
              <path d="M88 181 Q100 170 112 181 Q100 188 88 181Z" fill="url(#heartChocolate)" stroke="#451706" strokeWidth="1" opacity="0.9" />
              <path d="M92 178 Q96 174 100 178" fill="none" stroke="#FFD3A7" strokeWidth="1.5" strokeLinecap="round" opacity="0.48" />
            </g>
          )}

          {bites === 3 && showBody && <BiteMark x1="137" y1="158" x2="158" y2="174" />}
          {bites === 4 && showBody && <BiteMark x1="42" y1="174" x2="63" y2="158" />}
          {bites === 5 && showBody && <BiteMark x1="109" y1="238" x2="143" y2="238" />}
          {bites === 6 && showBody && <BiteMark x1="57" y1="238" x2="91" y2="238" />}

          {/* Piece 5: right leg */}
          {showLegRight && (
            <g>
              <ellipse cx="126" cy="235" rx="24" ry="16" fill="url(#bunnyLimb)" stroke="#451706" strokeWidth="1.3" transform="rotate(9 126 235)" />
              <ellipse cx="120" cy="229" rx="8" ry="4" fill="#FFD5A5" opacity="0.22" transform="rotate(-10 120 229)" />
              <ellipse cx="132" cy="240" rx="8" ry="6" fill="#4B190C" opacity="0.34" />
              <circle cx="121" cy="239" r="3" fill="#E59B6C" opacity="0.5" />
              <circle cx="131" cy="236" r="3" fill="#E59B6C" opacity="0.5" />
            </g>
          )}

          {/* Piece 6: left leg */}
          {showLegLeft && (
            <g>
              <ellipse cx="74" cy="235" rx="24" ry="16" fill="url(#bunnyLimb)" stroke="#451706" strokeWidth="1.3" transform="rotate(-9 74 235)" />
              <ellipse cx="80" cy="229" rx="8" ry="4" fill="#FFD5A5" opacity="0.22" transform="rotate(10 80 229)" />
              <ellipse cx="68" cy="240" rx="8" ry="6" fill="#4B190C" opacity="0.34" />
              <circle cx="79" cy="239" r="3" fill="#E59B6C" opacity="0.5" />
              <circle cx="69" cy="236" r="3" fill="#E59B6C" opacity="0.5" />
            </g>
          )}

          {/* Piece 3: right arm */}
          {showArmRight && (
            <g>
              <path d="M132 157 Q143 143 157 147 Q169 152 160 164 Q151 178 135 178 Q128 174 132 157Z" fill="url(#bunnyLimb)" stroke="#451706" strokeWidth="1.3" transform="rotate(7 145 162)" />
              <ellipse cx="143" cy="153" rx="8" ry="4" fill="#FFD5A5" opacity="0.22" transform="rotate(-26 143 153)" />
              <path d="M154 153 Q158 155 160 159" fill="none" stroke="#4B190C" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
            </g>
          )}

          {/* Piece 4: left arm */}
          {showArmLeft && (
            <g>
              <path d="M68 157 Q57 143 43 147 Q31 152 40 164 Q49 178 65 178 Q72 174 68 157Z" fill="url(#bunnyLimb)" stroke="#451706" strokeWidth="1.3" transform="rotate(-7 55 162)" />
              <ellipse cx="57" cy="153" rx="8" ry="4" fill="#FFD5A5" opacity="0.22" transform="rotate(26 57 153)" />
              <path d="M46 153 Q42 155 40 159" fill="none" stroke="#4B190C" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
            </g>
          )}

          {/* Piece 8: head */}
          {(showHead || (ghostHeadOutline && !ghostPartsFading)) && (
            <g
              filter={showHead ? 'url(#bunnyShadow)' : undefined}
              style={{ opacity: ghostHeadOutline && !ghostPartsFading ? 0.5 : ghostPartsFading ? 0 : 1, transition: ghostHeadOutline ? 'opacity 0.4s ease' : 'none' }}
            >
              <circle cx="100" cy="105" r="49" fill={ghostHeadOutline ? 'none' : 'url(#bunnyHead)'} stroke={ghostHeadOutline ? outline : '#451706'} strokeWidth={ghostHeadOutline ? 2 : 1.2} />
              {!ghostHeadOutline && (
                <>
                  <ellipse cx="80" cy="79" rx="15" ry="8" fill="#FFF0D8" opacity="0.2" transform="rotate(-32 80 79)" />
                  <ellipse cx="87" cy="70" rx="4" ry="2" fill="#FFF8E8" opacity="0.5" transform="rotate(-32 87 70)" />
                </>
              )}

              {/* Large expressive eyes */}
              <ellipse cx="83" cy="102" rx="12" ry="14" fill={ghostHeadOutline ? 'none' : 'url(#eyeGloss)'} stroke={ghostHeadOutline ? outline : '#3A1309'} strokeWidth={ghostHeadOutline ? 1.5 : 1} />
              <ellipse cx="117" cy="102" rx="12" ry="14" fill={ghostHeadOutline ? 'none' : 'url(#eyeGloss)'} stroke={ghostHeadOutline ? outline : '#3A1309'} strokeWidth={ghostHeadOutline ? 1.5 : 1} />
              {!ghostHeadOutline && (
                <>
                  <ellipse cx="80" cy="97" rx="4.5" ry="5.5" fill="#FFFDF6" transform={expression === 'scared' || expression === 'terrified' ? 'translate(0 -2)' : undefined} />
                  <circle cx="87" cy="108" r="2" fill="#F2B36E" opacity="0.8" />
                  <ellipse cx="114" cy="97" rx="4.5" ry="5.5" fill="#FFFDF6" transform={expression === 'scared' || expression === 'terrified' ? 'translate(0 -2)' : undefined} />
                  <circle cx="121" cy="108" r="2" fill="#F2B36E" opacity="0.8" />
                </>
              )}

              {/* Soft brows */}
              <path d={expression === 'happy' ? 'M74 84 Q83 79 91 84' : expression === 'terrified' ? 'M73 82 Q83 77 91 82' : 'M74 84 Q83 81 91 84'} fill="none" stroke={faceInk} strokeWidth="2.5" strokeLinecap="round" />
              <path d={expression === 'happy' ? 'M109 84 Q117 79 126 84' : expression === 'terrified' ? 'M109 82 Q117 77 127 82' : 'M109 84 Q117 81 126 84'} fill="none" stroke={faceInk} strokeWidth="2.5" strokeLinecap="round" />

              {/* Rosy cheeks */}
              {!ghostHeadOutline && (
                <>
                  <ellipse cx="70" cy="120" rx="12" ry="6" fill="#F47C86" opacity={cheekOpacity} transform="rotate(-8 70 120)" />
                  <ellipse cx="130" cy="120" rx="12" ry="6" fill="#F47C86" opacity={cheekOpacity} transform="rotate(8 130 120)" />
                  <path d="M65 120 l4 -2 M70 122 l4 -2" stroke="#FFB0A1" strokeWidth="1" opacity="0.55" strokeLinecap="round" />
                  <path d="M126 120 l4 2 M131 118 l4 2" stroke="#FFB0A1" strokeWidth="1" opacity="0.55" strokeLinecap="round" />
                </>
              )}

              {/* Small heart-shaped nose and expressive mouth */}
              <path d="M96 116 Q100 112 104 116 Q104 121 100 123 Q96 121 96 116Z" fill={ghostHeadOutline ? 'none' : '#7B2633'} stroke={ghostHeadOutline ? outline : '#42120F'} strokeWidth={ghostHeadOutline ? 1 : 0.8} />
              {!ghostHeadOutline && <path d="M99 115 Q100 114 101 115" fill="none" stroke="#FFD6BD" strokeWidth="1" strokeLinecap="round" opacity="0.65" />}
              {expression === 'happy' && !ghostHeadOutline ? (
                <>
                  <path d="M88 124 Q100 140 112 124 Q110 143 100 145 Q90 143 88 124Z" fill="#6C1D2D" stroke="#42120F" strokeWidth="1" />
                  <path d="M94 137 Q100 132 106 137 Q104 142 100 142 Q96 142 94 137Z" fill="#FF7E91" />
                  <path d="M91 127 Q100 132 109 127" fill="none" stroke="#FFD6BD" strokeWidth="1.2" opacity="0.6" />
                </>
              ) : expression === 'scared' || expression === 'terrified' ? (
                <ellipse cx="100" cy="133" rx={expression === 'terrified' ? 8 : 6} ry={expression === 'terrified' ? 6 : 5} fill={ghostHeadOutline ? 'none' : '#45120E'} stroke={ghostHeadOutline ? outline : '#3A100C'} strokeWidth="1" />
              ) : expression === 'worried' || expression === 'concerned' ? (
                <path d="M92 130 Q100 125 108 130" fill="none" stroke={mouthInk} strokeWidth="2.4" strokeLinecap="round" />
              ) : (
                <path d="M92 127 Q100 134 108 127" fill="none" stroke={mouthInk} strokeWidth="2.4" strokeLinecap="round" />
              )}

              {!ghostHeadOutline && (
                <>
                  <path d="M67 113 L80 116 M67 119 L80 119 M133 113 L120 116 M133 119 L120 119" stroke="#4A1A0C" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
                </>
              )}
            </g>
          )}

          {bites === 7 && showHead && <BiteMark x1="56" y1="151" x2="144" y2="151" />}

          {winAnimating && (
            <g style={{ pointerEvents: 'none' }}>
              <CrumbParticle x={70} y={96} delay={0} />
              <CrumbParticle x={130} y={92} delay={100} />
              <CrumbParticle x={84} y={76} delay={200} />
              <CrumbParticle x={116} y={78} delay={300} />
              <CrumbParticle x={100} y={70} delay={400} />
              <CrumbParticle x={76} y={112} delay={150} />
              <CrumbParticle x={124} y={108} delay={250} />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
