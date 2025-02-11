import Phaser from 'phaser';

import type { IEnemy } from '../../npc/enemy/types';
import { EntityType } from '../../types';
import type { ShotParams, IShotInitiator } from '../types';

import { SHOT_LAZER_REPEAT, SHOT_LAZER_DELAY } from './const';
import { ShotLazerAudio } from './types';
import type { IShotLazer } from './types';

import { Assets } from '~lib/assets';
import { getIsometricDistance } from '~lib/dimension';
import { WORLD_DEPTH_GRAPHIC } from '~scene/world/const';
import type { PositionAtWorld } from '~scene/world/level/types';
import type { IWorld } from '~scene/world/types';

Assets.RegisterAudio(ShotLazerAudio);

export class ShotLazer extends Phaser.GameObjects.Line implements IShotLazer {
  readonly scene: IWorld;

  public params: ShotParams;

  private initiator: Nullable<IShotInitiator> = null;

  private positionCallback: Nullable<() => PositionAtWorld> = null;

  private target: Nullable<IEnemy> = null;

  private startPosition: Nullable<PositionAtWorld> = null;

  private processingTimestamp: number = 0;

  private processingHitsCount: number = 0;

  constructor(scene: IWorld, params: ShotParams) {
    super(scene);
    scene.add.existing(this);
    scene.addEntityToGroup(this, EntityType.SHOT);

    this.params = params;

    this.setActive(false);
    this.setVisible(false);

    this.setStrokeStyle(2, 0xb136ff, 0.5);
    this.setDepth(WORLD_DEPTH_GRAPHIC);
    this.setOrigin(0.0, 0.0);
  }

  public setInitiator(initiator: IShotInitiator, positionCallback: Nullable<() => PositionAtWorld> = null) {
    this.initiator = initiator;
    this.positionCallback = positionCallback;

    initiator.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.destroy();
    });
  }

  public update() {
    try {
      this.updateLine();
      this.processing();
    } catch (error) {
      console.warn('Failed to update lazer shot', error as TypeError);
    }
  }

  public shoot(target: IEnemy, params?: ShotParams) {
    if (!this.initiator) {
      return;
    }

    if (params) {
      this.params = params;
    }

    const position = this.positionCallback?.() ?? this.initiator;

    this.target = target;
    this.processingHitsCount = 0;
    this.startPosition = {
      x: position.x,
      y: position.y,
    };

    this.updateLine();
    this.setActive(true);
    this.setVisible(true);

    this.scene.fx.playSound(ShotLazerAudio.LAZER, {
      limit: 3,
    });
  }

  private stop() {
    this.target = null;
    this.startPosition = null;

    this.setVisible(false);
    this.setActive(false);
  }

  private updateLine() {
    if (!this.startPosition || !this.target?.active) {
      return;
    }

    const endPosition = this.target.body.center;

    this.setTo(this.startPosition.x, this.startPosition.y, endPosition.x, endPosition.y);
  }

  private hit() {
    if (!this.target || !this.params.damage) {
      return;
    }

    this.scene.fx.createLazerEffect(this.target);

    const momentDamage = this.params.damage / SHOT_LAZER_REPEAT;

    this.target.live.damage(momentDamage);
  }

  private processing() {
    const now = this.scene.getTime();

    if (this.processingTimestamp > now) {
      return;
    }

    if (!this.target?.active || this.target.live.isDead()) {
      this.stop();

      return;
    }

    if (
      this.params.maxDistance
      && this.startPosition
      && getIsometricDistance(this.startPosition, this.target.body.center) > this.params.maxDistance
    ) {
      this.stop();

      return;
    }

    this.hit();

    this.processingTimestamp = now + SHOT_LAZER_DELAY;
    this.processingHitsCount++;

    if (this.processingHitsCount === SHOT_LAZER_REPEAT) {
      this.stop();
    }
  }
}
