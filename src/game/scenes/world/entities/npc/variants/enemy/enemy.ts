import Phaser from 'phaser';

import { DIFFICULTY } from '~const/world/difficulty';
import {
  ENEMY_PATH_BREAKPOINT,
  ENEMY_TEXTURE_META,
} from '~const/world/entities/enemy';
import { LEVEL_TILE_SIZE } from '~const/world/level';
import { Building } from '~entity/building';
import { NPC } from '~entity/npc';
import { registerSpriteAssets } from '~lib/assets';
import { progressionQuadratic } from '~lib/utils';
import { Effect, Particles } from '~scene/world/effects';
import { Level } from '~scene/world/level';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { EffectTexture, ParticlesTexture } from '~type/world/effects';
import { EntityType } from '~type/world/entities';
import {
  IEnemyTarget,
  EnemyData,
  EnemyTexture,
  IEnemy,
} from '~type/world/entities/npc/enemy';
import { TileType } from '~type/world/level';

export class Enemy extends NPC implements IEnemy {
  private damage: number;

  private might: number;

  private freezeTimer: Nullable<Phaser.Time.TimerEvent> = null;

  constructor(scene: IWorld, {
    positionAtMatrix, texture, multipliers = {},
  }: EnemyData) {
    super(scene, {
      texture,
      positionAtMatrix,
      frameRate: ENEMY_TEXTURE_META[texture].frameRate,
      pathFindTriggerDistance: ENEMY_PATH_BREAKPOINT,
      health: progressionQuadratic(
        DIFFICULTY.ENEMY_HEALTH * (multipliers.health ?? 1.0) * scene.game.getDifficultyMultiplier(),
        DIFFICULTY.ENEMY_HEALTH_GROWTH,
        scene.wave.number,
      ),
      speed: progressionQuadratic(
        DIFFICULTY.ENEMY_SPEED * (multipliers.speed ?? 1.0),
        DIFFICULTY.ENEMY_SPEED_GROWTH,
        scene.wave.number,
      ),
    });
    scene.add.existing(this);
    scene.addEntity(EntityType.ENEMY, this);

    this.damage = progressionQuadratic(
      DIFFICULTY.ENEMY_DAMAGE
        * (multipliers.damage ?? 1.0)
        * scene.game.getDifficultyMultiplier(),
      DIFFICULTY.ENEMY_DAMAGE_GROWTH,
      scene.wave.number,
    );
    this.gamut = ENEMY_TEXTURE_META[texture].size.gamut;
    this.might = (
      (multipliers.health ?? 1.0)
      + (multipliers.damage ?? 1.0)
      + (multipliers.speed ?? 1.0)
    ) / 3;

    this.body.setCircle((this.width * 0.5) - 2);
    this.body.setOffset(2, 2);

    this.addHealthIndicator(0xdb2323, true);
    this.addSpawnEffect();

    this.setTilesCollision([TileType.BUILDING], (tile) => {
      if (tile instanceof Building) {
        this.attack(tile);
      }
    });

    this.scene.physics.add.collider(
      this,
      this.scene.getEntitiesGroup(EntityType.NPC),
    );

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.freezeTimer) {
        this.freezeTimer.destroy();
      }
    });
  }

  public update() {
    super.update();

    if (this.isPathPassed) {
      this.moveTo(this.scene.player.getPositionOnGround());
    }
  }

  public freeze(duration: number) {
    const finalDuration = duration / this.scale;

    this.calmDown(finalDuration);

    if (!this.visible) {
      return;
    }

    if (this.freezeTimer) {
      this.freezeTimer.elapsed = 0;
    } else {
      this.setTint(0x00a8ff);
      this.freezeTimer = this.scene.time.delayedCall(finalDuration, () => {
        this.clearTint();
        this.freezeTimer = null;
      });
    }

    if (!this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      return;
    }

    new Particles(this, {
      key: 'freeze',
      texture: ParticlesTexture.GLOW,
      params: {
        duration: 200,
        follow: this,
        followOffset: this.getBodyOffset(),
        lifespan: { min: 100, max: 150 },
        scale: 0.2,
        speed: 80,
        tint: 0x00ddff,
      },
    });
  }

  public attack(target: IEnemyTarget) {
    if (this.isCalmed() || target.live.isDead()) {
      return;
    }

    target.live.damage(this.damage);

    this.calmDown(1000);
  }

  public onDead() {
    const experience = progressionQuadratic(
      DIFFICULTY.ENEMY_KILL_EXPERIENCE * this.might,
      DIFFICULTY.ENEMY_KILL_EXPERIENCE_GROWTH,
      this.scene.wave.number,
    );

    this.scene.player.giveExperience(experience);
    this.scene.player.incrementKills();

    this.addBloodEffect();

    super.onDead();
  }

  private addBloodEffect() {
    if (
      !this.currentGroundTile?.biome?.solid
      || !this.scene.game.isSettingEnabled(GameSettings.EFFECTS)
    ) {
      return;
    }

    const position = this.getPositionOnGround();
    const effect = new Effect(this.scene, {
      texture: EffectTexture.BLOOD,
      position,
      staticFrame: Phaser.Math.Between(0, 3),
      depth: Level.GetDepth(position.y, 0, LEVEL_TILE_SIZE.height),
    });

    this.currentGroundTile.mapEffects?.push(effect);
  }

  private addSpawnEffect() {
    if (!this.visible) {
      return;
    }

    if (this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      new Particles(this, {
        key: 'spawn',
        texture: ParticlesTexture.GLOW,
        positionAtWorld: this.body.center,
        params: {
          duration: 400,
          lifespan: { min: 150, max: 250 },
          scale: { start: 0.25, end: 0.0 },
          speed: 100,
          quantity: 2,
          tint: 0x00000,
        },
      });
    }

    const originalScale = this.scale;

    this.calmDown(750);
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
  }
}

registerSpriteAssets(EnemyTexture, (texture) => ENEMY_TEXTURE_META[texture].size);
