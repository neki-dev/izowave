import Phaser from 'phaser';

import { NPC } from '..';
import { Building } from '../../building';
import { PlayerSuperskill, PlayerEvent } from '../../player/types';
import { EntityType } from '../../types';

import { ENEMY_SIZE_PARAMS, ENEMY_TEXTURE_SIZE, ENEMY_PATH_BREAKPOINT, ENEMY_FIRE_DAMAGE_FORCE, ENEMY_HEALTH, ENEMY_HEALTH_GROWTH, ENEMY_HEALTH_GROWTH_RETARDATION_LEVEL, ENEMY_SPEED, ENEMY_SPEED_GROWTH, ENEMY_SPEED_GROWTH_MAX_LEVEL, ENEMY_DAMAGE, ENEMY_DAMAGE_GROWTH, ENEMY_KILL_EXPERIENCE, ENEMY_KILL_EXPERIENCE_GROWTH } from './const';
import type { EnemyData, IEnemyTarget } from './types';

import { progressionQuadratic, progressionLinear } from '~core/progression';
import type { WorldScene } from '~game/scenes/world';
import { GameSettings } from '~game/types';
import { WORLD_DEPTH_GRAPHIC } from '~scene/world/const';
import { TileType } from '~scene/world/level/types';

import './resources';

export abstract class Enemy extends NPC {
  private _damage: number;
  public get damage() { return this._damage; }
  private set damage(v) { this._damage = v; }

  private damageTimer: Nullable<Phaser.Time.TimerEvent> = null;

  private damageLabel: Nullable<Phaser.GameObjects.Text> = null;

  private damageLabelTween: Nullable<Phaser.Tweens.Tween> = null;

  private score: number;

  private isOverlapTarget: boolean = false;

  private might: number;

  constructor(scene: WorldScene, {
    texture, score, multipliers, ...data
  }: EnemyData) {
    super(scene, {
      ...data,
      texture,
      pathFindTriggerDistance: ENEMY_PATH_BREAKPOINT,
      seesInvisibleTarget: false,
      health: progressionQuadratic({
        defaultValue: ENEMY_HEALTH
          * multipliers.health
          * scene.game.getDifficultyMultiplier(),
        scale: ENEMY_HEALTH_GROWTH,
        level: scene.wave.number,
        retardationLevel: ENEMY_HEALTH_GROWTH_RETARDATION_LEVEL,
      }),
      speed: progressionLinear({
        defaultValue: ENEMY_SPEED * multipliers.speed,
        scale: ENEMY_SPEED_GROWTH,
        level: scene.wave.number,
        maxLevel: ENEMY_SPEED_GROWTH_MAX_LEVEL,
      }),
      body: {
        ...ENEMY_SIZE_PARAMS[ENEMY_TEXTURE_SIZE[texture]],
        type: 'circle',
      },
    });
    scene.addEntityToGroup(this, EntityType.ENEMY);

    this.damage = progressionLinear({
      defaultValue: ENEMY_DAMAGE
        * multipliers.damage
        * scene.game.getDifficultyMultiplier(),
      scale: ENEMY_DAMAGE_GROWTH,
      level: scene.wave.number,
    });
    this.score = score ?? 1;
    this.might = multipliers.might;

    this.addDamageLabel();
    this.addIndicator('health', {
      color: 0xff3d3d,
      value: () => this.live.health / this.live.maxHealth,
    });

    this.handlePlayerSuperskill();

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

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.removeDamageLabel();
      if (this.damageTimer) {
        this.scene.removeProgression(this.damageTimer);
      }
    });
  }

  public update() {
    super.update();

    try {
      if (this.isOverlapTarget) {
        this.setVelocity(0, 0);
      } else if (this.pathPassed) {
        this.moveTo(this.scene.player.getBottomEdgePosition());
      }

      this.isOverlapTarget = false;
    } catch (error) {
      console.warn('Failed to update enemy', error as TypeError);
    }
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
      fontFamily: 'PixelText',
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

  protected onDamage(amount: number) {
    if (this.scene.game.isSettingEnabled(GameSettings.SHOW_DAMAGE)) {
      this.updateDamageLabel(amount);
    }

    super.onDamage(amount);
  }

  protected onDead() {
    const experience = progressionLinear({
      defaultValue: ENEMY_KILL_EXPERIENCE * this.might,
      scale: ENEMY_KILL_EXPERIENCE_GROWTH,
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

  private addBloodEffect() {
    if (!this.currentBiome?.solid) {
      return;
    }

    const position = this.getBottomEdgePosition();
    const effect = this.scene.fx.createBloodStainEffect(position);

    if (effect) {
      effect.setAlpha(0.8);
      this.scene.level.effectsOnGround.push(effect);
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
            defaultValue: ENEMY_HEALTH,
            scale: ENEMY_HEALTH_GROWTH,
            level: this.scene.wave.number,
            retardationLevel: ENEMY_HEALTH_GROWTH_RETARDATION_LEVEL,
          }) * ENEMY_FIRE_DAMAGE_FORCE;

          this.scene.fx.createLongFireEffect(this, { duration });
          this.addOngoingDamage(damage, duration);
          break;
        }
      }
    };

    this.scene.events.on(PlayerEvent.USE_SUPERSKILL, handler);
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.events.off(PlayerEvent.USE_SUPERSKILL, handler);
    });
  }
}
