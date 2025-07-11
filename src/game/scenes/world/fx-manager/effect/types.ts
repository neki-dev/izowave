import type { PositionAtWorld } from '~scene/world/level/types';

export enum EffectTexture {
  BLOOD = 'EffectTexture:BLOOD',
  SMOKE = 'EffectTexture:SMOKE',
  DAMAGE = 'EffectTexture:DAMAGE',
  EXPLOSION = 'EffectTexture:EXPLOSION',
}

export enum EffectAudio {
  EXPLOSION = 'EffectAudio:EXPLOSION',
}

export type EffectData = {
  texture: EffectTexture
  position: PositionAtWorld
  depth?: number
  rate?: number
  staticFrame?: number
};
