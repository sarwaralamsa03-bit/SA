import React from 'react';
import {spring} from 'remotion';
import {FONT, FPS} from './config';
import {clamp, easeInOutCubic, prog} from './math';

export const sp = (t: number, start: number, damping = 14, mass = 0.7) =>
  t < start ? 0 : spring({frame: (t - start) * FPS, fps: FPS, config: {damping, stiffness: 140, mass}});

const seg = (s: string): string[] => {
  const Seg = (Intl as any).Segmenter;
  return Seg ? Array.from(new Seg('bn', {granularity: 'grapheme'}).segment(s), (x: any) => x.segment as string) : Array.from(s);
};
const DIRS: [number, number][] = [[0, -1], [0, 1], [-1, 0], [1, 0], [0.7, -0.7], [-0.7, 0.7]];

type Props = {t: number; start: number; end: number; text: string; mode?: 'char' | 'word'; size: number; color: string; weight?: number; glow?: string};

export const AnimatedText: React.FC<Props> = ({t, start, end, text, mode = 'char', size, color, weight = 900, glow = 'rgba(0,0,0,0.85)'}) => {
  if (t < start || t > end + 0.05) return null;
  const units = mode === 'char' ? seg(text) : text.split(' ');
  const stg = mode === 'char' ? 0.045 : 0.1;
  return (
    <div style={{display: 'inline-flex', whiteSpace: 'pre', fontFamily: FONT, fontSize: size, fontWeight: weight, color, lineHeight: 1.5,
      textShadow: `0 0 28px ${glow}, 0 4px 14px ${glow}`}}>
      {units.map((u, i) => {
        const p = sp(t, start + i * stg, mode === 'char' ? 13 : 16);
        const q = easeInOutCubic(prog(t, end - 0.3 + i * 0.02, end - 0.02 + i * 0.02));
        const vis = clamp(p) * (1 - q);
        const [dx, dy] = DIRS[i % DIRS.length];
        const mv = mode === 'char' ? size * 0.7 : size * 0.5;
        const tx = mode === 'char' ? dx * mv * (1 - p) + dx * -mv * q * 0.5 : 0;
        const ty = mode === 'char' ? dy * mv * (1 - p) + dy * -mv * q * 0.5 : mv * (1 - p) - mv * q * 0.6;
        const rot = mode === 'char' ? (i % 2 ? 10 : -10) * (1 - p) : 0;
        return (
          <span key={i} style={{display: 'inline-block', opacity: vis, filter: `blur(${(1 - clamp(p)) * 8}px)`,
            transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${0.6 + 0.4 * p})`}}>
            {u}{mode === 'word' && i < units.length - 1 ? '\u00A0' : ''}
          </span>
        );
      })}
    </div>
  );
};
