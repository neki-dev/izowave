import { ParticlesTexture } from '../types';

import textureBit from './textures/bit.png';
import textureBitSoft from './textures/bit_soft.png';
import textureGlow from './textures/glow.png';
import texturePlus from './textures/plus.png';

import { Assets } from '~lib/assets';

Assets.AddImage(ParticlesTexture.BIT, textureBit);
Assets.AddImage(ParticlesTexture.BIT_SOFT, textureBitSoft);
Assets.AddImage(ParticlesTexture.GLOW, textureGlow);
Assets.AddImage(ParticlesTexture.PLUS, texturePlus);
