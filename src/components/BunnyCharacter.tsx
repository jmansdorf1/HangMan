import { useEffect, useState } from 'react';

interface Props {
  bites: number;
}

function BiteMark({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len;
  const ny = dx / len;

  const points: [number, number][] = [];
  const segments = 8;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = x1 + dx * t;
    const y = y1 + dy * t;
    const offset = Math.sin(t * Math.PI) * 3 + (Math.random() - 0.5) * 2;
    points.push([x + nx * offset, y + ny * offset]);
  }

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

  return (
    <path
      d={pathData}
      fill="none"
      stroke="#8B4513"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function GhostOutline({
  type,
  opacity,
}: {
  type: 'ear' | 'arm' | 'leg' | 'body';
  opacity: number;
}) {
  if (type === 'ear') {
    return (
      <ellipse
        cx="76" cy="42" rx="13" ry="37"
        fill="none"
        stroke="rgba(200, 200, 200, 0.4)"
        strokeWidth="2"
        strokeDasharray="4,4"
        opacity={opacity}
        transform="rotate(-8, 76, 42)"
      />
    );
  }
  if (type === 'arm') {
    return (
      <ellipse
        cx="57" cy="180" rx="19" ry="11"
        fill="none"
        stroke="rgba(200, 200, 200, 0.4)"
        strokeWidth="2"
        strokeDasharray="4,4"
        opacity={opacity}
        transform="rotate(-28, 57, 180)"
      />
    );
  }
  if (type === 'leg') {
    return (
      <ellipse
        cx="78" cy="237" rx="22" ry="13"
        fill="none"
        stroke="rgba(200, 200, 200, 0.4)"
        strokeWidth="2"
        strokeDasharray="4,4"
        opacity={opacity}
      />
    );
  }
  return (
    <ellipse
      cx="100" cy="192" rx="42" ry="52"
      fill="none"
      stroke="rgba(200, 200, 200, 0.4)"
      strokeWidth="2"
      strokeDasharray="4,4"
      opacity={opacity}
    />
  );
}

export function BunnyCharacter({ bites }: Props) {
  const [animating, setAnimating] = useState(false);
  const [prevBites, setPrevBites] = useState(bites);
  const [ghostFading, setGhostFading] = useState(false);

  useEffect(() => {
    if (bites !== prevBites) {
      setAnimating(true);
      setPrevBites(bites);
      const t = setTimeout(() => setAnimating(false), 500);
      return () => clearTimeout(t);
    }
  }, [bites, prevBites]);

  useEffect(() => {
    if (bites === 8) {
      const t = setTimeout(() => setGhostFading(true), 1200);
      return () => clearTimeout(t);
    }
  }, [bites]);

  const showEarLeft = bites < 1;
  const showEarRight = bites < 2;
  const showArmRight = bites < 3;
  const showArmLeft = bites < 4;
  const showLegRight = bites < 5;
  const showLegLeft = bites < 6;
  const showBody = bites < 7;
  const showHead = bites < 8;

  const getEyeExpression = () => {
    if (bites === 0) return { sad: false, concerned: false };
    if (bites <= 2) return { sad: false, concerned: true };
    if (bites <= 4) return { sad: true, concerned: false };
    return { sad: true, concerned: false };
  };

  const { sad, concerned } = getEyeExpression();

  return (
    <div
      className="select-none relative"
      style={{
        animation: animating ? 'bunnyShake 0.4s ease' : undefined,
      }}
    >
      <svg
        viewBox="0 0 200 270"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          maxWidth: 280,
          display: 'block',
          margin: '0 auto',
          opacity: ghostFading ? 0 : 1,
          transform: ghostFading ? 'translateY(-80px)' : 'translateY(0)',
          transition: ghostFading ? 'all 0.6s ease-out' : 'none',
        }}
      >
        <defs>
          <radialGradient id="chocMain" cx="38%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#C48040" />
            <stop offset="55%" stopColor="#7B4020" />
            <stop offset="100%" stopColor="#3D1A08" />
          </radialGradient>

          <radialGradient id="chocEar" cx="35%" cy="25%" r="65%">
            <stop offset="0%" stopColor="#B07030" />
            <stop offset="100%" stopColor="#4A2010" />
          </radialGradient>

          <radialGradient id="innerEarGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#F0B0A8" />
            <stop offset="100%" stopColor="#D06870" />
          </radialGradient>

          <radialGradient id="chocLimb" cx="40%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#B87035" />
            <stop offset="100%" stopColor="#4A2010" />
          </radialGradient>

          <radialGradient id="chocHead" cx="40%" cy="33%" r="60%">
            <stop offset="0%" stopColor="#C88045" />
            <stop offset="50%" stopColor="#7B4020" />
            <stop offset="100%" stopColor="#3D1A08" />
          </radialGradient>

          <filter id="softShadow">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#1A0800" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="100" cy="260" rx="52" ry="7" fill="#1A0800" opacity="0.12" />

        {/* Ghost outlines for eaten parts */}
        {bites > 0 && <GhostOutline type="ear" opacity={bites > 1 ? 0 : 0.6} />}
        {bites > 2 && <GhostOutline type="arm" opacity={0.6} />}
        {bites > 3 && (
          <GhostOutline
            type="arm"
            opacity={0.6}
          />
        )}

        {/* RIGHT EAR (behind head) */}
        {showEarRight && (
          <g>
            <ellipse
              cx="124" cy="42" rx="13" ry="37"
              fill="url(#chocEar)"
              transform="rotate(8, 124, 42)"
            />
            <ellipse
              cx="124" cy="44" rx="7" ry="24"
              fill="url(#innerEarGrad)"
              transform="rotate(8, 124, 44)"
            />
            <ellipse
              cx="121" cy="26" rx="4" ry="7"
              fill="white" opacity="0.1"
              transform="rotate(8, 121, 26)"
            />
          </g>
        )}

        {/* Bite mark between ears */}
        {bites === 2 && showHead && (
          <BiteMark x1="64" y1="20" x2="136" y2="20" />
        )}

        {/* LEFT EAR */}
        {showEarLeft && (
          <g>
            <ellipse
              cx="76" cy="42" rx="13" ry="37"
              fill="url(#chocEar)"
              transform="rotate(-8, 76, 42)"
            />
            <ellipse
              cx="76" cy="44" rx="7" ry="24"
              fill="url(#innerEarGrad)"
              transform="rotate(-8, 76, 44)"
            />
            <ellipse
              cx="73" cy="18" rx="4" ry="7"
              fill="white" opacity="0.1"
              transform="rotate(-8, 73, 18)"
            />
          </g>
        )}

        {/* Bite mark: after right ear eaten */}
        {bites === 2 && showHead && (
          <BiteMark x1="120" y1="35" x2="130" y2="50" />
        )}

        {/* BODY */}
        {showBody && (
          <g filter="url(#softShadow)">
            <ellipse cx="100" cy="192" rx="42" ry="52" fill="url(#chocMain)" />
            <ellipse cx="100" cy="180" rx="20" ry="24" fill="white" opacity="0.07" />
            <ellipse
              cx="116" cy="166" rx="10" ry="6"
              fill="white" opacity="0.13"
              transform="rotate(-30, 116, 166)"
            />
            <circle cx="100" cy="200" r="3.5" fill="#3D1A08" opacity="0.4" />
          </g>
        )}

        {/* Bite marks at body removal points */}
        {bites === 3 && showBody && (
          <BiteMark x1="138" y1="165" x2="155" y2="180" />
        )}
        {bites === 4 && showBody && (
          <BiteMark x1="45" y1="165" x2="62" y2="180" />
        )}
        {bites === 5 && showBody && (
          <BiteMark x1="108" y1="240" x2="138" y2="240" />
        )}
        {bites === 6 && showBody && (
          <BiteMark x1="62" y1="240" x2="92" y2="240" />
        )}

        {/* RIGHT LEG */}
        {showLegRight && (
          <g>
            <ellipse cx="122" cy="237" rx="22" ry="13" fill="url(#chocLimb)" />
            <ellipse cx="116" cy="233" rx="7" ry="3.5" fill="white" opacity="0.1" />
          </g>
        )}

        {/* LEFT LEG */}
        {showLegLeft && (
          <g>
            <ellipse cx="78" cy="237" rx="22" ry="13" fill="url(#chocLimb)" />
            <ellipse cx="72" cy="233" rx="7" ry="3.5" fill="white" opacity="0.1" />
          </g>
        )}

        {/* RIGHT ARM */}
        {showArmRight && (
          <g>
            <ellipse
              cx="143" cy="180" rx="19" ry="11"
              fill="url(#chocLimb)"
              transform="rotate(28, 143, 180)"
            />
            <ellipse
              cx="138" cy="174" rx="6" ry="3.5"
              fill="white" opacity="0.1"
              transform="rotate(28, 138, 174)"
            />
          </g>
        )}

        {/* LEFT ARM */}
        {showArmLeft && (
          <g>
            <ellipse
              cx="57" cy="180" rx="19" ry="11"
              fill="url(#chocLimb)"
              transform="rotate(-28, 57, 180)"
            />
            <ellipse
              cx="52" cy="174" rx="6" ry="3.5"
              fill="white" opacity="0.1"
              transform="rotate(-28, 52, 174)"
            />
          </g>
        )}

        {/* HEAD */}
        {showHead && (
          <g filter="url(#softShadow)">
            <circle cx="100" cy="108" r="44" fill="url(#chocHead)" />
            <ellipse
              cx="119" cy="88" rx="13" ry="7"
              fill="white" opacity="0.13"
              transform="rotate(-35, 119, 88)"
            />

            {/* EYES */}
            {/* Left eye */}
            <circle cx="85" cy="104" r="9.5" fill="#1A0804" />
            <circle cx="85" cy="104" r="6.5" fill="#2A1208" />
            {sad ? (
              <>
                <path
                  d="M 80 100 Q 85 103 90 100"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            ) : concerned ? (
              <>
                <circle cx="83" cy="100" r="3.2" fill="white" />
                <path
                  d="M 78 105 Q 85 107 92 105"
                  stroke="#1A0804"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <circle cx="83" cy="100" r="3.2" fill="white" />
              </>
            )}

            {/* Right eye */}
            <circle cx="115" cy="104" r="9.5" fill="#1A0804" />
            <circle cx="115" cy="104" r="6.5" fill="#2A1208" />
            {sad ? (
              <>
                <path
                  d="M 110 100 Q 115 103 120 100"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            ) : concerned ? (
              <>
                <circle cx="113" cy="100" r="3.2" fill="white" />
                <path
                  d="M 108 105 Q 115 107 122 105"
                  stroke="#1A0804"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <circle cx="113" cy="100" r="3.2" fill="white" />
              </>
            )}

            {/* NOSE */}
            <ellipse cx="100" cy="117" rx="4.5" ry="3.5" fill="#C05870" />
            <ellipse cx="99" cy="116" rx="1.5" ry="1" fill="white" opacity="0.45" />

            {/* MOUTH */}
            {sad ? (
              <path
                d="M 94,128 Q 100,123 106,128"
                stroke="#8B3840"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M 94,123 Q 100,131 106,123"
                stroke="#8B3840"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* CHEEK BLUSHES */}
            <circle cx="75" cy="116" r="13" fill="#FF6080" opacity={sad ? '0.1' : '0.2'} />
            <circle cx="125" cy="116" r="13" fill="#FF6080" opacity={sad ? '0.1' : '0.2'} />

            {/* WHISKERS */}
            <line x1="70" y1="114" x2="90" y2="117" stroke="#3D1A08" strokeWidth="0.8" opacity="0.4" />
            <line x1="70" y1="119" x2="90" y2="119" stroke="#3D1A08" strokeWidth="0.8" opacity="0.4" />
            <line x1="110" y1="117" x2="130" y2="114" stroke="#3D1A08" strokeWidth="0.8" opacity="0.4" />
            <line x1="110" y1="119" x2="130" y2="119" stroke="#3D1A08" strokeWidth="0.8" opacity="0.4" />
          </g>
        )}

        {/* Bite mark at neck */}
        {bites === 7 && showHead && (
          <BiteMark x1="65" y1="148" x2="135" y2="148" />
        )}
      </svg>

      {/* Ghost after all eaten */}
      {bites >= 8 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            animation: ghostFading ? 'ghostFlyAway 0.8s ease-out forwards' : 'ghostFloat 2s ease-in-out infinite',
          }}
        >
          <svg
            viewBox="0 0 200 270"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: '100%',
              maxWidth: 280,
              display: 'block',
              margin: '0 auto',
            }}
          >
            {/* Ghost body */}
            <path
              d="M 60 100 Q 60 70 100 70 Q 140 70 140 100 L 140 180 Q 140 200 120 200 L 80 200 Q 60 200 60 180 Z"
              fill="rgba(220, 220, 220, 0.85)"
              stroke="#999"
              strokeWidth="1.5"
              filter="drop-shadow(0 2px 8px rgba(0,0,0,0.2))"
            />

            {/* Ghost eyes */}
            <circle cx="85" cy="110" r="6" fill="#666" />
            <circle cx="115" cy="110" r="6" fill="#666" />

            {/* Ghost mouth */}
            <path
              d="M 95 140 Q 100 145 105 140"
              stroke="#999"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
