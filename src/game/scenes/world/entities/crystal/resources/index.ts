import { CRYSTAL_TILE } from '../const';
import { CrystalAudio, CrystalTexture } from '../types';

import audioPickup from './audio/pickup.mp3';
import textureCrystal from './textures/crystal.png';

import { Assets } from '~core/assets';

Assets.AddAudio(CrystalAudio.PICKUP, audioPickup);

Assets.AddSprite(CrystalTexture.CRYSTAL, textureCrystal, CRYSTAL_TILE);
