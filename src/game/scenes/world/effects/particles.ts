import { WORLD_DEPTH_EFFECT } from '~const/world';
import { registerImageAssets } from '~lib/assets';
import { IWorld } from '~type/world';
import {
  ParticlesTexture,
  ParticlesData,
  IParticlesParent,
  IParticles,
} from '~type/world/effects';

export class Particles implements IParticles {
  readonly scene: IWorld;

  readonly emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private key: string;

  private parent: IParticlesParent;

  constructor(
    parent: IParticlesParent,
    {
      key, positionAtWorld, texture, params,
    }: ParticlesData,
  ) {
    this.scene = parent.scene;
    this.parent = parent;
    this.key = key;

    this.emitter = this.scene.add.particles(
      positionAtWorld?.x ?? 0,
      positionAtWorld?.y ?? 0,
      texture,
      params,
    );
    this.emitter.setDepth(WORLD_DEPTH_EFFECT);

    if (!this.parent.effects) {
      this.parent.effects = {};
    } else if (this.parent.effects[key]) {
      this.parent.effects[key].destroy();
    }

    this.parent.effects[key] = this;

    this.parent.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.destroy();
    });

    if (params.duration) {
      this.emitter.on(Phaser.GameObjects.Particles.Events.COMPLETE, () => {
        this.destroy();
      });
    }
  }

  public destroy() {
    delete this.parent.effects[this.key];
    this.emitter.destroy();

    this.parent.off(Phaser.GameObjects.Events.DESTROY, this.destroy);
  }
}

registerImageAssets(ParticlesTexture);
