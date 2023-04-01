import { registerImageAssets } from '~lib/assets';
import { World } from '~scene/world';
import {
  ParticlesTexture, ParticlesType, ParticlesData, ParticlesParent,
} from '~type/world/effects';

export class Particles {
  /**
   * Parent scene.
   */
  readonly scene: World;

  /**
   *
   */
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  /**
   *
   */
  private type: ParticlesType;

  /**
   *
   */
  private timer: Nullable<Phaser.Time.TimerEvent> = null;

  /**
   *
   */
  private parent: Phaser.GameObjects.GameObject;

  /**
   * Particles constructor.
   */
  constructor(parent: ParticlesParent, {
    type, params, duration,
  }: ParticlesData) {
    this.scene = parent.scene;
    this.parent = parent;
    this.type = type;

    this.emitter = this.scene.particles[type].createEmitter(params);

    if (!this.parent.effects) {
      this.parent.effects = {};
    } else if (this.parent.effects[type]) {
      this.parent.effects[type].destroy();
    }

    this.parent.effects[type] = this;

    this.parent.on(Phaser.GameObjects.Events.DESTROY, this.destroy, this);

    if (duration) {
      this.timer = this.scene.time.delayedCall(duration, () => {
        this.destroy();
      });
    }
  }

  /**
   * Set emitter state of visible.
   */
  public setVisible(state: boolean) {
    this.emitter.setVisible(state);
  }

  /**
   * Destroy particles emitter.
   */
  public destroy() {
    delete this.parent.effects[this.type];
    this.scene.particles[this.type].removeEmitter(this.emitter);
    if (this.timer) {
      this.timer.destroy();
    }

    this.parent.off(Phaser.GameObjects.Events.DESTROY, this.destroy);
  }
}

registerImageAssets(ParticlesTexture);
