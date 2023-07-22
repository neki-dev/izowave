import Phaser from 'phaser';

import { WORLD_FEATURES } from '~const/world';
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
import { GameFlag, GameSettings } from '~type/game';
import { IWorld, WorldEvents, WorldFeature } from '~type/world';
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

  private damageTimer: Nullable<Phaser.Time.TimerEvent> = null;

  constructor(scene: IWorld, {
    positionAtMatrix, texture, multipliers = {},
  }: EnemyData) {
    super(scene, {
      texture,
      positionAtMatrix,
      frameRate: ENEMY_TEXTURE_META[texture].frameRate,
      pathFindTriggerDistance: ENEMY_PATH_BREAKPOINT,
      health: progressionQuadratic(
        DIFFICULTY.ENEMY_HEALTH
          * (multipliers.health ?? 1.0)
          * scene.game.getDifficultyMultiplier(),
        DIFFICULTY.ENEMY_HEALTH_GROWTH,
        scene.wave.number,
      ),
      speed: progressionQuadratic(
        DIFFICULTY.ENEMY_SPEED * (multipliers.speed ?? 1.0),
        DIFFICULTY.ENEMY_SPEED_GROWTH,
        scene.wave.number,
      ),
    });
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
    this.addWorldFeatureHandler();

    this.setTilesCollision([TileType.BUILDING], (tile) => {
      if (tile instanceof Building) {
        const shield = this.scene.activeFeatures[WorldFeature.SHIELD];

        if (!shield) {
          this.attack(tile);
        }
      }
    });

    this.scene.physics.add.collider(
      this,
      this.scene.getEntitiesGroup(EntityType.NPC),
    );

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.damageTimer) {
        this.damageTimer.destroy();
      }
    });
  }

  public update() {
    super.update();

    if (this.isPathPassed) {
      this.moveTo(this.scene.player.getPositionOnGround());
    }
  }

  public attack(target: IEnemyTarget) {
    if (this.isFreezed() || target.live.isDead()) {
      return;
    }

    target.live.damage(this.damage);

    this.freeze(1000);
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

  private addOngoingDamage(damage: number, duration: number) {
    const delay = 100;
    const momentDamage = damage / (duration / delay);

    this.damageTimer = this.scene.time.addEvent({
      delay,
      repeat: duration / delay,
      callback: () => {
        this.live.damage(momentDamage);

        if (this.damageTimer?.repeatCount === 0) {
          this.damageTimer.destroy();
          this.damageTimer = null;
        }
      },
    });
  }

  private addFireEffect(duration: number) {
    if (!this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      return;
    }

    new Particles(this, {
      key: 'fire',
      texture: ParticlesTexture.GLOW,
      params: {
        follow: this,
        followOffset: this.getBodyOffset(),
        duration,
        color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
        colorEase: 'quad.out',
        lifespan: this.displayWidth * 25,
        angle: {
          min: -100,
          max: -80,
        },
        scale: {
          start: (this.displayWidth * 1.25) / 100,
          end: 0,
          ease: 'sine.out',
        },
        speed: 80,
        advance: 200,
        blendMode: 'ADD',
      },
    });
  }

  private addBloodEffect() {
    if (
      !this.currentBiome?.solid
      || !this.scene.game.isSettingEnabled(GameSettings.EFFECTS)
      || this.scene.game.isFlagEnabled(GameFlag.NO_BLOOD)
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

    this.scene.level.effectsOnGround.push(effect);
  }

  private addSpawnEffect() {
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

    this.freeze(750);
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

  private addWorldFeatureHandler() {
    const handler = (type: WorldFeature) => {
      const { duration } = WORLD_FEATURES[type];

      switch (type) {
        case WorldFeature.FROST: {
          this.freeze(duration, true);
          break;
        }
        case WorldFeature.FIRE: {
          this.addFireEffect(duration);
          this.addOngoingDamage(this.live.maxHealth * 0.5, duration);
          break;
        }
      }
    };

    this.scene.events.on(WorldEvents.USE_FEATURE, handler);
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.events.off(WorldEvents.USE_FEATURE, handler);
    });
  }
}

registerSpriteAssets(EnemyTexture, (texture) => ENEMY_TEXTURE_META[texture].size);
