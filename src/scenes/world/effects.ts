/* eslint-disable no-param-reassign */

import { WORLD_DEPTH_EFFECT } from '~const/world';
import { World } from '~scene/world';
import { WorldTexture } from '~type/world';
import { WorldEffect, WorldEffectParticles } from '~type/world/effects';

export class Effects {
  /**
   * Parent scene.
   */
  readonly scene: World;

  /**
   * Particles instances.
   */
  private particles: WorldEffectParticles = {};

  /**
   * Effects constructor.
   */
  constructor(scene: World) {
    this.scene = scene;

    for (const effect of Object.values(WorldEffect)) {
      const particle = scene.add.particles(WorldTexture[effect]);

      particle.setDepth(WORLD_DEPTH_EFFECT);
      this.particles[effect] = particle;
    }
  }

  /**
   * Emit particles.
   *
   * @param key - Effect key
   * @param parent - Effect parent
   * @param params - Particles parameters
   * @param duration - Effect duration
   */
  public emit(
    key: WorldEffect,
    parent: Phaser.GameObjects.GameObject,
    params: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig,
    duration?: number,
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    if (!parent.effects) {
      parent.effects = {};
      parent.on(Phaser.GameObjects.Events.DESTROY, () => {
        for (const effect of Object.values(parent.effects)) {
          this.stop(parent, effect);
        }
        delete parent.effects;
      });
    }

    if (parent.effects[key]) {
      this.stop(parent, parent.effects[key]);
    }

    const effect = this.particles[key].createEmitter(params);

    effect.effectType = key;

    if (duration) {
      effect.timer = this.scene.time.delayedCall(duration, () => {
        this.stop(parent, effect);
      });
    } else {
      delete effect.timer;
    }

    parent.effects[key] = effect;

    return effect;
  }

  /**
   * Stop particles emitter.
   *
   * @param parent - Effect parent
   * @param effect - Effect emitter
   */
  public stop(
    parent: Phaser.GameObjects.GameObject,
    effect: Phaser.GameObjects.Particles.ParticleEmitter,
  ) {
    effect.timer?.destroy();
    this.particles[effect.effectType].removeEmitter(effect);
    delete parent.effects[effect.effectType];
  }
}
