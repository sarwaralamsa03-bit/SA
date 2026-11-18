import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './config';
import {SicilyVideo} from './SicilyVideo';

export const RemotionRoot: React.FC = () => (
  <Composition id="Sicily" component={SicilyVideo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
);
