import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture, EnemyAudio } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyBoss extends Enemy {
  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BOSS,
      score: 10,
      multipliers: {
        health: 8.0,
        damage: 1.2,
        speed: 0.5,
      },
    });
  }

  public onDead() {
    this.scene.sound.play(EnemyAudio.ROAR);
    super.onDead();
  }
}
