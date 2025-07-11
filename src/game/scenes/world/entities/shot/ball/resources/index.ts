import { ShotTexture } from '../../types';
import { ShotBallAudio } from '../types';

import audioFire from './audio/fire.mp3';
import audioFrozen from './audio/frozen.mp3';
import audioSimple from './audio/simple.mp3';
import textureBall from './textures/ball.png';

import { Assets } from '~lib/assets';

Assets.AddAudio(ShotBallAudio.FIRE, audioFire);
Assets.AddAudio(ShotBallAudio.SIMPLE, audioSimple);
Assets.AddAudio(ShotBallAudio.FROZEN, audioFrozen);

Assets.AddImage(ShotTexture.BALL, textureBall);
