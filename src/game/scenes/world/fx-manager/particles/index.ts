import { ParticlesTexture } from './types';
import type { IParticles, IParticlesParent, ParticlesData } from './types';

import { Assets } from '~lib/assets';
import type { IWorld } from '~scene/world/types';

Assets.RegisterImages(ParticlesTexture);

export class Particles implements IParticles {
  readonly scene: IWorld;

  readonly emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private key: string;

  private parent: IParticlesParent;

  constructor(
    parent: IParticlesParent,
    {
      key, position, texture, params, depth, attach,
    }: ParticlesData,
  ) {
    this.scene = parent.scene;
    this.parent = parent;
    this.key = key;

    if (!this.parent.effects) {
      this.parent.effects = {};
    } else if (this.parent.effects[this.key]) {
      this.parent.effects[this.key].destroy();
    }

    this.parent.effects[this.key] = this;

    this.emitter = this.scene.add.particles(
      position?.x ?? 0,
      position?.y ?? 0,
      texture,
      {
        ...params,
        follow: attach ? parent : undefined,
      },
    );
    this.emitter.setDepth(depth ?? parent.depth + 1);

    this.destroy = this.destroy.bind(this);
    this.update = this.update.bind(this);

    this.parent.once(Phaser.GameObjects.Events.DESTROY, this.destroy);

    if (attach && depth === undefined) {
      this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update);
    }

    if (params.duration) {
      this.emitter.once(Phaser.GameObjects.Particles.Events.COMPLETE, this.destroy);
    }
  }

  public destroy() {
    delete this.parent.effects?.[this.key];
    this.emitter.destroy();

    this.parent.off(Phaser.GameObjects.Events.DESTROY, this.destroy);
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update);
  }

  private update() {
    try {
      this.emitter.setDepth(this.parent.depth + 1);
    } catch (error) {
      console.warn('Failed to update particles', error as TypeError);
    }
  }
}
