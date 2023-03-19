import Phaser from 'phaser';

import { WORLD_DEPTH_EFFECT } from '~const/world';
import { SHOT_LAZER_DELAY, SHOT_LAZER_REPEAT } from '~const/world/entities/shot';
import { Enemy } from '~entity/npc/variants/enemy';
import { registerAudioAssets } from '~lib/assets';
import { World } from '~scene/world';
import { Particles } from '~scene/world/effects';
import { ParticlesType } from '~type/world/effects';
import {
  IShot, IShotInitiator, ShotLazerAudio, ShotParams,
} from '~type/world/entities/shot';

export class ShotLazer extends Phaser.GameObjects.Line implements IShot {
  readonly scene: World;

  /**
   * Shot initiator.
   */
  private initiator: Nullable<IShotInitiator> = null;

  /**
   * Shot params.
   */
  public params: ShotParams;

  /**
   * Timer of shoot processing.
   */
  private timer: Nullable<Phaser.Time.TimerEvent> = null;

  /**
   * Target enemy.
   */
  private target: Nullable<Enemy> = null;

  /**
   * Shot constructor.
   */
  constructor(scene: World, params: ShotParams) {
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

  /**
   * Set initiator for next shoots.
   *
   * @param initiator - Initiator
   */
  public setInitiator(initiator: IShotInitiator) {
    this.initiator = initiator;

    initiator.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.destroy();
    });
  }

  /**
   * Update lazer target position.
   */
  public update() {
    if (!this.target) {
      return;
    }

    this.setTo(this.initiator.x, this.initiator.y, this.target.x, this.target.y);
  }

  /**
   * Make shoot to target.
   *
   * @param target - Enemy
   */
  public shoot(target: Enemy) {
    if (!this.initiator) {
      return;
    }

    this.target = target;

    this.timer = this.scene.time.addEvent({
      delay: SHOT_LAZER_DELAY,
      repeat: SHOT_LAZER_REPEAT,
      callback: () => this.processing(),
    });

    this.setTo(this.initiator.x, this.initiator.y, target.x, target.y);
    this.setVisible(this.initiator.visible && target.visible);

    if (this.scene.sound.getAll(ShotLazerAudio.LAZER).length < 3) {
      this.scene.sound.play(ShotLazerAudio.LAZER);
    }
  }

  /**
   * Stop shooting.
   */
  private stop() {
    this.target = null;

    this.timer.destroy();
    this.timer = null;

    this.setVisible(false);
  }

  /**
   * Handle hit to target.
   */
  private hit() {
    const momentDamage = this.params.damage / SHOT_LAZER_REPEAT;

    this.target.live.damage(momentDamage);

    if (this.target.visible) {
      new Particles(this.target, {
        type: ParticlesType.GLOW,
        duration: 150,
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

  /**
   * Process of shooting.
   */
  private processing() {
    if (
      this.target.live.isDead()
      || Phaser.Math.Distance.BetweenPoints(this.initiator, this.target) > this.params.maxDistance
    ) {
      this.stop();

      return;
    }

    this.hit();

    if (this.timer.repeatCount === 0) {
      this.stop();
    }
  }
}

registerAudioAssets(ShotLazerAudio);
