import {KFS, Cam} from './config';
import {easeInOutCubic, lerp, prog} from './math';

export const getCamera = (t: number): Cam => {
  let i = 0;
  while (i < KFS.length - 2 && t >= KFS[i + 1].t) i++;
  const a = KFS[i], b = KFS[i + 1];
  const e = easeInOutCubic(prog(t, a.t, b.t));
  const dip = (b.dip ?? 0) * Math.sin(Math.PI * e);
  // হোল্ডেও ধীর ড্রিফট (~৩% জুম)
  const drift = 0.04 * Math.sin(t * 0.55);
  return {
    lat: lerp(a.lat, b.lat, e) + 0.0006 * Math.sin(t * 0.4) / Math.pow(2, 0),
    lng: lerp(a.lng, b.lng, e) + 0.002 * Math.cos(t * 0.35),
    z: lerp(a.z, b.z, e) - dip + drift,
    b: lerp(a.b, b.b, e),
    p: lerp(a.p, b.p, e),
  };
};
