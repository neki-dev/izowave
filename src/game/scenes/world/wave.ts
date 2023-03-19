import EventEmitter from 'events';

import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { DIFFICULTY } from '~const/world/difficulty';
import { ENEMY_VARIANTS_META } from '~const/world/entities/enemy';
import { registerAudioAssets } from '~lib/assets';
import { eachEntries } from '~lib/system';
import { calcGrowth } from '~lib/utils';
import { World } from '~scene/world';
import { TutorialStep } from '~type/tutorial';
import { EnemyVariant } from '~type/world/entities/npc/enemy';
import { WaveAudio, WaveEvents } from '~type/world/wave';

export class Wave extends EventEmitter {
  readonly scene: World;

  /**
   * State of wave starting.
   */
  private _isGoing: boolean = false;

  public get isGoing() { return this._isGoing; }

  private set isGoing(v) { this._isGoing = v; }

  /**
   * Current wave number.
   */
  public number: number = 0;

  /**
   * Count of spawned enemies in current wave.
   */
  private _spawnedCount: number = 0;

  public get spawnedCount() { return this._spawnedCount; }

  private set spawnedCount(v) { this._spawnedCount = v; }

  /**
   * Maximum count of spawned enemies in current wave.
   */
  private _maxSpawnedCount: number = 0;

  public get maxSpawnedCount() { return this._maxSpawnedCount; }

  private set maxSpawnedCount(v) { this._maxSpawnedCount = v; }

  /**
   * Pause for next wave.
   */
  private nextWaveTimestamp: number = 0;

  /**
   * Pause for next enemy spawn.
   */
  private nextSpawnTimestamp: number = 0;

  /**
   * Wave constructor.
   */
  constructor(scene: World) {
    super();

    this.scene = scene;

    this.runTimeleft();

    // Add keyboard events
    this.scene.input.keyboard.on(CONTROL_KEY.WAVE_SKIP_TIMELEFT, this.skipTimeleft, this);
  }

  /**
   * Get timeleft to next wave.
   */
  public getTimeleft(): number {
    const now = this.scene.getTimerNow();

    return Math.max(0, this.nextWaveTimestamp - now);
  }

  /**
   * Update wave process.
   */
  public update() {
    const now = this.scene.getTimerNow();

    if (this.isGoing) {
      if (this.spawnedCount < this.maxSpawnedCount) {
        if (this.nextSpawnTimestamp <= now) {
          this.spawnEnemy();
        }
      } else if (this.scene.entityGroups.enemies.getTotalUsed() === 0) {
        this.complete();
      }
    } else if (this.nextWaveTimestamp <= now) {
      this.start();
    }
  }

  /**
   * Start timeleft to next wave.
   */
  public runTimeleft() {
    let pause: number;

    if (this.scene.isTimerPaused()) {
      pause = 5000;
    } else {
      pause = calcGrowth(
        DIFFICULTY.WAVE_PAUSE,
        DIFFICULTY.WAVE_PAUSE_GROWTH,
        this.number + 1,
      ) / this.scene.game.difficulty;
    }

    this.nextWaveTimestamp = this.scene.getTimerNow() + pause;
  }

  /**
   * Get current wave number.
   */
  public getCurrentNumber(): number {
    return this.isGoing ? this.number : this.number + 1;
  }

  /**
   * Skip timeleft.
   */
  public skipTimeleft() {
    if (this.isGoing || this.scene.isTimerPaused()) {
      return;
    }

    const now = this.scene.getTimerNow();

    if (this.nextWaveTimestamp - now <= 3000) {
      return;
    }

    this.nextWaveTimestamp = now + 3000;
  }

  /**
   * Start wave.
   * Increment current wave number and start enemies spawning.
   */
  private start() {
    this.number++;
    this.isGoing = true;

    this.nextSpawnTimestamp = 0;
    this.spawnedCount = 0;
    this.maxSpawnedCount = calcGrowth(
      DIFFICULTY.WAVE_ENEMIES_COUNT,
      DIFFICULTY.WAVE_ENEMIES_COUNT_GROWTH,
      this.number,
    );

    this.scene.sound.play(WaveAudio.START);

    this.emit(WaveEvents.START, this.number);

    this.scene.game.tutorial.end(TutorialStep.UPGRADE_BUILDING);
    this.scene.game.tutorial.end(TutorialStep.WAVE_TIMELEFT);
  }

  /**
   * Complete wave.
   * Run timeleft to next wave.
   */
  private complete() {
    this.isGoing = false;
    this.runTimeleft();

    this.scene.sound.play(WaveAudio.COMPLETE);

    this.emit(WaveEvents.COMPLETE, this.number);

    if (this.number === 1) {
      this.scene.game.tutorial.beg(TutorialStep.BUILD_AMMUNITION);
      this.scene.setTimerPause(true);
    } else if (this.number === 2) {
      this.scene.game.tutorial.beg(TutorialStep.UPGRADE_BUILDING);
    }

    this.scene.game.analytics.track({
      world: this.scene,
      success: true,
    });
  }

  /**
   * Spawn enemy with random variant.
   */
  private spawnEnemy() {
    const variant = this.getEnemyVariant();

    this.scene.spawnEnemy(variant);

    const now = this.scene.getTimerNow();
    const pause = calcGrowth(
      DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE,
      DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE_GROWTH,
      this.number,
    );

    this.nextSpawnTimestamp = now + Math.max(pause, 500);
    this.spawnedCount++;
  }

  /**
   * Get random enemy variant by wave.
   * Boss will spawn every `WAVE_BOSS_SPAWN_RATE`th wave.
   */
  private getEnemyVariant(): EnemyVariant {
    if (
      this.number % DIFFICULTY.WAVE_BOSS_SPAWN_RATE === 0
      && this.spawnedCount < Math.ceil(this.number / DIFFICULTY.WAVE_BOSS_SPAWN_RATE)
    ) {
      return EnemyVariant.BOSS;
    }

    const variants: EnemyVariant[] = [];

    eachEntries(ENEMY_VARIANTS_META, (type, meta) => {
      if (meta.spawnMinWave <= this.number) {
        for (let k = 0; k < meta.spawnFrequency; k++) {
          variants.push(<EnemyVariant> type);
        }
      }
    });

    return Phaser.Utils.Array.GetRandom(variants);
  }
}

registerAudioAssets(WaveAudio);
