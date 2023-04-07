import { registerImageAssets } from '~lib/assets';
import { IWorld } from '~type/world';
import {
  ParticlesTexture, ParticlesType, ParticlesData, IParticlesParent, IParticles,
} from '~type/world/effects';

export class Particles implements IParticles {
  readonly scene: IWorld;

  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private type: ParticlesType;

  private timer: Nullable<Phaser.Time.TimerEvent> = null;

  private parent: IParticlesParent;

  constructor(parent: IParticlesParent, {
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

  public setVisible(state: boolean) {
    this.emitter.setVisible(state);
  }

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
