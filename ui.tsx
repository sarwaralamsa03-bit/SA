import React from 'react';
import {C, FONT} from './config';
import {easeInOutCubic, prog} from './math';
import {sp} from './AnimatedText';

type IconP = {size?: number; color?: string};
export const PeopleIcon: React.FC<IconP> = ({size = 120, color = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill={color}>
    <circle cx="32" cy="20" r="9" /><path d="M14 52c0-11 8-18 18-18s18 7 18 18z" />
    <circle cx="13" cy="26" r="6" opacity=".6" /><circle cx="51" cy="26" r="6" opacity=".6" />
  </svg>
);
export const AreaIcon: React.FC<IconP> = ({size = 120, color = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="14" y="14" width="36" height="36" rx="3" strokeDasharray="6 6" />
    <path d="M6 58L22 42M58 6L42 22M6 58h12M6 58v-12M58 6H46M58 6v12" />
  </svg>
);
export const CoastIcon: React.FC<IconP> = ({size = 120, color = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
    <path d="M4 24q7-8 14 0t14 0 14 0 14 0" /><path d="M4 38q7-8 14 0t14 0 14 0 14 0" /><path d="M4 52q7-8 14 0t14 0 14 0 14 0" />
  </svg>
);
export const CrownIcon: React.FC<IconP> = ({size = 90, color = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill={color}>
    <path d="M8 50L4 18l16 14L32 10l12 22 16-14-4 32z" /><rect x="8" y="52" width="48" height="7" rx="3" />
  </svg>
);
export const PinIcon: React.FC<IconP> = ({size = 110, color = C.main}) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 50 70">
    <path d="M25 68C25 68 4 40 4 25a21 21 0 0142 0c0 15-21 43-21 43z" fill={color} stroke="#fff" strokeWidth="3" />
    <circle cx="25" cy="25" r="8" fill="#07121F" />
  </svg>
);

// সোজা কার্ড (ম্যাপের সঙ্গে কাত হয় না)
export const InfoCard: React.FC<{t: number; inT: number; outT: number; icon: React.ReactNode; label: string; value: string; unit: string; y?: number}> = ({t, inT, outT, icon, label, value, unit, y = 300}) => {
  if (t < inT || t > outT + 0.3) return null;
  const p = sp(t, inT);
  const q = easeInOutCubic(prog(t, outT, outT + 0.28));
  return (
    <div style={{position: 'absolute', left: 90, top: y - 120, width: 900, height: 240, borderRadius: 40, display: 'flex', alignItems: 'center', gap: 36, padding: '0 48px',
      background: 'rgba(7,18,31,0.82)', border: `4px solid ${C.gold}`, boxShadow: '0 20px 60px rgba(0,0,0,0.55)', fontFamily: FONT, color: C.text,
      opacity: Math.min(1, p) * (1 - q), transform: `translateY(${-90 * (1 - p) - 90 * q}px) scale(${0.85 + 0.15 * p})`}}>
      {icon}
      <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.25}}>
        <span style={{fontSize: 42, fontWeight: 700, opacity: 0.9}}>{label}</span>
        <span style={{fontSize: 118, fontWeight: 900, color: C.gold}}>{value}</span>
        <span style={{fontSize: 44, fontWeight: 700}}>{unit}</span>
      </div>
    </div>
  );
};
