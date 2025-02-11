import Phaser from 'phaser';

import type { IIndicator, IndicatorData } from './types';

import { WORLD_DEPTH_GRAPHIC } from '~scene/world/const';
import type { IWorld } from '~scene/world/types';

export class Indicator extends Phaser.GameObjects.Container implements IIndicator {
  readonly scene: IWorld;

  private value?: () => number;

  private bar: Phaser.GameObjects.Rectangle;

  private background: Phaser.GameObjects.Rectangle;

  private destroyIf: Nullable<(value: number) => boolean> = null;

  constructor(parent: Phaser.GameObjects.GameObject, {
    size, color, value, destroyIf,
  }: IndicatorData) {
    super(parent.scene, 0, 0);
    parent.scene.add.existing(this);

    this.value = value;
    this.destroyIf = destroyIf ?? null;

    this.background = this.scene.add.rectangle(0, 0, size, 4, 0x000000, 0.5);
    this.background.setOrigin(0.0, 0.0);

    this.bar = this.scene.add.rectangle(1, 1, 0, 0, color);
    this.bar.setOrigin(0.0, 0.0);

    this.setDepth(WORLD_DEPTH_GRAPHIC);
    this.setSize(this.background.width, this.background.height);
    this.add([this.background, this.bar]);
  }

  public updateValue(value?: number) {
    const progress = value ?? this.value?.() ?? 0;

    this.bar.setSize((this.width - 2) * progress, this.height - 2);

    if (this.destroyIf?.(progress)) {
      this.destroy();
    }
  }
}
