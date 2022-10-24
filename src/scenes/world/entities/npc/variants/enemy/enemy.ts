import Phaser from 'phaser';
import { DIFFICULTY } from '~const/difficulty';
import { ENEMY_PATH_BREAKPOINT, ENEMY_TEXTURE_META } from '~const/enemy';
import { Building } from '~entity/building';
import { NPC } from '~entity/npc';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { calcGrowth } from '~lib/utils';
import { World } from '~scene/world';
import { WorldEffect } from '~type/world/effects';
import {
  EnemyAttackTarget, EnemyAudio, EnemyData, EnemyTexture,
} from '~type/world/entities/enemy';
import { TileType } from '~type/world/level';

export class Enemy extends NPC {
  /**
   * Player experience multiplier per kill this enemy.
   */
  private experienceMultiply: number;

  /**
   * Timer for freeze effect.
   */
  private timerTint: Nullable<Phaser.Time.TimerEvent> = null;

  /**
   * Enemy constructor.
   */
  constructor(scene: World, {
    positionAtMatrix, texture, health, damage, speed,
    scale = 1.0, experienceMultiply = 1.0,
  }: EnemyData) {
    super(scene, {
      texture,
      positionAtMatrix,
      frameRate: ENEMY_TEXTURE_META[texture].frameRate,
      pathBreakpoint: ENEMY_PATH_BREAKPOINT,
      health: calcGrowth(
        health * scene.difficulty,
        DIFFICULTY.ENEMY_HEALTH_GROWTH,
        scene.wave.number,
      ),
      damage: calcGrowth(
        damage * scene.difficulty,
        DIFFICULTY.ENEMY_DAMAGE_GROWTH,
        scene.wave.number,
      ),
      speed: calcGrowth(
        speed,
        DIFFICULTY.ENEMY_SPEED_GROWTH,
        scene.wave.number,
      ),
    });
    scene.add.existing(this);
    scene.npc.add(this);
    scene.enemies.add(this);

    this.experienceMultiply = experienceMultiply;

    // Configure physics
    const offset = scale * 2;

    this.body.setCircle((this.width / 2) - offset, offset, offset);
    this.setScale(scale);

    if (this.visible) {
      this.addSpawnEffect();
    }

    // Add events callbacks
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.timerTint) {
        this.timerTint.destroy();
      }
    });
  }

  /**
   * Event update.
   */
  public update() {
    super.update();

    if (this.pathComplete) {
      this.moveTo(this.scene.player);
    }
  }

  /**
   * Pause enemy and add effects.
   *
   * @param duration - Pause duration
   */
  public freeze(duration: number) {
    const finalDuration = duration / this.scale;

    this.calm(finalDuration);

    if (!this.visible) {
      return;
    }

    this.scene.effects.emit(WorldEffect.GLOW, this, {
      follow: this,
      lifespan: { min: 100, max: 150 },
      scale: { start: 0.2, end: 0.1 },
      speed: 80,
    }, 250);

    if (this.timerTint) {
      this.timerTint.elapsed = 0;
    } else {
      this.setTint(0x00a8ff);
      this.timerTint = this.scene.time.delayedCall(finalDuration, () => {
        this.clearTint();
        this.timerTint = null;
      });
    }
  }

  /**
   * Give target damage.
   *
   * @param target - Target
   */
  public attack(target: EnemyAttackTarget) {
    if (this.isCalm() || target.live.isDead()) {
      return;
    }

    if (this.scene.sound.getAll(EnemyAudio.ATTACK).length < 3) {
      this.scene.sound.play(EnemyAudio.ATTACK);
    }

    target.live.damage(this.damage);

    this.calm(1000);
  }

  /**
   * Get and handle collides.
   */
  public handleCollide(direction: number): boolean {
    const tile = this.getCollide(direction, [TileType.BUILDING], false);

    if (tile instanceof Building) {
      this.attack(tile);
    }

    return Boolean(tile);
  }

  /**
   * Dead event.
   */
  public onDead() {
    super.onDead();

    const { player, wave } = this.scene;
    const experience = calcGrowth(
      DIFFICULTY.ENEMY_KILL_EXPERIENCE * this.experienceMultiply,
      DIFFICULTY.ENEMY_KILL_EXPERIENCE_GROWTH,
      wave.number,
    );

    player.giveExperience(experience);
    player.incrementKills();
  }

  /**
   * Add spawn effect.
   */
  private addSpawnEffect() {
    const originalScale = this.scale;

    this.calm(750);

    this.container.setAlpha(0.0);
    this.setScale(0.1);
    this.scene.tweens.add({
      targets: this,
      scale: originalScale,
      duration: 750,
      onComplete: () => {
        this.container.setAlpha(1.0);
      },
    });

    this.scene.effects.emit(WorldEffect.GLOW, this, {
      x: this.x,
      y: this.y,
      lifespan: { min: 150, max: 250 },
      scale: { start: 0.25, end: 0.0 },
      speed: 100,
      quantity: 2,
      tint: 0x000,
    }, 500);
  }
}

registerAudioAssets(EnemyAudio);
registerSpriteAssets(EnemyTexture, (texture: EnemyTexture) => ({
  width: ENEMY_TEXTURE_META[texture].size,
  height: ENEMY_TEXTURE_META[texture].size,
}));
