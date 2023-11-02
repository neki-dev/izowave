import Phaser from 'phaser';

import { WORLD_DEPTH_GRAPHIC } from '~const/world';
import { DIFFICULTY } from '~const/world/difficulty';
import {
  ENEMY_PATH_BREAKPOINT, ENEMY_SIZE_PARAMS, ENEMY_TEXTURE_SIZE,
} from '~const/world/entities/enemy';
import { Building } from '~entity/building';
import { NPC } from '~entity/npc';
import { Assets } from '~lib/assets';
import { Environment } from '~lib/environment';
import { progressionLinear, progressionQuadratic } from '~lib/progression';
import { Effect, Particles } from '~scene/world/effects';
import { GameFlag, GameSettings } from '~type/game';
import { InterfaceFont } from '~type/interface';
import { IWorld } from '~type/world';
import { EffectTexture, ParticlesTexture } from '~type/world/effects';
import { EntityType } from '~type/world/entities';
import {
  IEnemyTarget, EnemyData, EnemyTexture, IEnemy, EnemyAudio,
} from '~type/world/entities/npc/enemy';
import { PlayerEvents, PlayerSuperskill } from '~type/world/entities/player';
import { PositionAtWorld, TileType } from '~type/world/level';

Assets.RegisterAudio(EnemyAudio);
Assets.RegisterSprites(EnemyTexture, (texture) => (
  ENEMY_SIZE_PARAMS[ENEMY_TEXTURE_SIZE[texture]]
));

export class Enemy extends NPC implements IEnemy {
  private _damage: number;

  public get damage() { return this._damage; }

  private set damage(v) { this._damage = v; }

  private might: number;

  private damageTimer: Nullable<Phaser.Time.TimerEvent> = null;

  private score: number;

  private isOverlapTarget: boolean = false;

  private damageLabel: Nullable<Phaser.GameObjects.Text> = null;

  private damageLabelTween: Nullable<Phaser.Tweens.Tween> = null;

  private spawnEffect: boolean;

  constructor(scene: IWorld, {
    texture, score, multipliers, spawnEffect = true, ...data
  }: EnemyData) {
    super(scene, {
      ...data,
      texture,
      pathFindTriggerDistance: ENEMY_PATH_BREAKPOINT,
      seesInvisibleTarget: false,
      health: progressionQuadratic({
        defaultValue: DIFFICULTY.ENEMY_HEALTH
          * multipliers.health
          * scene.game.getDifficultyMultiplier(),
        scale: DIFFICULTY.ENEMY_HEALTH_GROWTH,
        level: scene.wave.number,
        retardationLevel: DIFFICULTY.ENEMY_HEALTH_GROWTH_RETARDATION_LEVEL,
      }),
      speed: progressionLinear({
        defaultValue: DIFFICULTY.ENEMY_SPEED * multipliers.speed,
        scale: DIFFICULTY.ENEMY_SPEED_GROWTH,
        level: scene.wave.number,
        maxLevel: DIFFICULTY.ENEMY_SPEED_GROWTH_MAX_LEVEL,
      }),
      body: {
        ...ENEMY_SIZE_PARAMS[ENEMY_TEXTURE_SIZE[texture]],
        type: 'circle',
      },
    });
    scene.addEntityToGroup(this, EntityType.ENEMY);

    this.damage = progressionLinear({
      defaultValue: DIFFICULTY.ENEMY_DAMAGE
        * multipliers.damage
        * scene.game.getDifficultyMultiplier(),
      scale: DIFFICULTY.ENEMY_DAMAGE_GROWTH,
      level: scene.wave.number,
    });
    this.spawnEffect = spawnEffect;
    this.score = score ?? 1;
    this.might = (
      multipliers.health
      + multipliers.damage
      + multipliers.speed
    ) / 3;

    this.addDamageLabel();
    this.addIndicator('health', {
      color: 0xff3d3d,
      value: () => this.live.health / this.live.maxHealth,
    });

    this.handlePlayerSuperskill();

    if (this.spawnEffect) {
      this.addSpawnEffect();
    }

    const frost = this.scene.player.activeSuperskills[PlayerSuperskill.FROST];

    if (frost) {
      this.freeze(frost.getRemaining(), true);
    }

    this.setTilesCollision([TileType.BUILDING], (tile) => {
      if (tile instanceof Building) {
        const shield = this.scene.player.activeSuperskills[PlayerSuperskill.SHIELD];

        if (!shield) {
          this.attack(tile);
        }
      }
    });

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.removeDamageLabel();
      if (this.damageTimer) {
        this.scene.removeProgression(this.damageTimer);
      }
    });
  }

  public update() {
    super.update();

    if (this.isOverlapTarget) {
      this.setVelocity(0, 0);
    } else if (this.isPathPassed) {
      this.moveTo(this.scene.player.getBottomFace());
    }

    this.isOverlapTarget = false;
  }

  public overlapTarget() {
    this.isOverlapTarget = true;
  }

  public attack(target: IEnemyTarget) {
    if (this.isFreezed() || target.live.isDead()) {
      return;
    }

    this.freeze(1000);

    target.live.damage(this.damage);
  }

  private addDamageLabel() {
    this.damageLabel = this.scene.add.text(0, 0, '', {
      fontSize: '6px',
      fontFamily: InterfaceFont.PIXEL_TEXT,
      align: 'center',
      color: '#fff',
      resolution: 2,
    });

    this.damageLabel.setOrigin(0.5, 0.5);
    this.damageLabel.setDepth(WORLD_DEPTH_GRAPHIC);
    this.damageLabel.setActive(false);
    this.damageLabel.setVisible(false);
  }

  private updateDamageLabel(amount: number) {
    if (!this.damageLabel) {
      return;
    }

    this.damageLabel.setText(amount.toString());
    this.damageLabel.setPosition(this.body.center.x, this.body.center.y);
    this.damageLabel.setActive(true);
    this.damageLabel.setVisible(true);
    this.damageLabel.setAlpha(1.0);

    if (this.damageLabelTween) {
      this.damageLabelTween.reset();
    } else {
      this.damageLabelTween = this.scene.tweens.add({
        targets: this.damageLabel,
        alpha: { from: 1.0, to: 0.0 },
        duration: 1000,
        delay: 250,
        onComplete: () => {
          if (this.damageLabel) {
            if (this.active) {
              this.damageLabel.setActive(false);
              this.damageLabel.setVisible(false);
            } else {
              this.damageLabel.destroy();
              this.damageLabel = null;
            }
          }
          if (this.damageLabelTween) {
            this.damageLabelTween.destroy();
            this.damageLabelTween = null;
          }
        },
      });
    }
  }

  private removeDamageLabel() {
    if (this.damageLabel && !this.damageLabelTween) {
      this.damageLabel.destroy();
      this.damageLabel = null;
    }
  }

  public onDamage(amount: number) {
    if (this.scene.game.isSettingEnabled(GameSettings.SHOW_DAMAGE)) {
      this.updateDamageLabel(amount);
    }

    super.onDamage(amount);
  }

  public onDead() {
    const experience = progressionQuadratic({
      defaultValue: DIFFICULTY.ENEMY_KILL_EXPERIENCE * this.might,
      scale: DIFFICULTY.ENEMY_KILL_EXPERIENCE_GROWTH,
      level: this.scene.wave.number,
    });

    this.scene.player.giveExperience(experience);
    this.scene.player.giveScore(this.score);
    this.scene.player.incrementKills();

    this.addBloodEffect();

    super.onDead();
  }

  private addOngoingDamage(damage: number, duration: number) {
    this.damageTimer = this.scene.addProgression({
      duration,
      onProgress: (left: number, total: number) => {
        this.live.damage(damage / total);
      },
      onComplete: () => {
        this.damageTimer = null;
      },
    });
  }

  private addFireEffect(duration: number) {
    if (!this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      return;
    }

    const lifespan = this.displayWidth * 25;

    new Particles(this, {
      key: 'fire',
      texture: ParticlesTexture.BIT_SOFT,
      params: {
        follow: this,
        followOffset: this.getBodyOffset(),
        duration,
        color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
        colorEase: 'quad.out',
        lifespan: { min: lifespan / 2, max: lifespan },
        alpha: { start: 1.0, end: 0.0 },
        angle: { min: -100, max: -80 },
        scale: {
          start: this.displayWidth / 20,
          end: 1.0,
          ease: 'sine.out',
        },
        speed: 40,
        advance: 10,
      },
    });
  }

  private addBloodEffect() {
    if (
      !this.currentBiome?.solid
      || !this.scene.game.isSettingEnabled(GameSettings.EFFECTS)
      || !Environment.GetFlag(GameFlag.BLOOD)
    ) {
      return;
    }

    const position = this.getBottomFace();
    const effect = new Effect(this.scene, {
      texture: EffectTexture.BLOOD,
      position,
      staticFrame: Phaser.Math.Between(0, 3),
    });

    effect.setAlpha(0.8);

    this.scene.level.effectsOnGround.push(effect);
  }

  private addSpawnEffect() {
    this.freeze(750);

    setTimeout(() => {
      const originAlpha = this.alpha;

      this.container.setAlpha(0.0);
      this.setAlpha(0.0);
      this.scene.tweens.add({
        targets: this,
        alpha: originAlpha,
        duration: 750,
        onComplete: () => {
          this.container.setAlpha(originAlpha);
        },
      });
    }, 0);

    if (this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      // Native body.center isn't working at current state
      const size = ENEMY_SIZE_PARAMS[ENEMY_TEXTURE_SIZE[this.texture.key as EnemyTexture]];
      const position: PositionAtWorld = {
        x: this.x,
        y: this.y - size.height / 2,
      };
      const duration = Math.min(700, this.displayHeight * 17);
      const scale = this.displayWidth / 16;

      new Particles(this, {
        key: 'spawn',
        texture: ParticlesTexture.BIT_SOFT,
        position,
        params: {
          duration,
          lifespan: { min: duration / 2, max: duration },
          scale: { start: scale, end: scale / 2 },
          alpha: { start: 1.0, end: 0.0 },
          speed: 40,
          quantity: 1,
          tint: 0x000000,
        },
      });
    }
  }

  private handlePlayerSuperskill() {
    const handler = (type: PlayerSuperskill) => {
      const superskill = this.scene.player.activeSuperskills[type];

      if (!superskill) {
        return;
      }

      const duration = superskill.getRemaining();

      switch (type) {
        case PlayerSuperskill.FROST: {
          this.freeze(duration, true);
          break;
        }
        case PlayerSuperskill.FIRE: {
          const damage = progressionQuadratic({
            defaultValue: DIFFICULTY.ENEMY_HEALTH,
            scale: DIFFICULTY.ENEMY_HEALTH_GROWTH,
            level: this.scene.wave.number,
            retardationLevel: DIFFICULTY.ENEMY_HEALTH_GROWTH_RETARDATION_LEVEL,
          }) * DIFFICULTY.SUPERSKILL_FIRE_FORCE;

          this.addFireEffect(duration);
          this.addOngoingDamage(damage, duration);
          break;
        }
      }
    };

    this.scene.events.on(PlayerEvents.USE_SUPERSKILL, handler);
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.events.off(PlayerEvents.USE_SUPERSKILL, handler);
    });
  }
}
