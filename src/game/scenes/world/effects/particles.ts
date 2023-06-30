import { WORLD_DEPTH_EFFECT } from '~const/world';
import { registerImageAssets } from '~lib/assets';
import { IWorld } from '~type/world';
import {
  ParticlesTexture,
  ParticlesType,
  ParticlesData,
  IParticlesParent,
  IParticles,
} from '~type/world/effects';

export class Particles implements IParticles {
  readonly scene: IWorld;

  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private type: ParticlesType;

  private timer: Nullable<Phaser.Time.TimerEvent> = null;

  private parent: IParticlesParent;

  constructor(
    parent: IParticlesParent,
    {
      positionAtWorld, type, params, duration,
    }: ParticlesData,
  ) {
    this.scene = parent.scene;
    this.parent = parent;
    this.type = type;

    this.emitter = this.scene.add.particles(
      positionAtWorld?.x ?? 0,
      positionAtWorld?.y ?? 0,
      ParticlesTexture[type],
      params,
    );
    this.emitter.setDepth(WORLD_DEPTH_EFFECT);

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
    this.emitter.destroy();
    if (this.timer) {
      this.timer.destroy();
    }

    this.parent.off(Phaser.GameObjects.Events.DESTROY, this.destroy);
  }
}

registerImageAssets(ParticlesTexture);
