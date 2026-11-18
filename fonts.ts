import {continueRender, delayRender, staticFile} from 'remotion';
const files: [string, number][] = [
  ['fonts/NotoSansBengali-Regular.ttf', 400],
  ['fonts/NotoSansBengali-Bold.ttf', 700],
  ['fonts/NotoSansBengali-Black.ttf', 900],
];
const h = delayRender('fonts');
Promise.all(
  files.map(([f, w]) => new FontFace('NotoBn', `url(${staticFile(f)})`, {weight: String(w)}).load().then((ff) => document.fonts.add(ff))),
).then(() => continueRender(h)).catch(() => continueRender(h));
