
import React from 'react';

export const ItemIcon: React.FC<{ type: string; color?: string; className?: string }> = ({ type, color = 'currentColor', className = '' }) => {
  switch (type) {
    case 'hammer':
      return (
        <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M2 12V4C2 2.8 2.8 2 4 2H20C21.2 2 22 2.8 22 4V8C22 9.1 21.2 10 20 10H18V14C18 15.1 17.1 16 16 16H8C6.9 16 6 15.1 6 14V10H4C2.8 10 2 9.1 2 8V12Z" fill="#334155" />
          <path d="M2 4C2 4 -2 6 -2 10" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <rect x="10" y="16" width="4" height="40" rx="2" fill="#78350f" />
          <rect x="10" y="44" width="4" height="12" rx="2" fill="#1e293b" />
        </svg>
      );
    case 'mallet':
      return (
        <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="2" y="2" width="20" height="14" rx="2" fill="#1e293b" />
          <rect x="2" y="6" width="20" height="6" fill="#334155" />
          <rect x="10" y="16" width="4" height="36" rx="2" fill="#78350f" />
          <rect x="10" y="44" width="4" height="8" rx="2" fill="#1e293b" />
        </svg>
      );
    case 'screwdriver':
      return (
        <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="7" y="0" width="10" height="22" rx="3" fill={color || "#ef4444"} />
          <rect x="10" y="4" width="4" height="14" rx="1" fill="#000" fillOpacity="0.2" />
          <rect x="11" y="22" width="2" height="24" fill="#94a3b8" />
          <path d="M10 46H14L13 48H11L10 46Z" fill="#64748b" />
        </svg>
      );
    case 'wrench':
      return (
        <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M4 12C4 7.5 7.5 4 12 4C16.5 4 20 7.5 20 12L18 14L16 12C16 9.8 14.2 8 12 8C9.8 8 8 9.8 8 12L6 14L4 12Z" fill="#94a3b8" />
          <rect x="9.5" y="14" width="5" height="40" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1"/>
          <circle cx="12" cy="54" r="7" fill="#94a3b8" />
          <circle cx="12" cy="54" r="4" fill="#64748b" />
        </svg>
      );
    case 'adj-wrench':
      return (
        <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M4 12C4 7 8 4 12 4C16 4 20 7 20 12L16 16H8L4 12Z" fill="#94a3b8" />
          <rect x="8" y="10" width="8" height="2" fill="#64748b" />
          <rect x="9.5" y="16" width="5" height="40" rx="1" fill="#cbd5e1" stroke="#94a3b8" />
          <circle cx="12" cy="56" r="4" fill="#94a3b8" />
        </svg>
      );
    case 'drill':
      return (
        <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="12" y="10" width="24" height="12" rx="4" fill="#1e293b" />
          <rect x="16" y="22" width="10" height="24" rx="2" fill="#1e293b" />
          <rect x="36" y="13" width="6" height="6" fill="#475569" />
          <rect x="42" y="15" width="6" height="2" fill="#cbd5e1" />
          <rect x="14" y="46" width="14" height="8" rx="2" fill="#334155" />
          <rect x="12" y="12" width="8" height="4" rx="1" fill={color || "#facc15"} />
        </svg>
      );
    case 'saw':
      return (
        <svg viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M24 10H120L110 34H24V10Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
          <path d="M24 34L28 38L32 34L36 38L40 34L44 38L48 34L52 38L56 34L60 38L64 34L68 38L72 34L76 38L80 34L84 38L88 34L92 38L96 34L100 38L104 34L108 38L112 34" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M4 18C4 10 10 6 18 6H24V38H18C10 38 4 34 4 26V18Z" fill="#78350f" />
          <rect x="10" y="14" width="8" height="16" rx="4" fill="white" fillOpacity="0.2" />
        </svg>
      );
    case 'pliers':
      return (
        <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M8 8L12 20L16 8" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          <circle cx="12" cy="22" r="3" fill="#1e293b" />
          <path d="M10 24C10 24 4 34 4 54" stroke={color || "#3b82f6"} strokeWidth="5" strokeLinecap="round" />
          <path d="M14 24C14 24 20 34 20 54" stroke={color || "#3b82f6"} strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
    case 'wire-cutters':
      return (
        <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M7 6L12 20L17 6" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
          <circle cx="12" cy="20" r="3.5" fill="#1e293b" />
          <path d="M9 22C9 22 4 32 4 54" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
          <path d="M15 22C15 22 20 32 20 54" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
    case 'level':
      return (
        <svg viewBox="0 0 128 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="4" width="120" height="16" rx="2" fill={color || "#facc15"} stroke="#ca8a04" />
          <rect x="60" y="8" width="8" height="8" rx="1" fill="white" fillOpacity="0.5" />
          <circle cx="64" cy="12" r="1.5" fill="#10b981" />
          <rect x="20" y="8" width="4" height="8" rx="1" fill="white" fillOpacity="0.3" />
          <rect x="104" y="8" width="4" height="8" rx="1" fill="white" fillOpacity="0.3" />
        </svg>
      );
    case 'tape-measure':
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="4" width="24" height="24" rx="4" fill={color || "#facc15"} stroke="#ca8a04" strokeWidth="1"/>
          <circle cx="16" cy="16" r="8" fill="white" fillOpacity="0.1" />
          <rect x="24" y="24" width="6" height="4" fill="#475569" />
          <rect x="10" y="10" width="12" height="6" rx="1" fill="black" fillOpacity="0.1" />
        </svg>
      );
    case 'utility-knife':
      return (
        <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="10" y="4" width="4" height="36" fill={color || "#ef4444"} rx="1"/>
          <rect x="11" y="8" width="2" height="6" fill="black" fillOpacity="0.2" />
          <path d="M11.5 0L12.5 0L12.5 4L11.5 4V0Z" fill="#94a3b8" />
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 128 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M4 4V60H120V52H12V4H4Z" fill="#94a3b8" stroke="#64748b" strokeWidth="0.5" />
          <rect x="8" y="10" width="1" height="4" fill="#475569" />
          <rect x="8" y="20" width="1" height="4" fill="#475569" />
          <rect x="8" y="30" width="1" height="4" fill="#475569" />
          <rect x="20" y="52" width="4" height="1" fill="#475569" />
          <rect x="40" y="52" width="4" height="1" fill="#475569" />
          <rect x="60" y="52" width="4" height="1" fill="#475569" />
        </svg>
      );
    case 'hook':
      return (
        <svg viewBox="0 0 24 48" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 16V36C12 40 16 40 16 36" />
          <path d="M10 16H14" strokeWidth="4" />
        </svg>
      );
    case 'hook-double':
      return (
        <svg viewBox="0 0 32 48" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M8 16V30C8 34 12 34 12 30" />
          <path d="M24 16V30C24 34 20 34 20 30" />
          <path d="M6 16H10M22 16H26" strokeWidth="4" />
        </svg>
      );
    case 'hook-long':
      return (
        <svg viewBox="0 0 24 64" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 16V56C12 60 16 60 16 56" />
          <path d="M10 16H14" strokeWidth="4" />
        </svg>
      );
    case 'loop':
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="16" cy="16" r="10" />
          <path d="M12 16L12 12M20 16L20 12" />
        </svg>
      );
    case 'pliers-holder':
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 16H10V24C10 28 22 28 22 24V16H28" />
          <path d="M2 16H6M26 16H30" strokeWidth="4" />
        </svg>
      );
    case 'screwdriver-rack':
      return (
        <svg viewBox="0 0 96 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="12" width="88" height="8" rx="2" fill={color} />
          <circle cx="16" cy="16" r="3" fill="black" fillOpacity="0.3" />
          <circle cx="32" cy="16" r="3" fill="black" fillOpacity="0.3" />
          <circle cx="48" cy="16" r="3" fill="black" fillOpacity="0.3" />
          <circle cx="64" cy="16" r="3" fill="black" fillOpacity="0.3" />
          <circle cx="80" cy="16" r="3" fill="black" fillOpacity="0.3" />
          <path d="M8 12V8M88 12V8" stroke={color} strokeWidth="3" />
        </svg>
      );
    case 'multi-rack':
      return (
        <svg viewBox="0 0 128 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="12" width="120" height="10" rx="2" fill={color} />
          <rect x="15" y="15" width="10" height="4" rx="1" fill="black" fillOpacity="0.2" />
          <rect x="35" y="15" width="10" height="4" rx="1" fill="black" fillOpacity="0.2" />
          <rect x="55" y="15" width="10" height="4" rx="1" fill="black" fillOpacity="0.2" />
          <rect x="75" y="15" width="10" height="4" rx="1" fill="black" fillOpacity="0.2" />
          <rect x="95" y="15" width="10" height="4" rx="1" fill="black" fillOpacity="0.2" />
          <path d="M10 12V8M118 12V8" stroke={color} strokeWidth="3" />
        </svg>
      );
    case 'bin':
      return (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M4 16V40C4 42.2 5.8 44 8 44H40C42.2 44 44 42.2 44 40V16H4Z" fill={color} stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
          <path d="M2 14H46V20H2V14Z" fill={color} />
        </svg>
      );
    case 'shelf':
      return (
        <svg viewBox="0 0 128 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="16" width="120" height="4" rx="1" fill={color} />
          <rect x="4" y="20" width="120" height="2" rx="1" fill="black" fillOpacity="0.1" />
          <path d="M10 10V16M118 10V16" stroke={color} strokeWidth="3" />
        </svg>
      );
    case 'mag-strip':
      return (
        <svg viewBox="0 0 160 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="4" width="152" height="8" rx="1" fill="#1e293b" />
          <rect x="4" y="6" width="152" height="4" fill="#334155" />
          <circle cx="10" cy="8" r="1.5" fill="#94a3b8" />
          <circle cx="150" cy="8" r="1.5" fill="#94a3b8" />
        </svg>
      );
    case 'paper-towel':
      return (
        <svg viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="10" y="10" width="108" height="28" rx="14" fill="white" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="10" y="10" width="10" height="28" rx="5" fill="#f1f5f9" />
          <path d="M12 10V6M116 10V6" stroke="#94a3b8" strokeWidth="3" />
        </svg>
      );
    case 'cord-wrap':
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" className={className}>
          <path d="M16 8V24" />
          <path d="M8 8H24M8 24H24" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};
