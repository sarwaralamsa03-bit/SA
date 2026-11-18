import React from 'react';
import {Img} from 'remotion';
import {Cam, ANCHOR_Y, PERSPECTIVE, TILE_URL} from './config';
import {worldPx} from './math';
import {makeProjector} from './projector';

// ম্যাপ-সমতল: ক্যামেরার rotateX (pitch) ও rotateZ (bearing) এখানে; ভেতরের সবকিছু সমতলের অংশ
export const Plane: React.FC<{cam: Cam; w: number; h: number; ay?: number; children: React.ReactNode}> = ({cam, w, h, ay = ANCHOR_Y, children}) => (
  <div style={{position: 'absolute', left: w / 2, top: h * ay, width: 0, height: 0,
    transform: `perspective(${PERSPECTIVE}px) rotateX(${cam.p}deg) rotateZ(${-cam.b}deg)`}}>
    {children}
  </div>
);

export const TileLayer: React.FC<{cam: Cam; w: number; h: number; ay?: number; filter?: string}> = ({cam, w, h, ay = ANCHOR_Y, filter}) => {
  const P = makeProjector(cam, w, h, ay);
  const tz = Math.max(2, Math.min(18, Math.round(cam.z)));
  const ts = 256 * Math.pow(2, cam.z - tz);
  const n = Math.pow(2, tz);
  const [cx, cy] = worldPx(cam.lat, cam.lng, cam.z);
  const R = Math.ceil(3200 / ts);
  const tx0 = Math.floor(cx / ts), ty0 = Math.floor(cy / ts);
  const tiles: React.ReactNode[] = [];
  const m = 60;
  for (let dy = -R; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++) {
      const x = tx0 + dx, y = ty0 + dy;
      if (y < 0 || y >= n) continue;
      const px = x * ts - cx, py = y * ts - cy;
      const pts = [P.planeToScreen(px, py), P.planeToScreen(px + ts, py), P.planeToScreen(px, py + ts), P.planeToScreen(px + ts, py + ts)];
      const minX = Math.min(...pts.map((q) => q[0])), maxX = Math.max(...pts.map((q) => q[0]));
      const minY = Math.min(...pts.map((q) => q[1])), maxY = Math.max(...pts.map((q) => q[1]));
      if (maxX < -m || minX > w + m || maxY < -m || minY > h + m) continue;
      const wx = ((x % n) + n) % n;
      tiles.push(<Img key={`${tz}/${x}/${y}`} src={TILE_URL(tz, wx, y)} style={{position: 'absolute', left: px, top: py, width: ts + 1, height: ts + 1}} />);
    }
  }
  return <div style={{position: 'absolute', left: 0, top: 0, filter}}>{tiles}</div>;
};
