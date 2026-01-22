import React, { useState } from 'react';

export const ItemIcon: React.FC<{ type: string; color?: string; className?: string; width?: number; height?: number }> = ({ type, color = 'currentColor', className = '', width = 1, height = 1 }) => {
  const [useFallback, setUseFallback] = useState(false);

  // Asset path for manual overrides
  const imagePath = `./assets/icons/${type}.png`;

  if (!useFallback) {
    return (
      <img 
        src={imagePath} 
        alt={type} 
        className={`${className} object-contain select-none pointer-events-none w-full h-full`}
        onError={() => setUseFallback(true)}
      />
    );
  }

  /**
   * Standardized Fallback SVGs
   * ViewBox is derived from template dimensions (width*32, height*32).
   * Attachment points (hooks/pegs) are centered at Y=16.
   */
  const vW = width * 32;
  const vH = height * 32;

  const renderIcon = () => {
    switch (type) {
      // --- HOOKS ---
      case 'hook':
        return (
          <g>
            <path d="M12 16H20" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <path d="M16 16V48C16 52 22 52 22 48" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );
      case 'hook-double':
        return (
          <g>
            <path d="M12 16H20M44 16H52" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <path d="M16 16V48C16 52 22 52 22 48" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M48 16V48C48 52 54 52 54 48" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );
      case 'hook-long':
        return (
          <g>
            <path d="M12 16H20" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <path d="M16 16V112C16 116 20 116 20 112" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );
      case 'loop':
        return (
          <g>
            <path d="M12 16H20M44 16H52" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <circle cx="32" cy="40" r="16" stroke={color} strokeWidth="3" fill="none" />
            <path d="M16 16V32M48 16V32" stroke={color} strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case 'pliers-holder':
        return (
          <g>
            <path d="M12 16H20M44 16H52" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <path d="M16 16V32M48 16V32" stroke={color} strokeWidth="3" />
            <path d="M8 32H20V52C20 58 44 58 44 52V32H56" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );
      case 'screwdriver-rack':
        return (
          <g>
            <path d="M12 16H20M172 16H180" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <rect x="8" y="24" width="176" height="12" rx="4" fill={color} />
            {[24, 56, 88, 120, 152, 184].map(x => <circle key={x} cx={x-12} cy="30" r="4" fill="black" fillOpacity="0.2" />)}
          </g>
        );
      case 'multi-rack':
        return (
          <g>
            <path d="M12 16H20M236 16H244" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <rect x="8" y="24" width="240" height="14" rx="4" fill={color} />
            <path d="M32 31H224" stroke="black" strokeOpacity="0.1" strokeWidth="4" />
          </g>
        );

      // --- BINS & SPECIALIZED ---
      case 'bin':
        return (
          <g>
            <path d="M12 16H20M108 16H116" stroke="black" strokeOpacity="0.2" strokeWidth="5" strokeLinecap="round" />
            <path d="M16 32V112C16 118 22 124 28 124H100C106 124 112 118 112 112V32H16Z" fill={color} />
            <rect x="8" y="24" width="112" height="12" rx="2" fill={color} stroke="rgba(0,0,0,0.1)" />
          </g>
        );
      case 'shelf':
        return (
          <g>
            <path d="M12 16H20M364 16H372" stroke={color} strokeWidth="6" strokeLinecap="round" />
            <rect x="8" y="28" width="368" height="10" rx="2" fill={color} />
            <path d="M8 38L192 64L376 38" stroke="black" strokeOpacity="0.1" strokeWidth="2" />
          </g>
        );
      case 'mag-strip':
        return (
          <g>
            <path d="M12 16H20M300 16H308" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <rect x="8" y="10" width="304" height="12" rx="2" fill="#1e293b" />
            <rect x="8" y="14" width="304" height="4" fill="#334155" />
          </g>
        );
      case 'paper-towel':
        return (
          <g>
            <path d="M12 16V32M372 16V32" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <rect x="48" y="32" width="288" height="80" rx="40" fill="white" stroke="#e2e8f0" strokeWidth="2" />
            <path d="M48 72H336" stroke="#f1f5f9" strokeWidth="20" strokeLinecap="round" />
          </g>
        );
      case 'cord-wrap':
        return (
          <g>
            <path d="M48 16V80" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
            <path d="M24 28H72M24 68H72" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          </g>
        );

      // --- TOOLS ---
      case 'hammer':
        return (
          <g>
            <path d="M48 16H80" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <path d="M30 36V20C30 14 36 10 42 10H86C92 10 98 14 98 20V28C98 34 92 38 86 38H76V52C76 58 70 64 64 64H40C34 64 28 58 28 52V36H32Z" fill="#334155" />
            <rect x="56" y="64" width="16" height="280" rx="8" fill="#78350f" />
            <rect x="56" y="300" width="16" height="60" rx="8" fill="#1e293b" />
          </g>
        );
      case 'mallet':
        return (
          <g>
            <path d="M48 16H80" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
            <rect x="24" y="28" width="80" height="50" rx="4" fill="#1e293b" />
            <rect x="56" y="78" width="16" height="220" rx="4" fill="#78350f" />
          </g>
        );
      case 'screwdriver':
        return (
          <g>
            <path d="M12 16H20" stroke="white" strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" />
            <rect x="8" y="12" width="16" height="40" rx="4" fill={color || "#ef4444"} />
            <rect x="14" y="52" width="4" height="60" fill="#94a3b8" />
          </g>
        );
      case 'wrench':
        return (
          <g>
            <path d="M16 16H48" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            <circle cx="32" cy="32" r="16" fill="#94a3b8" />
            <circle cx="32" cy="32" r="9" fill="white" />
            <rect x="24" y="44" width="16" height="140" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="32" cy="200" r="14" fill="#94a3b8" />
          </g>
        );
      case 'adj-wrench':
        return (
          <g>
            <path d="M16 16H48" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            <path d="M16 32L32 12L48 32H16Z" fill="#94a3b8" />
            <rect x="24" y="32" width="16" height="180" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="32" cy="212" r="10" fill="#94a3b8" />
          </g>
        );
      case 'drill':
        return (
          <g>
            <path d="M80 16H112" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <rect x="64" y="32" width="100" height="50" rx="8" fill="#1e293b" />
            <rect x="80" y="82" width="40" height="120" rx="4" fill="#1e293b" />
            <rect x="70" y="202" width="60" height="30" rx="4" fill="#334155" />
          </g>
        );
      case 'saw':
        return (
          <g>
            <path d="M140 16H152M400 16H412" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <path d="M40 32H480L440 120H40V32Z" fill="#cbd5e1" />
            <path d="M40 120L60 140L80 120L100 140L120 120L140 140L160 120L180 140L200 120L220 140L240 120L260 140L280 120L300 140L320 120L340 140L360 120L380 140L400 120L420 140L440 120" stroke="#94a3b8" strokeWidth="2" fill="none" />
            <rect x="10" y="24" width="70" height="110" rx="10" fill="#78350f" />
          </g>
        );
      case 'pliers':
        return (
          <g>
            <path d="M48 16H52" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
            <path d="M32 48L48 64L64 48" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
            <circle cx="48" cy="64" r="6" fill="#1e293b" />
            <path d="M40 64C40 64 24 100 24 160" stroke="#2563eb" strokeWidth="14" strokeLinecap="round" />
            <path d="M56 64C56 64 72 100 72 160" stroke="#2563eb" strokeWidth="14" strokeLinecap="round" />
          </g>
        );
      case 'wire-cutters':
        return (
          <g>
            <path d="M48 16H52" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
            <path d="M40 40L48 64L56 40" stroke="#94a3b8" strokeWidth="14" strokeLinecap="round" />
            <circle cx="48" cy="64" r="6" fill="#1e293b" />
            <path d="M40 64L24 160M56 64L72 160" stroke="#dc2626" strokeWidth="14" strokeLinecap="round" />
          </g>
        );
      case 'tape-measure':
        return (
          <g>
            <path d="M40 16H56" stroke="black" strokeOpacity="0.2" strokeWidth="6" strokeLinecap="round" />
            <rect x="16" y="24" width="64" height="64" rx="12" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="48" cy="56" r="20" fill="white" fillOpacity="0.1" />
            <path d="M70 70L86 70" stroke="#94a3b8" strokeWidth="4" />
          </g>
        );
      case 'utility-knife':
        return (
          <g>
            <path d="M12 16H20" stroke="black" strokeOpacity="0.2" strokeWidth="6" strokeLinecap="round" />
            <rect x="8" y="20" width="16" height="120" rx="4" fill="#ef4444" />
            <path d="M14 140L14 156L20 140" fill="#cbd5e1" />
          </g>
        );
      case 'square':
        return (
          <g>
            <path d="M12 16H20M364 16H372" stroke="black" strokeOpacity="0.2" strokeWidth="6" strokeLinecap="round" />
            <path d="M8 20V240H376V208H40V20H8Z" fill="#94a3b8" />
            <path d="M16 30V232M368 216H24" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
          </g>
        );
      case 'level':
        return (
          <g>
            <path d="M12 16H20M236 16H244" stroke="white" strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" />
            <rect x="8" y="20" width="240" height="24" rx="4" fill={color || "#facc15"} />
            <rect x="110" y="24" width="36" height="16" rx="8" fill="white" fillOpacity="0.3" />
            <circle cx="128" cy="32" r="4" fill="#10b981" />
          </g>
        );

      // --- PROPS ---
      case 'prop-katana':
        return (
          <g>
            <path d="M16 16H48" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
            <rect x="22" y="646" width="20" height="130" rx="4" fill="#1e293b" />
            <ellipse cx="32" cy="636" rx="16" ry="8" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
            <path d="M32 631 C32 631 48 316 42 56 L38 58 C38 58 43 316 32 631 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
          </g>
        );
      case 'prop-pistol':
        return (
          <g>
            <path d="M80 16H112" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
            <rect x="110" y="56" width="20" height="70" rx="4" fill="#1e293b" transform="rotate(-15 110 56)"/>
            <rect x="40" y="46" width="110" height="25" rx="2" fill="#334155" />
            <rect x="40" y="61" width="30" height="15" fill="#1e293b" />
          </g>
        );
      case 'prop-rifle':
        return (
          <g>
            <path d="M140 16H152M440 16H452" stroke="white" opacity="0.2" strokeWidth="8" strokeLinecap="round" />
            <rect x="40" y="40" width="500" height="40" rx="4" fill="#1e293b" />
            <rect x="100" y="80" width="30" height="80" rx="4" fill="#334155" />
            <rect x="450" y="40" width="100" height="70" rx="10" fill="#334155" />
          </g>
        );
      case 'prop-shotgun':
        return (
          <g>
            <path d="M140 16H152M500 16H512" stroke="white" opacity="0.2" strokeWidth="8" strokeLinecap="round" />
            <rect x="40" y="40" width="560" height="30" rx="4" fill="#1e293b" />
            <rect x="40" y="45" width="120" height="45" rx="10" fill="#78350f" />
            <rect x="240" y="65" width="140" height="25" rx="4" fill="#334155" />
          </g>
        );
      case 'prop-dagger':
        return (
          <g>
            <path d="M24 16H40" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <path d="M32 32L48 120L32 220L16 120L32 32Z" fill="#94a3b8" />
            <rect x="10" y="210" width="44" height="10" rx="2" fill="#1e293b" />
            <rect x="24" y="220" width="16" height="30" rx="4" fill="#334155" />
          </g>
        );
      case 'prop-bowie':
        return (
          <g>
            <path d="M32 16H64" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <path d="M30 40C30 40 70 120 70 240L30 240V40Z" fill="#cbd5e1" />
            <rect x="20" y="240" width="60" height="12" rx="2" fill="#1e293b" />
            <rect x="35" y="252" width="30" height="60" rx="6" fill="#78350f" />
          </g>
        );
      case 'prop-needler':
        return (
          <g>
            <path d="M80 16H112M288 16H320" stroke="white" strokeOpacity="0.3" strokeWidth="8" strokeLinecap="round" />
            <defs>
              <linearGradient id="needlerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#6d28d9', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#1e1b4b', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <path d="M50 176 C50 76 140 56 260 56 C340 56 370 136 370 196 C370 256 300 316 180 316 C80 316 50 256 50 176 Z" fill="url(#needlerGradient)" stroke="#1e1b4b" strokeWidth="2" />
            <g>
              <path d="M110 86 L125 26 L140 86 Z" fill="#ec4899" opacity="0.9" />
              <path d="M160 76 L175 16 L190 76 Z" fill="#ec4899" opacity="0.9" />
              <path d="M210 71 L225 21 L240 71 Z" fill="#ec4899" opacity="0.9" />
            </g>
          </g>
        );

      default:
        return (
          <g>
            <circle cx={vW/2} cy={vH/2} r={Math.min(vW, vH)/3} stroke={color} strokeWidth="2" fill="none" />
            <path d={`M${vW/2 - 4} 16H${vW/2 + 4}`} stroke={color} strokeWidth="4" />
          </g>
        );
    }
  };

  return (
    <svg 
      viewBox={`0 0 ${vW} ${vH}`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {renderIcon()}
    </svg>
  );
};