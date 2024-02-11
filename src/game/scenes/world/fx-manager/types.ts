import type { IEffect } from './effect/types';
import type { IParticles, IParticlesParent } from './particles/types';
import type { IBuilding } from '../entities/building/types';
import type { IEnemy } from '../entities/npc/enemy/types';
import type { INPC } from '../entities/npc/types';
import type { IPlayer } from '../entities/player/types';
import type { ISprite } from '../entities/types';
import type { PositionAtWorld } from '../level/types';

export type SoundParams = Phaser.Types.Sound.SoundConfig & {
  limit?: number
};

export interface IFXManager {
  /**
   * Play sound effect.
   * @param key - Sound key
   * @param params - Sound params
   */
  playSound(key: string | string[], params?: SoundParams): void

  /**
   * Create blood effect.
   * @param parent - Effect owner
   */
  createBloodEffect(parent: ISprite): Nullable<IParticles>

  /**
   * Create fire effect.
   * @param parent - Effect owner
   */
  createFireEffect(parent: IEnemy): Nullable<IParticles>

  /**
   * Create long fire effect.
   * @param parent - Effect owner
   * @param params - Effect params
   */
  createLongFireEffect(parent: IEnemy, params: { duration: number }): Nullable<IParticles>

  /**
   * Create lazer effect.
   * @param parent - Effect owner
   */
  createLazerEffect(parent: IEnemy): Nullable<IParticles>

  /**
   * Create glow effect.
   * @param parent - Effect owner
   * @param params - Effect params
   */
  createGlowEffect(parent: IParticlesParent, params: { speed: number; color: number }): Nullable<IParticles>

  /**
   * Create froze effect.
   * @param parent
   */
  createFrozeEffect(parent: INPC): Nullable<IParticles>

  /**
   * Create electro effect.
   * @param parent - Effect owner
   */
  createElectroEffect(parent: IEnemy): Nullable<IParticles>

  /**
   * Create dust effect.
   * @param parent - Effect owner
   */
  createDustEffect(parent: IPlayer): Nullable<IParticles>

  /**
   * Create generation effect.
   * @param parent - Effect owner
   */
  createGenerationEffect(parent: IBuilding): Nullable<IParticles>

  /**
   * Create spawn effect.
   * @param parent - Effect owner
   */
  createSpawnEffect(parent: IEnemy): Nullable<IParticles>

  /**
   * Create heal effect.
   * @param parent - Effect owner
   */
  createHealEffect(parent: ISprite): Nullable<IParticles>

  /**
   * Create explosion effect.
   * @param parent - Effect owner
   */
  createExplosionEffect(parent: ISprite): Nullable<IEffect>

  /**
   * Create blood stain effect.
   * @param position - Position at world
   */
  createBloodStainEffect(position: PositionAtWorld): Nullable<IEffect>

  /**
   * Create damage effect.
   * @param parent - Effect owner
   */
  createDamageEffect(parent: IBuilding): Nullable<IEffect>

  /**
   * Create smoke effect.
   * @param parent - Effect owner
   */
  createSmokeEffect(parent: IBuilding): Nullable<IEffect>
}
