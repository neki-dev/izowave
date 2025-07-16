import Phaser from 'phaser';

import { Sprite } from '..';
import type { WorldScene } from '../..';
import type { Particles } from '../../fx-manager/particles';
import { BuildingVariant } from '../building/types';
import { BUILDING_GENERATOR_COST } from '../building/variants/generator/const';
import { Crystal } from '../crystal';
import type { Enemy } from '../npc/enemy';
import type { IEnemyTarget } from '../npc/enemy/types';
import { EntityType } from '../types';

import {
  PLAYER_TILE_SIZE,
  PLAYER_SKILLS,
  PLAYER_MOVEMENT_KEYS,
  PLAYER_MAX_SKILL_LEVEL,
  PLAYER_HEALTH,
  PLAYER_HEALTH_GROWTH,
  PLAYER_SPEED,
  PLAYER_SPEED_GROWTH,
  PLAYER_STAMINA,
  PLAYER_STAMINA_GROWTH,
  PLAYER_EXPERIENCE_TO_UPGRADE_GROWTH,
  PLAYER_START_RESOURCES,
  PLAYER_SUPERSKILL_COST_GROWTH,
  PLAYER_SUPERSKILL_UNLOCK_PER_WAVE,
  PLAYER_SUPERSKILLS,
} from './const';
import type { PlayerData, PlayerSavePayload } from './types';
import {
  PlayerTexture,
  PlayerAudio,
  PlayerSkill,
  PlayerSuperskill,
  MovementDirection,
  PlayerEvent,
} from './types';

import { isPositionsEqual, getClosestByIsometricDistance } from '~core/dimension';
import { progressionLinear, progressionQuadratic } from '~core/progression';
import { Tutorial } from '~core/tutorial';
import { TutorialStep } from '~core/tutorial/types';
import { Utils } from '~core/utils';
import { GameSettings, GameEvent } from '~game/types';
import { Level } from '~scene/world/level';
import { LEVEL_MAP_PERSPECTIVE } from '~scene/world/level/const';
import type { PositionAtMatrix, PositionAtWorld } from '~scene/world/level/types';
import { TileType } from '~scene/world/level/types';
import { WorldMode, WorldEvent } from '~scene/world/types';
import { WaveEvent } from '~scene/world/wave/types';

import './resources';

export class Player extends Sprite implements IEnemyTarget {
  private _experience: number = 0;
  public get experience() { return this._experience; }
  private set experience(v) { this._experience = v; }

  private _resources: number = PLAYER_START_RESOURCES;
  public get resources() { return this._resources; }
  private set resources(v) { this._resources = v; }

  private _score: number = 0;
  public get score() { return this._score; }
  private set score(v) { this._score = v; }

  private _kills: number = 0;
  public get kills() { return this._kills; }
  private set kills(v) { this._kills = v; }

  private _lastVisiblePosition: PositionAtMatrix;
  public get lastVisiblePosition() { return this._lastVisiblePosition; }
  private set lastVisiblePosition(v) { this._lastVisiblePosition = v; }

  private _upgradeLevel: Record<PlayerSkill, number> = {
    [PlayerSkill.MAX_HEALTH]: 1,
    [PlayerSkill.SPEED]: 1,
    [PlayerSkill.STAMINA]: 1,
    [PlayerSkill.BUILD_SPEED]: 1,
    [PlayerSkill.ATTACK_DAMAGE]: 1,
    [PlayerSkill.ATTACK_DISTANCE]: 1,
    [PlayerSkill.ATTACK_SPEED]: 1,
  };
  public get upgradeLevel() { return this._upgradeLevel; }
  private set upgradeLevel(v) { this._upgradeLevel = v; }

  private movementTarget: Nullable<number> = null;

  private movementAngle: Nullable<number> = null;

  private dustEffect: Nullable<Particles> = null;

  private _unlockedSuperskills: Partial<Record<PlayerSuperskill, boolean>> = {};
  public get unlockedSuperskills() { return this._unlockedSuperskills; }
  private set unlockedSuperskills(v) { this._unlockedSuperskills = v; }

  private _activeSuperskills: Partial<Record<PlayerSuperskill, Phaser.Time.TimerEvent>> = {};
  public get activeSuperskills() { return this._activeSuperskills; }
  private set activeSuperskills(v) { this._activeSuperskills = v; }

  private pathToCrystal: Nullable<Phaser.GameObjects.Graphics> = null;

  private pathToCrystalFindingTask: Nullable<string> = null;

  private pathToCrystalEffectIndex: number = 0;

  private pathToCrystalEffectTimestamp: number = 1;

  private currentPathToCrystal: Nullable<PositionAtWorld[]> = null;

  private staminaMax: number = 100;

  private stamina: number = 100;

  private staminaTimestamp: number = 0;

  constructor(scene: WorldScene, data: PlayerData) {
    super(scene, {
      ...data,
      texture: PlayerTexture.PLAYER,
      health: PLAYER_HEALTH,
      speed: PLAYER_SPEED,
      body: {
        type: 'rect',
        width: 14,
        height: 26,
        gamut: PLAYER_TILE_SIZE.gamut,
      },
    });
    scene.add.existing(this);

    if (this.scene.game.isDesktop()) {
      this.handleMovementByKeyboard();
    }

    this.handleToggleEffects();
    this.handleTogglePathToCrystal();

    this.registerAnimations();

    this.addDustEffect();
    this.addIndicator('health', {
      color: 0x96ff0d,
      value: () => this.live.health / this.live.maxHealth,
    });

    this.setTilesGroundCollision(true);
    this.setTilesCollision([
      TileType.MAP,
      TileType.BUILDING,
      TileType.CRYSTAL,
    ], (tile) => {
      if (tile instanceof Crystal) {
        tile.pickup();
        this.currentPathToCrystal = null;
      }
    });

    this.addCollider(EntityType.ENEMY, 'collider', (enemy: Enemy) => {
      if (!this.isInvisible()) {
        enemy.attack(this);
      }
    });

    this.addCollider(EntityType.ENEMY, 'overlap', (enemy: Enemy) => {
      enemy.overlapTarget();
    });

    this.scene.wave.on(WaveEvent.COMPLETE, this.onWaveComplete.bind(this));
  }

  public update() {
    super.update();

    try {
      this.findPathToCrystal();
      this.drawPathToCrystal();

      if (!this.live.isDead()) {
        this.dustEffect?.emitter.setDepth(this.depth - 1);

        this.updateMovement();
        this.updateVelocity();
        this.updateVisible();
        this.updateStamina();
      }
    } catch (error) {
      console.warn('Failed to update player', error as TypeError);
    }
  }

  private updateVisible() {
    if (this.isInvisible()) {
      if (this.alpha === 1.0) {
        this.alpha = 0.5;
      }
    } else {
      this.lastVisiblePosition = this.positionAtMatrix;
      if (this.alpha !== 1.0) {
        this.alpha = 1.0;
      }
    }
  }

  private isInvisible() {
    return this.activeSuperskills[PlayerSuperskill.INVISIBLE];
  }

  private updateStamina() {
    // Date.now used instead of world.getTime to
    // right culculate timestamp on tutorial pause
    const now = Date.now();
    const nextTimestamp = () => now + (50 / this.scene.getTimeScale());

    if (this.movementAngle === null) {
      if (this.stamina < this.staminaMax && this.staminaTimestamp < now) {
        const growth = this.staminaMax * 0.04 * Math.max(0.1, this.stamina / this.staminaMax);

        this.stamina = Math.min(this.staminaMax, this.stamina + growth);
        this.staminaTimestamp = nextTimestamp();
      }
    } else if (this.stamina > 0.0 && this.staminaTimestamp < now) {
      this.stamina = Math.max(0.0, this.stamina - 0.6);
      this.staminaTimestamp = nextTimestamp();

      if (this.stamina === 0.0) {
        this.updateMovementAnimation();
        this.scene.sound.stopByKey(PlayerAudio.WALK);
        this.scene.fx.playSound(PlayerAudio.WALK, {
          loop: true,
          rate: 1.4,
        });
      }

      if (this.stamina < this.staminaMax && !this.getIndicator('stamina')) {
        this.addIndicator('stamina', {
          color: 0xe7e4f5,
          value: () => this.stamina / this.staminaMax,
          destroyIf: (value: number) => value >= 1.0,
        });
      }
    }
  }

  public giveScore(amount: number) {
    if (this.live.isDead()) {
      return;
    }

    this.score += amount;

    this.emit(PlayerEvent.UPDATE_SCORE, this.score);
  }

  public giveExperience(amount: number) {
    if (this.live.isDead()) {
      return;
    }

    this.experience += Math.round(amount / this.scene.game.getDifficultyMultiplier());

    this.emit(PlayerEvent.UPDATE_EXPERIENCE, this.experience);
  }

  private takeExperience(amount: number) {
    this.experience -= amount;

    this.emit(PlayerEvent.UPDATE_EXPERIENCE, this.experience);
  }

  public giveResources(amount: number) {
    if (this.live.isDead()) {
      return;
    }

    this.resources += amount;

    this.emit(PlayerEvent.UPDATE_RESOURCES, this.resources);

    if (Tutorial.IsInProgress(TutorialStep.RESOURCES)) {
      Tutorial.Complete(TutorialStep.RESOURCES);
    }
  }

  public takeResources(amount: number) {
    this.resources -= amount;

    this.emit(PlayerEvent.UPDATE_RESOURCES, this.resources);

    if (
      this.resources < BUILDING_GENERATOR_COST
      && this.scene.builder.getBuildingsByVariant(BuildingVariant.GENERATOR).length === 0
    ) {
      Tutorial.Start(TutorialStep.RESOURCES);
    }
  }

  public incrementKills() {
    this.kills++;
  }

  public unlockSuperskill() {
    const superskill = Object.values(PlayerSuperskill)
      .find((type) => !this.unlockedSuperskills[type]);

    if (superskill) {
      this.unlockedSuperskills[superskill] = true;

      this.emit(PlayerEvent.UNLOCK_SUPERSKILL, superskill);
    }
  }

  public getSuperskillCost(type: PlayerSuperskill) {
    return progressionLinear({
      defaultValue: PLAYER_SUPERSKILLS[type].cost,
      scale: PLAYER_SUPERSKILL_COST_GROWTH,
      level: this.scene.wave.number,
      roundTo: 5,
    });
  }

  public useSuperskill(type: PlayerSuperskill) {
    if (this.activeSuperskills[type] || !this.unlockedSuperskills[type]) {
      return;
    }

    if (!this.scene.wave.going) {
      this.scene.game.screen.failure();

      return;
    }

    const cost = this.getSuperskillCost(type);

    if (this.resources < cost) {
      this.scene.game.screen.failure('NOT_ENOUGH_RESOURCES');

      return;
    }

    this.takeResources(cost);

    this.scene.fx.playSound(PlayerAudio.SUPERSKILL);

    if (this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      const position = this.getBottomEdgePosition();
      const effect = this.scene.add.image(position.x, position.y, PlayerTexture.SUPERSKILL);

      this.scene.tweens.add({
        targets: effect,
        scale: { from: 0.0, to: 2.0 },
        duration: 500,
        onComplete: () => {
          effect.destroy();
        },
      });
    }

    const { duration } = PLAYER_SUPERSKILLS[type];
    this.activeSuperskills[type] = this.scene.addProgression({
      duration,
      frequence: duration,
      onComplete: () => {
        delete this.activeSuperskills[type];
      },
    });

    this.scene.events.emit(PlayerEvent.USE_SUPERSKILL, type);
  }

  public getExperienceToUpgrade(type: PlayerSkill) {
    return progressionQuadratic({
      defaultValue: PLAYER_SKILLS[type].experience,
      scale: PLAYER_EXPERIENCE_TO_UPGRADE_GROWTH,
      level: this.upgradeLevel[type],
      roundTo: 10,
    });
  }

  static GetUpgradeNextValue(type: PlayerSkill, level: number): number {
    switch (type) {
      case PlayerSkill.MAX_HEALTH: {
        return progressionQuadratic({
          defaultValue: PLAYER_HEALTH,
          scale: PLAYER_HEALTH_GROWTH,
          level,
          roundTo: 10,
        });
      }
      case PlayerSkill.SPEED: {
        return progressionLinear({
          defaultValue: PLAYER_SPEED,
          scale: PLAYER_SPEED_GROWTH,
          level,
          roundTo: 1,
        });
      }
      case PlayerSkill.STAMINA: {
        return progressionQuadratic({
          defaultValue: PLAYER_STAMINA,
          scale: PLAYER_STAMINA_GROWTH,
          level,
        });
      }
      default: {
        return level;
      }
    }
  }

  public upgrade(type: PlayerSkill) {
    if (this.upgradeLevel[type] === PLAYER_MAX_SKILL_LEVEL) {
      return;
    }

    const experience = this.getExperienceToUpgrade(type);

    if (this.experience < experience) {
      this.scene.game.screen.failure('NOT_ENOUGH_EXPERIENCE');

      return;
    }

    this.setSkillUpgrade(type, this.upgradeLevel[type] + 1);
    this.takeExperience(experience);

    this.emit(PlayerEvent.UPGRADE_SKILL, type);

    this.scene.fx.playSound(PlayerAudio.UPGRADE);
  }

  private setSkillUpgrade(type: PlayerSkill, level: number) {
    const nextValue = Player.GetUpgradeNextValue(type, level);

    switch (type) {
      case PlayerSkill.MAX_HEALTH: {
        const addedHealth = nextValue - this.live.maxHealth;

        this.live.setMaxHealth(nextValue);
        this.live.addHealth(addedHealth);
        break;
      }
      case PlayerSkill.SPEED: {
        this.speed = nextValue;
        if (this.scene.assistant) {
          this.scene.assistant.speed = nextValue;
        }
        break;
      }
      case PlayerSkill.STAMINA: {
        this.staminaMax = nextValue;
        this.stamina = this.staminaMax;
        break;
      }
    }

    this.upgradeLevel[type] = level;
  }

  protected onDamage(amount: number) {
    this.scene.camera.shake();

    this.scene.fx.createBloodEffect(this);
    this.scene.fx.playSound([
      PlayerAudio.DAMAGE_1,
      PlayerAudio.DAMAGE_2,
      PlayerAudio.DAMAGE_3,
    ], {
      limit: 1,
    });

    super.onDamage(amount);
  }

  protected onDead() {
    this.scene.fx.playSound(PlayerAudio.DEAD);

    this.setVelocity(0, 0);
    this.stopMovement();

    this.scene.tweens.add({
      targets: [this, this.container],
      alpha: 0.0,
      duration: 250,
    });
  }

  private onWaveComplete(number: number) {
    const experience = this.scene.wave.getExperience();
    this.giveExperience(experience);
    this.giveScore(number * 10);

    this.live.heal();

    if ((number + 1) % PLAYER_SUPERSKILL_UNLOCK_PER_WAVE === 0) {
      this.unlockSuperskill();
    }
  }

  private handleMovementByKeyboard() {
    const activeKeys = new Set<MovementDirection>();

    const toggleKeyState = (key: string, state: boolean) => {
      if (!PLAYER_MOVEMENT_KEYS[key]) {
        return;
      }

      if (state) {
        activeKeys.add(PLAYER_MOVEMENT_KEYS[key]);
      } else {
        activeKeys.delete(PLAYER_MOVEMENT_KEYS[key]);
      }

      if (activeKeys.has(MovementDirection.DOWN)) {
        if (activeKeys.has(MovementDirection.LEFT)) {
          this.movementTarget = 3;
        } else if (activeKeys.has(MovementDirection.RIGHT)) {
          this.movementTarget = 1;
        } else {
          this.movementTarget = 2;
        }
      } else if (activeKeys.has(MovementDirection.UP)) {
        if (activeKeys.has(MovementDirection.LEFT)) {
          this.movementTarget = 5;
        } else if (activeKeys.has(MovementDirection.RIGHT)) {
          this.movementTarget = 7;
        } else {
          this.movementTarget = 6;
        }
      } else if (activeKeys.has(MovementDirection.LEFT)) {
        this.movementTarget = 4;
      } else if (activeKeys.has(MovementDirection.RIGHT)) {
        this.movementTarget = 0;
      } else {
        this.movementTarget = null;
      }
    };

    this.scene.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (event: KeyboardEvent) => {
      toggleKeyState(event.code, true);
    });

    this.scene.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, (event: KeyboardEvent) => {
      toggleKeyState(event.code, false);
    });

    const handleMovementStop = () => {
      this.movementTarget = null;
    };

    window.addEventListener('blur', handleMovementStop);

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      window.removeEventListener('blur', handleMovementStop);
    });
  }

  private updateVelocity() {
    if (this.movementAngle === null) {
      this.setVelocity(0, 0);
    } else {
      const collide = this.handleCollide(this.movementAngle);

      if (collide) {
        this.setVelocity(0, 0);
      } else {
        const friction = this.currentBiome?.friction ?? 1;
        const stamina = (this.stamina === 0) ? 1.5 : 1;
        const speed = (this.speed / friction) / stamina;
        const velocity = this.scene.physics.velocityFromAngle(this.movementAngle, speed);

        this.setVelocity(
          velocity.x,
          velocity.y * LEVEL_MAP_PERSPECTIVE,
        );
      }
    }
  }

  private updateMovement() {
    if (this.movementTarget === null) {
      this.stopMovement();
    } else if (this.movementAngle === null) {
      this.startMovement();
    } else {
      this.setMovementAngle();
    }
  }

  private startMovement() {
    if (this.movementTarget === null) {
      return;
    }

    this.setMovementAngle();

    this.dustEffect?.emitter.start();

    this.scene.fx.playSound(PlayerAudio.WALK, {
      loop: true,
      rate: 1.8,
    });
  }

  public setMovementTarget(angle: Nullable<number>) {
    this.movementTarget = angle === null ? null : Math.round(angle / 45) % 8;
  }

  private setMovementAngle() {
    if (
      this.movementTarget === null
      || this.movementAngle === this.movementTarget * 45
    ) {
      return;
    }

    this.movementAngle = this.movementTarget * 45;

    this.updateMovementAnimation(true);
  }

  // ISSUE: [https://github.com/neki-dev/izowave/issues/81]
  // Error on Phaser animation play
  private updateMovementAnimation(restart: boolean = false) {
    if (this.movementTarget === null) {
      return;
    }

    try {
      const lastFrame = this.anims.currentFrame;

      this.anims.play({
        key: `dir_${this.movementTarget}`,
        startFrame: (restart || !lastFrame) ? 1 : lastFrame.index,
        frameRate: (this.stamina) === 0.0 ? 6 : 8,
      });
    } catch {
      //
    }
  }

  private stopMovement() {
    if (this.movementAngle === null) {
      return;
    }

    this.movementAngle = null;

    if (this.anims.currentAnim) {
      this.anims.setProgress(0);
      this.anims.stop();
    }

    this.dustEffect?.emitter.stop();

    this.scene.sound.stopByKey(PlayerAudio.WALK);
  }

  private addDustEffect() {
    if (this.dustEffect) {
      return;
    }

    this.dustEffect = this.scene.fx.createDustEffect(this);
  }

  private removeDustEffect() {
    if (!this.dustEffect) {
      return;
    }

    this.dustEffect.destroy();
    this.dustEffect = null;
  }

  private addPathToCrystal() {
    if (this.pathToCrystal) {
      return;
    }

    this.pathToCrystal = this.scene.add.graphics();
  }

  private removePathToCrystal() {
    if (!this.pathToCrystal) {
      return;
    }

    this.pathToCrystal.destroy();
    this.pathToCrystal = null;
  }

  private drawPathToCrystal() {
    if (!this.pathToCrystal) {
      return;
    }

    this.pathToCrystal.clear();

    if (!this.currentPathToCrystal) {
      return;
    }

    const now = Date.now();
    const halfVisibleLength = 4;

    if (this.pathToCrystalEffectTimestamp <= now) {
      this.pathToCrystalEffectIndex++;
      this.pathToCrystalEffectTimestamp = now + (1000 / this.currentPathToCrystal.length);
    }
    if (this.pathToCrystalEffectIndex >= this.currentPathToCrystal.length) {
      this.pathToCrystalEffectIndex = 0;
    }

    for (let k = -halfVisibleLength; k <= halfVisibleLength; k++) {
      const i = this.pathToCrystalEffectIndex + k;

      if (i > 1 && i < this.currentPathToCrystal.length) {
        const prev = Level.ToWorldPosition({ ...this.currentPathToCrystal[i - 1] });
        const next = Level.ToWorldPosition({ ...this.currentPathToCrystal[i] });
        const alpha = 1.0 - Math.min(Math.abs(k / halfVisibleLength), 0.9);

        this.pathToCrystal.lineStyle(2, 0xffffff, alpha * 0.75);
        this.pathToCrystal.lineBetween(prev.x, prev.y, next.x, next.y);
      }
    }
  }

  private findPathToCrystal() {
    if (
      !this.pathToCrystal
      || this.pathToCrystalFindingTask
      || (
        this.currentPathToCrystal?.[0]
        && isPositionsEqual(this.currentPathToCrystal[0], this.scene.player.positionAtMatrix)
      )
    ) {
      return;
    }

    const crystals = this.scene.getEntities<Crystal>(EntityType.CRYSTAL);
    const crystal = getClosestByIsometricDistance(crystals, this);

    if (!crystal) {
      return;
    }

    this.pathToCrystalFindingTask = this.scene.level.navigator.createTask({
      from: this.scene.player.positionAtMatrix,
      to: crystal.positionAtMatrix,
      grid: this.scene.level.gridSolid,
    }, (path: Nullable<PositionAtWorld[]>) => {
      this.currentPathToCrystal = (path && path.length > 2) ? path : null;
      this.pathToCrystalFindingTask = null;
    });
  }

  private registerAnimations() {
    Array.from({ length: 8 }).forEach((_, index) => {
      this.anims.create({
        key: `dir_${index}`,
        frames: this.anims.generateFrameNumbers(PlayerTexture.PLAYER, {
          start: index * 4,
          end: (index + 1) * 4 - 1,
        }),
        frameRate: 8,
        repeat: -1,
      });
    });
  }

  private handleToggleEffects() {
    const handler = (enabled: boolean) => {
      if (enabled) {
        this.addDustEffect();
      } else {
        this.removeDustEffect();
      }
    };

    this.scene.game.events.on(`${GameEvent.UPDATE_SETTINGS}.${GameSettings.EFFECTS}`, handler);

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.game.events.off(`${GameEvent.UPDATE_SETTINGS}.${GameSettings.EFFECTS}`, handler);
    });
  }

  private handleTogglePathToCrystal() {
    const handler = (mode: WorldMode, state: boolean) => {
      switch (mode) {
        case WorldMode.PATH_TO_CRYSTAL: {
          if (state) {
            this.addPathToCrystal();
          } else {
            this.removePathToCrystal();
          }
          break;
        }
      }
    };

    this.scene.events.on(WorldEvent.TOGGLE_MODE, handler);

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.events.off(WorldEvent.TOGGLE_MODE, handler);
    });
  }

  public getSavePayload(): PlayerSavePayload {
    return {
      position: this.positionAtMatrix,
      score: this.score,
      experience: this.experience,
      resources: this.resources,
      kills: this.kills,
      health: this.live.health,
      unlockedSuperskills: this.unlockedSuperskills,
      upgradeLevel: this.upgradeLevel,
    };
  }

  public loadSavePayload(data: PlayerSavePayload) {
    this.score = data.score;
    this.experience = data.experience;
    this.resources = data.resources;
    this.kills = data.kills;

    if (data.unlockedSuperskills) {
      this.unlockedSuperskills = data.unlockedSuperskills;
    } else {
      // PATCH: For saves with old version
      const refund = Math.floor((this.scene.wave.number - 2) / PLAYER_SUPERSKILL_UNLOCK_PER_WAVE) + 1;

      for (let i = 0; i < refund; i++) {
        this.unlockSuperskill();
      }
    }

    Utils.EachObject(data.upgradeLevel, (type, level) => {
      if (level > 1) {
        this.setSkillUpgrade(type, level);
      }
    });

    this.live.setHealth(data.health);
  }
}
