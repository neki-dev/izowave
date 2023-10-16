import Phaser from 'phaser';

import { WORLD_DEPTH_EFFECT } from '~const/world';
import { SHOT_LAZER_DELAY, SHOT_LAZER_REPEAT } from '~const/world/entities/shot';
import { Assets } from '~lib/assets';
import { getIsometricDistance } from '~lib/dimension';
import { Particles } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import { EntityType } from '~type/world/entities';
import { IEnemy } from '~type/world/entities/npc/enemy';
import {
  IShotInitiator, IShotLazer, ShotLazerAudio, ShotParams,
} from '~type/world/entities/shot';
import { Vector2D } from '~type/world/level';

Assets.RegisterAudio(ShotLazerAudio);

export class ShotLazer extends Phaser.GameObjects.Line implements IShotLazer {
  readonly scene: IWorld;

  public params: ShotParams;

  private initiator: Nullable<IShotInitiator> = null;

  private positionCallback: Nullable<() => Vector2D> = null;

  private target: Nullable<IEnemy> = null;

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
    this.setDepth(WORLD_DEPTH_EFFECT);
    this.setOrigin(0.0, 0.0);
  }

  public setInitiator(initiator: IShotInitiator, positionCallback: Nullable<() => Vector2D> = null) {
    this.initiator = initiator;
    this.positionCallback = positionCallback;

    initiator.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.destroy();
    });
  }

  public update() {
    this.updateLine();
    this.processing();
  }

  public shoot(target: IEnemy) {
    if (!this.initiator) {
      return;
    }

    this.target = target;
    this.processingHitsCount = 0;

    this.updateLine();
    this.setActive(true);
    this.setVisible(true);

    if (this.scene.game.sound.getAll(ShotLazerAudio.LAZER).length < 3) {
      this.scene.game.sound.play(ShotLazerAudio.LAZER);
    }
  }

  private stop() {
    this.target = null;

    this.setVisible(false);
    this.setActive(false);
  }

  private updateLine() {
    if (!this.initiator || !this.target?.body) {
      return;
    }

    const position = this.positionCallback?.() ?? this.initiator;

    this.setTo(position.x, position.y, this.target.body.center.x, this.target.body.center.y);
  }

  private hit() {
    if (!this.target || !this.params.damage) {
      return;
    }

    const momentDamage = this.params.damage / SHOT_LAZER_REPEAT;

    this.target.live.damage(momentDamage);

    if (this.active && this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      new Particles(this.target, {
        key: 'glow',
        texture: ParticlesTexture.GLOW,
        params: {
          duration: 150,
          follow: this.target,
          followOffset: this.target.getBodyOffset(),
          lifespan: { min: 100, max: 150 },
          scale: { start: 0.2, end: 0.1 },
          speed: 80,
          tint: 0xb136ff,
        },
      });
    }
  }

  private processing() {
    if (!this.initiator) {
      return;
    }

    const now = this.scene.getTime();

    if (this.processingTimestamp > now) {
      return;
    }

    if (
      !this.target?.body
      || this.target.live.isDead()
      || (
        this.params.maxDistance
        && getIsometricDistance(this.initiator, this.target.body.center) > this.params.maxDistance
      )
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
