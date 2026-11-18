// ===== সব সময়, রং, ক্যামেরা, টেক্সট এখানে। কোডে সংখ্যা হার্ডকোড নেই। =====
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const VOICE_S = 23.8;
export const TOTAL_S = 24.6;
export const TOTAL_FRAMES = Math.round(TOTAL_S * FPS);
export const LEAD = 0.2; // দৃশ্য ভয়েসের ০.২s আগে
export const ANCHOR_Y = 0.5; // ক্যামেরা-কেন্দ্র স্ক্রিনের কত অংশ নিচে
export const PERSPECTIVE = 2600;
export const TILE_URL = (z: number, x: number, y: number) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;

export const C = {
  main: '#19E3B1', alt: '#FFB020', danger: '#E5252A', neutral: '#2F6BFF',
  gold: '#FFD43B', text: '#FFFFFF', bg: '#07121F', italyLine: '#7FA6FF',
};
export const FONT = 'NotoBn, "Noto Sans Bengali", sans-serif';

export const GEO = {
  palermo: {lat: 38.1157, lng: 13.3615},
  sicily: {lat: 37.58, lng: 14.15},
  italyLabel: {lat: 42.3, lng: 12.5},
  rome: {lat: 41.9, lng: 12.5},
  seaLabel: {lat: 35.0, lng: 13.6},
  bigIslandLabel: {lat: 34.6, lng: 14.5},
  coastStart: {lat: 38.27, lng: 15.65}, // কেপ পেলোরো
};

export const v = (voiceT: number) => Math.max(0, voiceT - LEAD);

// ===== সময় (দৃশ্য-সময়; SRT-এর শব্দ-সময় থেকে ০.২s আগে) =====
export const S = {
  italyIn: v(0.24), italyOut: 1.6,
  arrowIn: v(0.56), arrowOut: 1.9,
  seaIn: v(1.04), seaOut: 3.0,
  sicilyColor: [v(4.98) - 0.5, v(4.98)] as [number, number],
  sicilyIn: v(4.98), sicilyOut: 6.9,
  areaIn: v(5.52), areaCountEnd: 7.0, areaOut: 7.75,
  popIn: v(8.26), popCountEnd: 10.4, popOut: 11.1,
  coastIn: v(11.58), coastDrawA: 11.7, coastDrawB: 14.8, coastOut: 15.0,
  bigLine1: v(17.74), bigLine2: v(18.56), bigOut: 19.3,
  ringIn: v(18.56) - 0.1,
  capitalIcon: v(20.02), capitalOut: 24.3,
  pinIn: v(20.46),
  calloutIn: v(21.04),
  histIn: v(22.94),
  creditIn: 23.7,
  end: TOTAL_S,
};
export const AREA = 25711;
export const POP_LAKH = 48;
export const COAST_KM = 1637;
export const TEXT = {
  italy: 'ইতালি', sea: 'ভূমধ্যসাগর', sicily: 'সিসিলি',
  areaLabel: 'আয়তন', areaUnit: 'বর্গ কিমি',
  popLabel: 'জনসংখ্যা', popUnit: 'লাখ মানুষ',
  coastLabel: 'উপকূলরেখা', coastUnit: 'কিমি',
  big1: 'ভূমধ্যসাগরের', big2: 'সবচেয়ে বড় দ্বীপ',
  palermo: 'পালের্মো', hist: 'ঐতিহাসিক শহর', capital: 'রাজধানী',
  credit: 'Imagery: Esri World Imagery · Borders: openpolis / ISTAT',
};

// ===== ক্যামেরা কীফ্রেম =====
export type Cam = {lat: number; lng: number; z: number; b: number; p: number};
export type KF = Cam & {t: number; dip?: number};
export const KFS: KF[] = [
  {t: 0.0, lat: 39.0, lng: 14.5, z: 3.9, b: 0, p: 0},
  {t: 0.9, lat: 41.5, lng: 12.6, z: 6.0, b: 0, p: 8},
  {t: 2.4, lat: 37.9, lng: 14.0, z: 6.8, b: 6, p: 12},
  {t: 3.3, lat: 37.75, lng: 14.1, z: 7.0, b: 8, p: 14},
  {t: 5.2, lat: 37.6, lng: 14.2, z: 8.0, b: 10, p: 18},
  {t: 8.2, lat: 37.55, lng: 14.2, z: 8.35, b: 12, p: 20},
  {t: 11.5, lat: 37.5, lng: 14.15, z: 8.3, b: 18, p: 28},
  {t: 13.5, lat: 37.55, lng: 14.15, z: 7.95, b: 24, p: 32},
  {t: 15.3, lat: 37.55, lng: 14.15, z: 7.9, b: 18, p: 26},
  {t: 17.5, lat: 37.4, lng: 14.5, z: 6.3, b: 0, p: 10},
  {t: 19.2, lat: 37.35, lng: 14.5, z: 6.35, b: -2, p: 10},
  {t: 20.8, lat: 38.137, lng: 13.3615, z: 10.8, b: -12, p: 34, dip: 1.0},
  {t: TOTAL_S, lat: 38.137, lng: 13.3615, z: 11.2, b: -6, p: 38},
];

// ===== সাউন্ড (দৃশ্য-সময়) =====
export const SFX = {
  whoosh: [0.6, 3.3, 15.3, 19.2],
  pop: [S.sicilyIn, S.areaIn, S.popIn, S.coastIn, S.bigLine1, S.capitalIcon, S.calloutIn, S.histIn],
  click: [S.pinIn],
  typing: [S.italyIn, S.seaIn, S.sicilyIn, S.pinIn],
};
