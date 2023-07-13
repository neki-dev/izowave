import Phaser from 'phaser';

import { WORLD_DEPTH_EFFECT } from '~const/world';
import { SHOT_LAZER_DELAY, SHOT_LAZER_REPEAT } from '~const/world/entities/shot';
import { registerAudioAssets } from '~lib/assets';
import { Particles } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import { EntityType } from '~type/world/entities';
import { IEnemy } from '~type/world/entities/npc/enemy';
import {
  IShotInitiator, IShotLazer, ShotLazerAudio, ShotParams,
} from '~type/world/entities/shot';

export class ShotLazer extends Phaser.GameObjects.Line implements IShotLazer {
  readonly scene: IWorld;

  public params: ShotParams;

  private initiator: Nullable<IShotInitiator> = null;

  private timer: Nullable<Phaser.Time.TimerEvent> = null;

  private target: Nullable<IEnemy> = null;

  constructor(scene: IWorld, params: ShotParams) {
    super(scene);
    scene.add.existing(this);
    scene.addEntity(EntityType.SHOT, this);

    this.params = params;

    this.setVisible(false);
    this.setStrokeStyle(2, 0xb136ff, 0.5);
    this.setDepth(WORLD_DEPTH_EFFECT);
    this.setOrigin(0.0, 0.0);

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.timer) {
        this.timer.destroy();
      }
    });
  }

  public setInitiator(initiator: IShotInitiator) {
    this.initiator = initiator;

    initiator.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.destroy();
    });
  }

  public update() {
    if (!this.initiator || !this.target?.body) {
      return;
    }

    this.setTo(this.initiator.x, this.initiator.y, this.target.body.center.x, this.target.body.center.y);
  }

  public shoot(target: IEnemy) {
    if (!this.initiator) {
      return;
    }

    this.target = target;

    this.timer = this.scene.time.addEvent({
      delay: SHOT_LAZER_DELAY,
      repeat: SHOT_LAZER_REPEAT,
      callback: () => this.processing(),
    });

    this.setTo(this.initiator.x, this.initiator.y, target.body.center.x, target.body.center.y);
    this.setVisible(this.initiator.visible && target.visible);

    if (this.scene.game.sound.getAll(ShotLazerAudio.LAZER).length < 3) {
      this.scene.game.sound.play(ShotLazerAudio.LAZER);
    }
  }

  private stop() {
    this.target = null;

    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
    }

    this.setVisible(false);
  }

  private hit() {
    if (!this.target || !this.params.damage) {
      return;
    }

    const momentDamage = this.params.damage / SHOT_LAZER_REPEAT;

    this.target.live.damage(momentDamage);

    if (
      !this.target.visible
      || !this.scene.game.isSettingEnabled(GameSettings.EFFECTS)
    ) {
      return;
    }

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

  private processing() {
    if (
      !this.initiator
      || !this.params.maxDistance
      || !this.target?.body
      || this.target.live.isDead()
      || Phaser.Math.Distance.BetweenPoints(this.initiator, this.target.body.center) > this.params.maxDistance
    ) {
      this.stop();

      return;
    }

    this.hit();

    if (this.timer?.repeatCount === 0) {
      this.stop();
    }
  }
}

registerAudioAssets(ShotLazerAudio);
