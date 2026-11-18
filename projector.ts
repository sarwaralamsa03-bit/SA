import {Cam, PERSPECTIVE} from './config';
import {worldPx} from './math';

export type Projector = ReturnType<typeof makeProjector>;
// সব ওভারলে একই প্রজেক্টর: lat/lng -> plane px (ম্যাপ-সমতল) -> screen px
export const makeProjector = (cam: Cam, w: number, h: number, ay = 0.5, d = PERSPECTIVE) => {
  const [cx, cy] = worldPx(cam.lat, cam.lng, cam.z);
  const ox = w / 2, oy = h * ay;
  const th = (-cam.b * Math.PI) / 180, ph = (cam.p * Math.PI) / 180;
  const toPlane = (lat: number, lng: number): [number, number] => {
    const [x, y] = worldPx(lat, lng, cam.z);
    return [x - cx, y - cy];
  };
  const planeToScreen = (x: number, y: number): [number, number, number] => {
    const x1 = x * Math.cos(th) - y * Math.sin(th);
    const y1 = x * Math.sin(th) + y * Math.cos(th);
    const y2 = y1 * Math.cos(ph);
    const z2 = y1 * Math.sin(ph);
    const s = d / Math.max(80, d - z2);
    return [ox + x1 * s, oy + y2 * s, s];
  };
  const toScreen = (lat: number, lng: number) => {
    const [x, y] = toPlane(lat, lng);
    return planeToScreen(x, y);
  };
  const pxPerDegLng = (256 * Math.pow(2, cam.z)) / 360;
  return {cam, w, h, ay, ox, oy, d, toPlane, planeToScreen, toScreen, pxPerDegLng};
};
