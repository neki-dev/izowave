import { EFFECT_SIZE } from '../const';
import { EffectAudio, EffectTexture } from '../types';

import audioExplosion from './audio/explosion.mp3';
import textureBlood from './textures/blood.png';
import textureDamage from './textures/damage.png';
import textureExplosion from './textures/explosion.png';
import textureSmoke from './textures/smoke.png';

import { Assets } from '~lib/assets';

Assets.AddAudio(EffectAudio.EXPLOSION, audioExplosion);

Assets.AddSprite(EffectTexture.EXPLOSION, textureExplosion, EFFECT_SIZE);
Assets.AddSprite(EffectTexture.DAMAGE, textureDamage, EFFECT_SIZE);
Assets.AddSprite(EffectTexture.SMOKE, textureSmoke, EFFECT_SIZE);
Assets.AddSprite(EffectTexture.BLOOD, textureBlood, EFFECT_SIZE);
