import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolateColors} from 'remotion';
import {AnimatedText, sp} from './AnimatedText';
import {getCamera} from './camera';
import {AREA, C, COAST_KM, FONT, FPS, GEO, HEIGHT, POP_LAKH, S, SFX, TEXT, TOTAL_S, WIDTH, ANCHOR_Y} from './config';
import {clamp, easeInOutCubic, easeOutBack, lerp, prog, bn, worldPx} from './math';
import {Projector, makeProjector} from './projector';
import {Plane, TileLayer} from './TileLayer';
import {AreaIcon, CoastIcon, CrownIcon, InfoCard, PeopleIcon, PinIcon} from './ui';
import italy from '../public/data/italy.json';
import sicily from '../public/data/sicily.json';

type Ring = number[][];
const ringD = (ring: Ring, P: Projector, close = true) =>
  ring.map(([lng, lat], i) => { const [x, y] = P.toPlane(lat, lng); return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join('') + (close ? 'Z' : '');

// সিসিলির মূল দ্বীপের উপকূল: কেপ পেলোরো থেকে শুরু, এবং অংশ-অনুপাত অনুযায়ী দৈর্ঘ্য
const coast: Ring = (() => {
  const r = (sicily as Ring[])[0].slice(0, -1);
  let bi = 0, bd = 1e9;
  r.forEach(([lng, lat], i) => { const d = (lng - GEO.coastStart.lng) ** 2 + (lat - GEO.coastStart.lat) ** 2; if (d < bd) { bd = d; bi = i; } });
  const o = [...r.slice(bi), ...r.slice(0, bi)];
  return [...o, o[0]];
})();
const coastCum: number[] = (() => {
  const u = coast.map(([lng, lat]) => worldPx(lat, lng, 0));
  const c = [0];
  for (let i = 1; i < u.length; i++) c.push(c[i - 1] + Math.hypot(u[i][0] - u[i - 1][0], u[i][1] - u[i - 1][1]));
  return c.map((x) => x / c[c.length - 1]);
})();
const coastAt = (f: number): [number, number] => {
  let i = 1;
  while (i < coastCum.length - 1 && coastCum[i] < f) i++;
  const k = (f - coastCum[i - 1]) / Math.max(1e-9, coastCum[i] - coastCum[i - 1]);
  return [lerp(coast[i - 1][1], coast[i][1], k), lerp(coast[i - 1][0], coast[i][0], k)];
};

const GroundText: React.FC<{P: Projector; lat: number; lng: number; zRef: number; rot?: number; children: React.ReactNode}> = ({P, lat, lng, zRef, rot = 0, children}) => {
  const [x, y] = P.toPlane(lat, lng);
  return <div style={{position: 'absolute', left: x, top: y, whiteSpace: 'nowrap', transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${Math.pow(2, P.cam.z - zRef)})`}}>{children}</div>;
};

const fade = (t: number, a: number, b: number, outA: number, outB: number) => clamp(prog(t, a, b)) * (1 - clamp(prog(t, outA, outB)));

export const SicilyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = getCamera(t);
  const P = makeProjector(cam, WIDTH, HEIGHT, ANCHOR_Y);
  const pal = GEO.palermo;
  const [px, py] = P.toScreen(pal.lat, pal.lng);
  const [palX, palY] = P.toPlane(pal.lat, pal.lng);
  const sicTeal = prog(t, S.sicilyColor[0], S.sicilyColor[1]);
  const sicLine = interpolateColors(sicTeal, [0, 1], [C.italyLine, C.main]);
  const italyDraw = easeInOutCubic(prog(t, S.italyIn, S.italyIn + 1.0));
  const islandPulse = 5 + 4 * Math.sin(t * 5);
  const [scx, scy] = P.toPlane(GEO.sicily.lat, GEO.sicily.lng);

  // কাউন্টার
  const areaVal = AREA * easeInOutCubic(prog(t, S.areaIn + 0.2, S.areaCountEnd));
  const popVal = POP_LAKH * easeInOutCubic(prog(t, S.popIn + 0.2, S.popCountEnd));
  const coastP = prog(t, S.coastDrawA, S.coastDrawB);
  const coastVal = COAST_KM * coastP;
  const [hLat, hLng] = coastAt(coastP);
  const [hx, hy] = P.toPlane(hLat, hLng);

  // সাউথ-অ্যারো (দক্ষিণে)
  const [ax0, ay0] = P.toPlane(GEO.rome.lat, GEO.rome.lng);
  const [ax1, ay1] = P.toPlane(38.4, 14.0);
  const arrP = easeInOutCubic(prog(t, S.arrowIn, S.arrowIn + 0.8));
  const arrA = fade(t, S.arrowIn, S.arrowIn + 0.2, S.arrowOut - 0.3, S.arrowOut);
  const ang = (Math.atan2(ay1 - ay0, ax1 - ax0) * 180) / Math.PI;

  // গোল্ড রিং
  const ringP = sp(t, S.ringIn);
  const ringA = fade(t, S.ringIn, S.ringIn + 0.2, S.bigOut - 0.3, S.bigOut);
  const ringR = 2.3 * P.pxPerDegLng * ringP;

  // পিন, রাডার
  const pinP = t < S.pinIn ? 0 : easeOutBack(prog(t, S.pinIn, S.pinIn + 0.45));
  const endFade = 1 - clamp(prog(t, S.end - 0.3, S.end - 0.02));
  const cardCx = WIDTH / 2, cardCy = 1450, cardW = 800, cardH = 430;
  const callP = sp(t, S.calloutIn);
  const callQ = easeInOutCubic(prog(t, S.end - 0.3, S.end - 0.02));
  const lineP = easeInOutCubic(prog(t, S.calloutIn, S.calloutIn + 0.45));

  const miniCam = {lat: pal.lat, lng: pal.lng, z: 14.3, b: 0, p: 0};
  const sfx = (arr: number[], len: number, src: string, vol: number) =>
    arr.map((s, i) => (
      <Sequence key={src + i} from={Math.round(s * FPS)} durationInFrames={Math.round(len * FPS)}>
        <Audio src={staticFile(src)} volume={vol} endAt={Math.round(len * FPS)} />
      </Sequence>
    ));

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Plane cam={cam} w={WIDTH} h={HEIGHT}>
        <TileLayer cam={cam} w={WIDTH} h={HEIGHT} filter="brightness(0.86) contrast(1.08) saturate(1.05)" />
        <svg width={1} height={1} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {/* ইতালি (মূল ভূখণ্ড + সার্ডিনিয়া) */}
          {(italy as Ring[]).map((r, i) => (
            <g key={'it' + i}>
              <path d={ringD(r, P)} fill={C.neutral} fillOpacity={0.3 * italyDraw} />
              <path d={ringD(r, P)} fill="none" stroke={C.italyLine} strokeWidth={5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - italyDraw} strokeLinejoin="round" />
            </g>
          ))}
          {/* সিসিলি: নীল থেকে টিল */}
          {(sicily as Ring[]).map((r, i) => (
            <g key={'si' + i}>
              <path d={ringD(r, P)} fill={C.neutral} fillOpacity={0.3 * italyDraw * (1 - sicTeal)} />
              <path d={ringD(r, P)} fill={C.main} fillOpacity={0.32 * sicTeal} />
              <path d={ringD(r, P)} fill="none" stroke={sicLine} strokeWidth={t > S.sicilyIn - 1.4 && t < S.sicilyOut ? islandPulse : 5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - italyDraw} strokeLinejoin="round" />
            </g>
          ))}
          {/* দক্ষিণমুখী তীর */}
          <g opacity={arrA}>
            <path d={`M${ax0} ${ay0}L${ax1} ${ay1}`} stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeDasharray="22 16" pathLength={1} style={{strokeDashoffset: 0}} opacity={1} clipPath="none" />
            <g transform={`translate(${lerp(ax0, ax1, arrP)} ${lerp(ay0, ay1, arrP)}) rotate(${ang})`}><path d="M0 0L-34 -22L-34 22Z" fill="#fff" /></g>
          </g>
          {/* উপকূলরেখা ড্র-অন */}
          {t > S.coastDrawA - 0.2 && t < S.coastOut + 0.6 && (
            <g opacity={fade(t, S.coastDrawA - 0.2, S.coastDrawA, S.coastOut, S.coastOut + 0.5)}>
              <path d={ringD(coast, P, false)} fill="none" stroke={C.main} strokeOpacity={0.35} strokeWidth={22} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - coastP} strokeLinecap="round" strokeLinejoin="round" />
              <path d={ringD(coast, P, false)} fill="none" stroke={C.gold} strokeWidth={8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - coastP} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={hx} cy={hy} r={16} fill="#fff" stroke={C.gold} strokeWidth={6} />
            </g>
          )}
          {/* সবচেয়ে বড় দ্বীপ: গোল্ড রিং */}
          {ringA > 0 && (
            <circle cx={scx} cy={scy} r={Math.max(1, ringR)} fill="none" stroke={C.gold} strokeWidth={6} strokeDasharray="18 12" opacity={ringA} />
          )}
          {/* পালের্মো রাডার */}
          {t > S.pinIn && [0, 1, 2].map((k) => {
            const ph = ((t - S.pinIn) * 0.8 + k / 3) % 1;
            return <circle key={k} cx={palX} cy={palY} r={20 + ph * 170} fill="none" stroke={C.main} strokeWidth={6} opacity={(1 - ph) * 0.8 * endFade} />;
          })}
        </svg>

        {/* গ্রাউন্ড-প্লেন টেক্সট */}
        <GroundText P={P} lat={GEO.italyLabel.lat} lng={GEO.italyLabel.lng} zRef={6.2} rot={40}>
          <AnimatedText t={t} start={S.italyIn} end={S.italyOut} text={TEXT.italy} size={190} color="#fff" />
        </GroundText>
        <GroundText P={P} lat={GEO.seaLabel.lat} lng={GEO.seaLabel.lng} zRef={6.8} rot={-4}>
          <AnimatedText t={t} start={S.seaIn} end={S.seaOut} text={TEXT.sea} size={120} color="#BFE3FF" />
        </GroundText>
        <GroundText P={P} lat={GEO.sicily.lat} lng={GEO.sicily.lng} zRef={8.0} rot={-4}>
          <AnimatedText t={t} start={S.sicilyIn} end={S.sicilyOut} text={TEXT.sicily} size={200} color={C.main} />
        </GroundText>
        <GroundText P={P} lat={GEO.bigIslandLabel.lat} lng={GEO.bigIslandLabel.lng} zRef={6.3}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <AnimatedText t={t} start={S.bigLine1} end={S.bigOut} text={TEXT.big1} mode="word" size={96} color="#fff" />
            <AnimatedText t={t} start={S.bigLine2} end={S.bigOut} text={TEXT.big2} mode="word" size={110} color={C.gold} />
          </div>
        </GroundText>
        <GroundText P={P} lat={pal.lat + 0.055} lng={pal.lng} zRef={11}>
          <AnimatedText t={t} start={S.pinIn} end={S.end} text={TEXT.palermo} size={150} color="#fff" />
        </GroundText>
        <GroundText P={P} lat={pal.lat + 0.135} lng={pal.lng} zRef={11}>
          <AnimatedText t={t} start={S.histIn} end={S.end} text={TEXT.hist} mode="word" size={125} color={C.gold} />
        </GroundText>
      </Plane>

      {/* ভিনিয়েট */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(7,18,31,0) 45%, rgba(7,18,31,0.65) 100%)', pointerEvents: 'none'}} />

      {/* কার্ড (সবসময় সোজা) */}
      <InfoCard t={t} inT={S.areaIn} outT={S.areaOut} icon={<AreaIcon />} label={TEXT.areaLabel} value={bn(areaVal)} unit={TEXT.areaUnit} />
      <InfoCard t={t} inT={S.popIn} outT={S.popOut} icon={<PeopleIcon />} label={TEXT.popLabel} value={bn(popVal)} unit={TEXT.popUnit} />
      <InfoCard t={t} inT={S.coastIn} outT={S.coastOut} icon={<CoastIcon />} label={TEXT.coastLabel} value={bn(coastVal)} unit={TEXT.coastUnit} />

      {/* রাজধানী আইকন + পিন */}
      {t > S.capitalIcon && (
        <div style={{position: 'absolute', left: px - 45, top: py - 230 - 40 * (1 - sp(t, S.capitalIcon)), opacity: sp(t, S.capitalIcon) * endFade, transform: `scale(${0.5 + 0.5 * sp(t, S.capitalIcon)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT}}>
          <CrownIcon />
        </div>
      )}
      {t > S.pinIn && (
        <div style={{position: 'absolute', left: px - 55, top: py - 154 - 200 * (1 - pinP), opacity: Math.min(1, pinP * 2) * endFade}}>
          <PinIcon />
        </div>
      )}

      {/* কলআউট: স্যাটেলাইট ক্রপ */}
      {t > S.calloutIn && (
        <>
          <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', left: 0, top: 0, opacity: endFade}}>
            <path d={`M${px} ${py}L${lerp(px, cardCx, lineP)} ${lerp(py, cardCy - cardH / 2, lineP)}`} stroke={C.main} strokeWidth={6} fill="none" strokeLinecap="round" />
          </svg>
          <div style={{position: 'absolute', left: cardCx - cardW / 2, top: cardCy - cardH / 2 + 160 * callQ, width: cardW, height: cardH, borderRadius: 40, overflow: 'hidden', border: `6px solid ${C.main}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)', opacity: Math.min(1, callP) * (1 - callQ), transform: `scale(${0.7 + 0.3 * callP})`}}>
            <Plane cam={miniCam} w={cardW} h={cardH}>
              <TileLayer cam={miniCam} w={cardW} h={cardH} filter="brightness(0.95) saturate(1.1)" />
            </Plane>
            <div style={{position: 'absolute', left: cardW / 2 - 14, top: cardH / 2 - 14, width: 28, height: 28, borderRadius: 14, background: C.main, border: '4px solid #fff'}} />
            <div style={{position: 'absolute', left: 24, bottom: 20, padding: '6px 26px', borderRadius: 20, background: 'rgba(7,18,31,0.85)', color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 56}}>{TEXT.palermo}</div>
          </div>
        </>
      )}

      {/* ক্রেডিট */}
      {t > S.creditIn && (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 56, textAlign: 'center', fontFamily: FONT, fontSize: 26, color: '#fff', opacity: 0.75 * fade(t, S.creditIn, S.creditIn + 0.4, S.end - 0.3, S.end - 0.02)}}>{TEXT.credit}</div>
      )}

      {/* অডিও */}
      <Audio src={staticFile('audio/voice.wav')} volume={1} />
      {sfx(SFX.whoosh, 1.4, 'audio/whoosh.wav', 0.35)}
      {sfx(SFX.pop, 0.24, 'audio/pop.mp3', 0.45)}
      {sfx(SFX.click, 0.46, 'audio/click.wav', 0.5)}
      {sfx(SFX.typing, 0.6, 'audio/typing.mp3', 0.25)}
    </AbsoluteFill>
  );
};
