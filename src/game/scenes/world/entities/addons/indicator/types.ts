import type Phaser from 'phaser';

export interface IIndicator extends Phaser.GameObjects.Container {
  /**
   * Update bar value.
   * @param value - Value
   */
  updateValue(value?: number): void
}

export type IndicatorData = {
  color: number
  size: number
  value?: () => number
  destroyIf?: (value: number) => boolean
};
