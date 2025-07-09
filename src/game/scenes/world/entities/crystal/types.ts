import type { PositionAtMatrix, PositionAtWorld } from '~scene/world/level/types';

export enum CrystalTexture {
  CRYSTAL = 'crystal/crystal',
}

export enum CrystalAudio {
  PICKUP = 'crystal/pickup',
}

export enum CrystalEvents {
  PICKUP = 'pickup',
}

export type CrystalData = {
  positionAtMatrix: PositionAtMatrix
  variant?: number
};

export type CrystalAmount = {
  position: PositionAtWorld
  value: number
};

export type CrystalSavePayload = {
  position: PositionAtMatrix
};
