import type Phaser from 'phaser';

import type { TileType } from '../types';

export interface ITile extends Phaser.GameObjects.Image {
  tileType: TileType
  clearable?: boolean
}
