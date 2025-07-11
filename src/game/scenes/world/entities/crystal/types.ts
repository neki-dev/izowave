import type { PositionAtMatrix, PositionAtWorld } from '~scene/world/level/types';

export enum CrystalTexture {
  CRYSTAL = 'CrystalTexture:CRYSTAL',
}

export enum CrystalAudio {
  PICKUP = 'CrystalAudio:PICKUP',
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
