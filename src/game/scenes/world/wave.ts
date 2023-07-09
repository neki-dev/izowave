import EventEmitter from 'events';

import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { DIFFICULTY } from '~const/world/difficulty';
import { ENEMIES } from '~const/world/entities/enemies';
import { WAVE_TIMELEFT_ALARM } from '~const/world/wave';
import { registerAudioAssets } from '~lib/assets';
import { eachEntries } from '~lib/system';
import { progressionLinear, progressionQuadratic, progressionQuadraticForce } from '~lib/utils';
import { NoticeType } from '~type/screen';
import { TutorialStep, TutorialStepState } from '~type/tutorial';
import { IWorld } from '~type/world';
import { EnemyVariant } from '~type/world/entities/npc/enemy';
import { IWave, WaveAudio, WaveEvents } from '~type/world/wave';

export class Wave extends EventEmitter implements IWave {
  readonly scene: IWorld;

  private _isGoing: boolean = false;

  public get isGoing() { return this._isGoing; }

  private set isGoing(v) { this._isGoing = v; }

  public _isPeaceMode: boolean = false;

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

  private alarmInterval: Nullable<NodeJS.Timer> = null;

  constructor(scene: IWorld) {
    super();

    this.scene = scene;

    this.runTimeleft();

    this.scene.input.keyboard.on(CONTROL_KEY.WAVE_TIMELEFT_AFTER_SKIP, () => {
      this.skipTimeleft();
    });
  }

  public getTimeleft() {
    const now = this.scene.getTime();

    return Math.max(0, this.nextWaveTimestamp - now);
  }

  public getSeason() {
    return Math.ceil(this.number / DIFFICULTY.WAVE_SEASON_LENGTH);
  }

  public update() {
    const now = this.scene.getTime();

    if (this.isGoing) {
      if (this.spawnedEnemiesCount < this.enemiesMaxCount) {
        if (this.nextSpawnTimestamp <= now) {
          this.spawnEnemy();
        }
      } else if (this.scene.entityGroups.enemies.getTotalUsed() === 0) {
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
          this.scene.sound.play(WaveAudio.TICK);
        }, 1000);
      }
    }
  }

  public getEnemiesLeft() {
    const currentEnemies = this.scene.entityGroups.enemies.getTotalUsed();
    const killedEnemies = this.spawnedEnemiesCount - currentEnemies;

    return this.enemiesMaxCount - killedEnemies;
  }

  public skipTimeleft() {
    if (this.isGoing || this.scene.isTimePaused()) {
      return;
    }

    const now = this.scene.getTime();
    const timeleft = now + WAVE_TIMELEFT_ALARM;

    if (this.nextWaveTimestamp > timeleft) {
      this.nextWaveTimestamp = timeleft;
    }
  }

  private runTimeleft() {
    let pause: number;

    if (this.scene.game.tutorial.state(TutorialStep.WAVE_TIMELEFT) === TutorialStepState.COMPLETED) {
      pause = progressionLinear(
        DIFFICULTY.WAVE_TIMELEFT,
        DIFFICULTY.WAVE_TIMELEFT_GROWTH,
        this.number,
        1000,
      );
    } else {
      pause = WAVE_TIMELEFT_ALARM;
    }

    this.nextWaveTimestamp = this.scene.getTime() + pause;
  }

  private start() {
    this.isGoing = true;

    this.nextSpawnTimestamp = 0;
    this.spawnedEnemiesCount = 0;
    this.enemiesMaxCount = progressionQuadraticForce(
      DIFFICULTY.WAVE_ENEMIES_COUNT,
      DIFFICULTY.WAVE_ENEMIES_COUNT_GROWTH,
      this.number,
    );

    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }

    this.scene.sound.play(WaveAudio.START);

    this.emit(WaveEvents.START, this.number);

    this.scene.game.tutorial.complete(TutorialStep.WAVE_TIMELEFT);
    this.scene.game.tutorial.pause(TutorialStep.UPGRADE_PLAYER);
  }

  private complete() {
    const prevNumber = this.number;

    this.isGoing = false;
    this.number++;

    this.runTimeleft();
    this.scene.game.screen.notice(NoticeType.INFO, `WAVE ${prevNumber} COMPLETED`);

    this.scene.sound.play(WaveAudio.COMPLETE);

    this.emit(WaveEvents.COMPLETE, prevNumber);

    this.scene.level.looseEffects();

    if (prevNumber === 2) {
      this.scene.game.tutorial.start(TutorialStep.BUILD_AMMUNITION);
    } else if (prevNumber >= 3) {
      // TODO: Call only when there is definitely an upgrade opportunity
      this.scene.game.tutorial.start(TutorialStep.UPGRADE_BUILDING);
    }

    this.scene.game.analytics.track({
      world: this.scene,
      success: true,
    });
  }

  private spawnEnemy() {
    const variant = this.getEnemyVariant();

    this.scene.spawnEnemy(variant);

    const pause = progressionQuadratic(
      DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE,
      DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE_GROWTH,
      this.number,
    );

    this.nextSpawnTimestamp = this.scene.getTime() + Math.max(pause, 500);
    this.spawnedEnemiesCount++;
  }

  private getEnemyVariant() {
    if (
      this.number % DIFFICULTY.WAVE_SEASON_LENGTH === 0
      && this.spawnedEnemiesCount < this.getSeason()
    ) {
      return EnemyVariant.BOSS;
    }

    const variants: EnemyVariant[] = [];

    eachEntries(ENEMIES, (variant, Instance) => {
      if (variant !== this.lastSpawnedEnemyVariant) {
        if (Instance.SpawnWaveRange) {
          const [min, max] = Instance.SpawnWaveRange;

          if (this.number >= min && (!max || this.number <= max)) {
            variants.push(variant);
          }
        }
      }
    });

    if (variants.length > 0) {
      this.lastSpawnedEnemyVariant = Phaser.Utils.Array.GetRandom(variants);
    }

    return this.lastSpawnedEnemyVariant;
  }
}

registerAudioAssets(WaveAudio);
