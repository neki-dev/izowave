import Phaser from 'phaser';

import { WORLD_DEPTH_GRAPHIC } from '~const/world';
import { IWorld } from '~type/world';
import { IIndicator, IndicatorData } from '~type/world/entities/indicator';

export class Indicator extends Phaser.GameObjects.Container implements IIndicator {
  readonly scene: IWorld;

  private value?: () => number;

  private bar: Phaser.GameObjects.Rectangle;

  private background: Phaser.GameObjects.Rectangle;

  constructor(parent: Phaser.GameObjects.GameObject, { size, color, value }: IndicatorData) {
    super(parent.scene, 0, 0);
    parent.scene.add.existing(this);

    this.value = value;

    this.background = this.scene.add.rectangle(0, 0, size, 5, 0x000000);
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

    return progress;
  }
}
