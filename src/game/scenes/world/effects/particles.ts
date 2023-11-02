import { v4 as uuidv4 } from 'uuid';

import { WORLD_DEPTH_EFFECT } from '~const/world';
import { Assets } from '~lib/assets';
import { IWorld } from '~type/world';
import {
  ParticlesTexture,
  ParticlesData,
  IParticlesParent,
  IParticles,
} from '~type/world/effects';

Assets.RegisterImages(ParticlesTexture);

export class Particles implements IParticles {
  readonly scene: IWorld;

  readonly emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private key: string;

  private parent: IParticlesParent;

  constructor(
    parent: IParticlesParent,
    {
      key, position, texture, params, replay = true,
    }: ParticlesData,
  ) {
    this.scene = parent.scene;
    this.parent = parent;
    this.key = key ?? uuidv4();

    if (!this.parent.effects) {
      this.parent.effects = {};
    } else if (this.parent.effects[this.key]) {
      if (replay) {
        this.parent.effects[this.key].destroy();
      } else {
        return;
      }
    }

    this.parent.effects[this.key] = this;

    this.emitter = this.scene.add.particles(
      position?.x ?? 0,
      position?.y ?? 0,
      texture,
      params,
    );
    this.emitter.setDepth(WORLD_DEPTH_EFFECT);

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
    delete this.parent.effects?.[this.key];
    this.emitter.destroy();

    this.parent.off(Phaser.GameObjects.Events.DESTROY, this.destroy);
  }
}
