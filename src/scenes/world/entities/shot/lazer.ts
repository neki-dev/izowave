import Phaser from 'phaser';

import { WORLD_DEPTH_EFFECT } from '~const/world';
import { BuildingTower } from '~entity/building/variants/tower';
import { Enemy } from '~entity/npc/variants/enemy';
import { registerAudioAssets } from '~lib/assets';
import { World } from '~scene/world';
import { Particles } from '~scene/world/effects';
import { ParticlesType } from '~type/world/effects';
import { ShotLazerAudio, ShotParams } from '~type/world/entities/shot';

export class ShotLazer extends Phaser.GameObjects.Line {
  readonly scene: World;

  /**
   * Shot owner.
   */
  private readonly parent: BuildingTower;

  /**
   * Timer of shoot processing.
   */
  private timer: Nullable<Phaser.Time.TimerEvent> = null;

  /**
   * Damage of hit.
   */
  private damage: Nullable<number> = null;

  /**
   * Max shot distance.
   */
  private maxDistance: Nullable<number> = null;

  /**
   * Target enemy.
   */
  private target: Nullable<Enemy> = null;

  /**
   * Shot constructor.
   */
  constructor(parent: BuildingTower) {
    super(parent.scene);
    parent.scene.add.existing(this);
    parent.scene.entityGroups.shots.add(this);

    this.parent = parent;

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
   * Update lazer target position.
   */
  public update() {
    if (!this.target) {
      return;
    }

    this.setTo(this.parent.x, this.parent.y, this.target.x, this.target.y);
  }

  /**
   * Make shoot to target.
   *
   * @param target - Enemy
   * @param data - Shot params
   */
  public shoot(target: Enemy, {
    damage, maxDistance,
  }: ShotParams) {
    this.target = target;
    this.damage = damage;
    this.maxDistance = maxDistance;

    this.timer = this.scene.time.addEvent({
      delay: 80,
      repeat: 5,
      callback: () => this.processing(),
    });

    this.setTo(this.parent.x, this.parent.y, target.x, target.y);
    this.setVisible(this.parent.visible && target.visible);

    if (this.scene.sound.getAll(ShotLazerAudio.LAZER).length < 3) {
      this.scene.sound.play(ShotLazerAudio.LAZER);
    }
  }

  /**
   * Stop shooting.
   */
  private stop() {
    this.target = null;
    this.damage = null;
    this.maxDistance = null;

    this.timer.destroy();
    this.timer = null;

    this.setVisible(false);
  }

  /**
   * Handle hit to target.
   */
  private hit() {
    this.target.live.damage(this.damage);

    if (!this.target.visible) {
      return;
    }

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

  /**
   * Process of shooting.
   */
  private processing() {
    if (
      this.target.live.isDead()
      || Phaser.Math.Distance.BetweenPoints(this.parent, this.target) > this.maxDistance
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
