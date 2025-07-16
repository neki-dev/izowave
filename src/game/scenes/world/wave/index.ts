import Phaser from 'phaser';

import type { WorldScene } from '..';
import type { Enemy } from '../entities/npc/enemy';
import { EnemyFactory } from '../entities/npc/enemy/factory';
import { ENEMIES } from '../entities/npc/enemy/factory/const';
import { EnemyVariant } from '../entities/npc/enemy/types';
import { ENEMY_BOSS_SPAWN_WAVE_RATE } from '../entities/npc/enemy/variants/boss/const';
import { EntityType } from '../entities/types';
import { WorldEvent, WorldMode } from '../types';

import { WAVE_ENEMIES_COUNT, WAVE_ENEMIES_COUNT_GROWTH, WAVE_ENEMIES_SPAWN_PAUSE, WAVE_ENEMIES_SPAWN_PAUSE_GROWTH, WAVE_ENEMIES_SPAWN_PAUSE_GROWTH_MAX_LEVEL, WAVE_EXPERIENCE, WAVE_EXPERIENCE_GROWTH, WAVE_INCREASED_TIME_SCALE, WAVE_TIMELEFT, WAVE_TIMELEFT_ALARM, WAVE_TIMELEFT_GROWTH, WAVE_TIMELEFT_GROWTH_MAX_LEVEL } from './const';
import type { WaveSavePayload } from './types';
import { WaveAudio, WaveEvent } from './types';

import { progressionLinear, progressionQuadratic, progressionQuadraticMixed } from '~core/progression';
import { Tutorial } from '~core/tutorial';
import { TutorialStep } from '~core/tutorial/types';
import { Utils } from '~core/utils';

import './resources';

export class Wave extends Phaser.Events.EventEmitter {
  public readonly scene: WorldScene;

  private _going: boolean = false;
  public get going() { return this._going; }
  private set going(v) { this._going = v; }

  private _peaceMode: boolean = false;
  public get peaceMode() { return this._peaceMode; }
  private set peaceMode(v) { this._peaceMode = v; }

  private _number: number = 1;
  public get number() { return this._number; }
  private set number(v) { this._number = v; }

  private spawnedEnemiesCount: number = 0;

  private enemiesMaxCount: number = 0;

  private lastSpawnedEnemyVariant: Nullable<EnemyVariant> = null;

  private nextWaveTimestamp: number = 0;

  private nextSpawnTimestamp: number = 0;

  private alarmInterval: Nullable<Phaser.Time.TimerEvent> = null;

  constructor(scene: WorldScene) {
    super();

    this.scene = scene;

    this.handleToggleTimeScale();
  }

  public destroy() {
    this.removeAllListeners();
  }

  public getTimeleft() {
    const now = this.scene.getTime();

    return Math.max(0, this.nextWaveTimestamp - now);
  }

  public update() {
    try {
      this.handleTimeleft();
      this.handleProcessing();
    } catch (error) {
      console.warn('Failed to update wave', error as TypeError);
    }
  }

  private handleProcessing() {
    if (!this.going) {
      return;
    }

    const now = this.scene.getTime();

    if (this.spawnedEnemiesCount < this.enemiesMaxCount) {
      if (this.nextSpawnTimestamp <= now) {
        this.spawnEnemy();
      }
    } else if (this.scene.getEntitiesGroup(EntityType.ENEMY).getTotalUsed() === 0) {
      this.complete();
    }
  }

  private handleTimeleft() {
    if (this.going || this.peaceMode) {
      return;
    }

    const left = this.nextWaveTimestamp - this.scene.getTime();

    if (left <= 0) {
      this.start();
    } else if (
      left <= WAVE_TIMELEFT_ALARM
      && !this.scene.isTimePaused()
      && !this.alarmInterval
    ) {
      this.runAlarmCountdown();
    }
  }

  private runAlarmCountdown() {
    this.scene.fx.playSound(WaveAudio.TICK);

    this.alarmInterval = this.scene.addProgression({
      duration: WAVE_TIMELEFT_ALARM,
      frequence: 1000,
      onProgress: () => {
        this.scene.fx.playSound(WaveAudio.TICK);
      },
      onComplete: () => {
        this.alarmInterval = null;
      },
    });
  }

  public getEnemiesLeft() {
    const currentEnemies = this.scene.getEntitiesGroup(EntityType.ENEMY).getTotalUsed();
    const killedEnemies = this.spawnedEnemiesCount - currentEnemies;

    return this.enemiesMaxCount - killedEnemies;
  }

  public getExperience() {
    return progressionQuadratic({
      defaultValue: WAVE_EXPERIENCE,
      scale: WAVE_EXPERIENCE_GROWTH,
      level: this.number - 1,
    });
  }

  public skipTimeleft() {
    if (this.going || this.scene.isTimePaused()) {
      return;
    }

    const now = this.scene.getTime();
    const skipedTime = this.nextWaveTimestamp - now;
    const resources = Math.floor(this.scene.getResourceExtractionSpeed() * (skipedTime / 1000));

    this.scene.player.giveResources(resources);

    this.nextWaveTimestamp = now;

    Tutorial.Complete(TutorialStep.SKIP_TIMELEFT);
  }

  public runTimeleft() {
    const pause = (this.number === 1 && Tutorial.IsEnabled)
      ? WAVE_TIMELEFT_ALARM
      : progressionLinear({
        defaultValue: WAVE_TIMELEFT,
        scale: WAVE_TIMELEFT_GROWTH,
        level: this.number,
        maxLevel: WAVE_TIMELEFT_GROWTH_MAX_LEVEL,
        roundTo: 1000,
      });

    this.nextWaveTimestamp = this.scene.getTime() + pause;
  }

  private start() {
    this.going = true;

    this.nextSpawnTimestamp = 0;
    this.spawnedEnemiesCount = 0;
    this.enemiesMaxCount = progressionQuadraticMixed({
      defaultValue: WAVE_ENEMIES_COUNT,
      scale: WAVE_ENEMIES_COUNT_GROWTH,
      level: this.number,
    });

    if (this.alarmInterval) {
      this.scene.removeProgression(this.alarmInterval);
      this.alarmInterval = null;
    }

    if (this.scene.isModeActive(WorldMode.TIME_SCALE)) {
      this.scene.setTimeScale(WAVE_INCREASED_TIME_SCALE);
    }

    this.emit(WaveEvent.START, this.number);

    this.scene.fx.playSound(WaveAudio.START);

    if (Tutorial.IsInProgress(TutorialStep.SKIP_TIMELEFT)) {
      Tutorial.Complete(TutorialStep.SKIP_TIMELEFT);
    }
  }

  private complete() {
    const prevNumber = this.number;

    this.going = false;
    this.number++;

    this.scene.setTimeScale(1.0);
    this.scene.level.looseEffects();

    this.runTimeleft();

    this.emit(WaveEvent.COMPLETE, prevNumber);

    this.scene.fx.playSound(WaveAudio.COMPLETE);

    switch (this.number) {
      case 2: {
        Tutorial.Start(TutorialStep.BUILD_GENERATOR_SECOND);
        break;
      }
      case 3: {
        Tutorial.Start(TutorialStep.BUILD_AMMUNITION);
        break;
      }
      case 8: {
        Tutorial.Start(TutorialStep.BUILD_RADAR);
        break;
      }
    }
  }

  private spawnEnemy() {
    const variant = this.getEnemyVariant();

    if (!variant) {
      return;
    }

    const pause = progressionLinear({
      defaultValue: WAVE_ENEMIES_SPAWN_PAUSE,
      scale: WAVE_ENEMIES_SPAWN_PAUSE_GROWTH,
      level: this.number,
      maxLevel: WAVE_ENEMIES_SPAWN_PAUSE_GROWTH_MAX_LEVEL,
    });

    this.nextSpawnTimestamp = this.scene.getTime() + pause;
    this.spawnedEnemiesCount++;

    this.createEnemy(variant);
  }

  private async createEnemy(variant: EnemyVariant) {
    const enemy = EnemyFactory.create(this.scene, variant, {
      positionAtMatrix: await this.scene.spawner.getSpawnPosition(),
    });

    this.addSpawnEffect(enemy);
  }

  private addSpawnEffect(enemy: Enemy) {
    enemy.freeze(750);

    this.scene.fx.createSpawnEffect(enemy);

    let effect: Nullable<Phaser.Tweens.Tween> = null;

    const removeEffect = () => {
      if (effect) {
        effect.destroy();
        effect = null;
      }
    };

    enemy.once(Phaser.GameObjects.Events.DESTROY, removeEffect);

    const originAlpha = enemy.alpha;

    enemy.container.setAlpha(0.0);
    enemy.setAlpha(0.0);
    effect = this.scene.tweens.add({
      targets: enemy,
      alpha: originAlpha,
      duration: 750,
      onComplete: () => {
        removeEffect();
        enemy.off(Phaser.GameObjects.Events.DESTROY, removeEffect);
        enemy.container.setAlpha(enemy.alpha);
      },
    });
  }

  private getEnemyVariant() {
    if (
      this.number % ENEMY_BOSS_SPAWN_WAVE_RATE === 0
      && this.spawnedEnemiesCount < Math.ceil(this.number / ENEMY_BOSS_SPAWN_WAVE_RATE)
    ) {
      return EnemyVariant.BOSS;
    }

    const variants: EnemyVariant[] = [];

    Utils.EachObject(ENEMIES, (variant, Instance) => {
      if (
        variant !== this.lastSpawnedEnemyVariant
        && Instance.SpawnWaveRange
      ) {
        const [min, max] = Instance.SpawnWaveRange;

        if (this.number >= min && (!max || this.number <= max)) {
          variants.push(variant);
        }
      }
    });

    if (variants.length > 0) {
      this.lastSpawnedEnemyVariant = Phaser.Utils.Array.GetRandom(variants);
    }

    return this.lastSpawnedEnemyVariant;
  }

  private handleToggleTimeScale() {
    const handler = (mode: WorldMode, state: boolean) => {
      if (mode === WorldMode.TIME_SCALE && this.going) {
        this.scene.setTimeScale(state ? WAVE_INCREASED_TIME_SCALE : 1.0);
      }
    };

    this.scene.events.on(WorldEvent.TOGGLE_MODE, handler);

    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.events.off(WorldEvent.TOGGLE_MODE, handler);
    });
  }

  public getSavePayload(): WaveSavePayload {
    return {
      number: this.number,
      timeleft: this.getTimeleft(),
    };
  }

  public loadSavePayload(data: WaveSavePayload) {
    this.number = data.number;
    this.nextWaveTimestamp = this.scene.getTime() + data.timeleft;
  }
}
