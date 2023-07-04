import Phaser from 'phaser';

import { WORLD_DEPTH_EFFECT } from '~const/world';
import { SHOT_LAZER_DELAY, SHOT_LAZER_REPEAT } from '~const/world/entities/shot';
import { registerAudioAssets } from '~lib/assets';
import { Particles } from '~scene/world/effects';
import { IWorld } from '~type/world';
import { ParticlesType } from '~type/world/effects';
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
    scene.entityGroups.shots.add(this);

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
    if (!this.initiator || !this.target) {
      return;
    }

    this.setTo(this.initiator.x, this.initiator.y, this.target.body.position.x, this.target.body.position.y);
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

    this.setTo(this.initiator.x, this.initiator.y, target.body.position.x, target.body.position.y);
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
    const momentDamage = this.params.damage / SHOT_LAZER_REPEAT;

    this.target.live.damage(momentDamage);

    if (this.target.visible) {
      new Particles(this.target, {
        type: ParticlesType.GLOW,
        duration: 150,
        positionAtWorld: this.target.getBodyOffset(),
        params: {
          follow: this.target,
          lifespan: { min: 100, max: 150 },
          scale: { start: 0.2, end: 0.1 },
          speed: 80,
          tint: 0xb136ff,
        },
      });
    }
  }

  private processing() {
    if (
      this.target.live.isDead()
      || Phaser.Math.Distance.BetweenPoints(this.initiator, this.target.body.position) > this.params.maxDistance
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
