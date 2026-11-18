export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOutBack = (x: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
export const worldPx = (lat: number, lng: number, z: number): [number, number] => {
  const s = 256 * Math.pow(2, z);
  const sin = Math.sin((lat * Math.PI) / 180);
  return [((lng + 180) / 360) * s, (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * s];
};
const BN = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const bn = (n: number, group = true) => {
  const s = String(Math.round(n));
  const g = group ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
  return g.replace(/\d/g, (d) => BN[+d]);
};
