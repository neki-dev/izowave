import EventEmitter from 'events';

import Phaser from 'phaser';

import { DIFFICULTY } from '~const/world/difficulty';
import { ENEMIES } from '~const/world/entities/enemies';
import { ENEMY_BOSS_SPAWN_WAVE_RATE } from '~const/world/entities/enemy';
import { WAVE_INCREASED_TIME_SCALE, WAVE_TIMELEFT_ALARM } from '~const/world/wave';
import { Analytics } from '~lib/analytics';
import { Assets } from '~lib/assets';
import { progressionLinear, progressionQuadratic, progressionQuadraticMixed } from '~lib/progression';
import { Tutorial } from '~lib/tutorial';
import { eachEntries } from '~lib/utils';
import { GameState } from '~type/game';
import { TutorialStep } from '~type/tutorial';
import { IWorld, WorldEvents, WorldMode } from '~type/world';
import { EntityType } from '~type/world/entities';
import { EnemyVariant } from '~type/world/entities/npc/enemy';
import {
  IWave, WaveAudio, WaveEvents, WaveSavePayload,
} from '~type/world/wave';

Assets.RegisterAudio(WaveAudio);

export class Wave extends EventEmitter implements IWave {
  readonly scene: IWorld;

  private _isGoing: boolean = false;

  public get isGoing() { return this._isGoing; }

  private set isGoing(v) { this._isGoing = v; }

  private _isPeaceMode: boolean = false;

  public get isPeaceMode() { return this._isPeaceMode; }

  private set isPeaceMode(v) { this._isPeaceMode = v; }

  private _number: number = 1;

  public get number() { return this._number; }

  private set number(v) { this._number = v; }

  private spawnedEnemiesCount: number = 0;

  private enemiesMaxCount: number = 0;

  private lastSpawnedEnemyVariant: Nullable<EnemyVariant> = null;

  private nextWaveTimestamp: number = 0;

  private nextSpawnTimestamp: number = 0;

  private alarmInterval: Nullable<NodeJS.Timeout> = null;

  constructor(scene: IWorld) {
    super();

    this.scene = scene;

    this.setMaxListeners(0);

    this.handleToggleTimeScale();
  }

  public destroy() {
    this.removeAllListeners();
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
    }
  }

  public getTimeleft() {
    const now = this.scene.getTime();

    return Math.max(0, this.nextWaveTimestamp - now);
  }

  public update() {
    const now = this.scene.getTime();

    if (this.isGoing) {
      if (this.spawnedEnemiesCount < this.enemiesMaxCount) {
        if (this.nextSpawnTimestamp <= now) {
          this.spawnEnemy();
        }
      } else if (this.scene.getEntitiesGroup(EntityType.ENEMY).getTotalUsed() === 0) {
        this.complete();
      }
    } else if (!this.isPeaceMode) {
      const left = this.nextWaveTimestamp - now;

      if (left <= 0) {
        this.start();
      } else if (
        left <= WAVE_TIMELEFT_ALARM
        && !this.scene.isTimePaused()
        && !this.alarmInterval
      ) {
        this.scene.sound.play(WaveAudio.TICK);
        this.alarmInterval = setInterval(() => {
          if (this.scene.game.state === GameState.STARTED && !this.isPeaceMode) {
            this.scene.sound.play(WaveAudio.TICK);
          }
        }, 1000);
      }
    }
  }

  public getEnemiesLeft() {
    const currentEnemies = this.scene.getEntitiesGroup(EntityType.ENEMY).getTotalUsed();
    const killedEnemies = this.spawnedEnemiesCount - currentEnemies;

    return this.enemiesMaxCount - killedEnemies;
  }

  public skipTimeleft() {
    if (this.isGoing || this.scene.isTimePaused()) {
      return;
    }

    const now = this.scene.getTime();
    const skipedTime = this.nextWaveTimestamp - now;
    const resources = Math.floor(this.scene.getResourceExtractionSpeed() * (skipedTime / 1000));

    this.scene.player.giveResources(resources);

    this.nextWaveTimestamp = now;
  }

  public runTimeleft() {
    const pause = (this.number === 1 && Tutorial.IsEnabled)
      ? WAVE_TIMELEFT_ALARM
      : progressionLinear({
        defaultValue: DIFFICULTY.WAVE_TIMELEFT,
        scale: DIFFICULTY.WAVE_TIMELEFT_GROWTH,
        level: this.number,
        roundTo: 1000,
      });

    this.nextWaveTimestamp = this.scene.getTime() + pause;
  }

  private start() {
    this.isGoing = true;

    this.nextSpawnTimestamp = 0;
    this.spawnedEnemiesCount = 0;
    this.enemiesMaxCount = progressionQuadraticMixed({
      defaultValue: DIFFICULTY.WAVE_ENEMIES_COUNT,
      scale: DIFFICULTY.WAVE_ENEMIES_COUNT_GROWTH,
      level: this.number,
    });

    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }

    if (this.scene.isModeActive(WorldMode.TIME_SCALE)) {
      this.scene.setTimeScale(WAVE_INCREASED_TIME_SCALE);
    }

    this.emit(WaveEvents.START, this.number);

    this.scene.sound.play(WaveAudio.START);
  }

  private complete() {
    const prevNumber = this.number;

    this.isGoing = false;
    this.number++;

    this.runTimeleft();

    this.emit(WaveEvents.COMPLETE, prevNumber);

    this.scene.sound.play(WaveAudio.COMPLETE);

    this.scene.setTimeScale(1.0);
    this.scene.level.looseEffects();

    switch (this.number) {
      case 2: {
        Tutorial.Start(TutorialStep.BUILD_GENERATOR_SECOND);
        break;
      }
      case 3: {
        Tutorial.Start(TutorialStep.BUILD_AMMUNITION);
        break;
      }
      case 5: {
        Tutorial.Start(TutorialStep.UPGRADE_SKILL);
        break;
      }
      case 8: {
        Tutorial.Start(TutorialStep.BUILD_RADAR);
        break;
      }
    }

    Analytics.TrackEvent({
      world: this.scene,
      success: true,
    });
  }

  private spawnEnemy() {
    const variant = this.getEnemyVariant();

    if (!variant) {
      return;
    }

    this.scene.spawnEnemy(variant);

    const pause = progressionQuadratic({
      defaultValue: DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE,
      scale: DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE_GROWTH,
      level: this.number,
      maxLevel: DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE_LEVEL,
    });

    this.nextSpawnTimestamp = this.scene.getTime() + pause;
    this.spawnedEnemiesCount++;
  }

  private getEnemyVariant() {
    if (
      this.number % ENEMY_BOSS_SPAWN_WAVE_RATE === 0
      && this.spawnedEnemiesCount < Math.ceil(this.number / ENEMY_BOSS_SPAWN_WAVE_RATE)
    ) {
      return EnemyVariant.BOSS;
    }

    const variants: EnemyVariant[] = [];

    eachEntries(ENEMIES, (variant, Instance) => {
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
      if (mode === WorldMode.TIME_SCALE && this.isGoing) {
        this.scene.setTimeScale(state ? WAVE_INCREASED_TIME_SCALE : 1.0);
      }
    };

    this.scene.events.on(WorldEvents.TOGGLE_MODE, handler);

    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.events.off(WorldEvents.TOGGLE_MODE, handler);
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
