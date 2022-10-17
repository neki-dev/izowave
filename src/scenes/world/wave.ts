import EventEmitter from 'events';

import { DIFFICULTY } from '~const/difficulty';
import { ENEMY_VARIANTS_META } from '~const/enemy';
import { INPUT_KEY } from '~const/keyboard';
import { calcGrowth } from '~lib/utils';
import { World } from '~scene/world';
import { EnemyVariant } from '~type/world/entities/enemy';
import { WaveEvents } from '~type/world/wave';

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
  private _number: number = 0;

  public get number() { return this._number; }

  private set number(v) { this._number = v; }

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
    scene.input.keyboard.on(INPUT_KEY.WAVE_SKIP_TIMELEFT, this.skipTimeleft, this);
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
        if (this.nextSpawnTimestamp < now) {
          this.spawnEnemy();
        }
      } else if (this.scene.enemies.getTotalUsed() === 0) {
        this.complete();
      }
    } else if (this.nextWaveTimestamp < now) {
      this.start();
    }
  }

  /**
   * Set current wave number.
   *
   * @param number - Number
   */
  public setNumber(number: number) {
    this.number = number;

    this.emit(WaveEvents.UPDATE);
  }

  /**
   * Start timeleft to next wave.
   */
  public runTimeleft() {
    const pause = (DIFFICULTY.WAVE_PAUSE + (this.number - 1) * 1000) / this.scene.difficulty;

    this.nextWaveTimestamp = this.scene.getTimerNow() + pause;
  }

  /**
   * Skip timeleft.
   */
  public skipTimeleft() {
    if (this.isGoing) {
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
  public start() {
    this.number++;
    this.isGoing = true;

    this.nextSpawnTimestamp = 0;
    this.spawnedCount = 0;
    this.maxSpawnedCount = calcGrowth(
      DIFFICULTY.WAVE_ENEMIES_COUNT,
      DIFFICULTY.WAVE_ENEMIES_COUNT_GROWTH,
      this.number,
    );

    this.emit(WaveEvents.UPDATE);
    this.emit(WaveEvents.START, this.number);
  }

  /**
   * Complete wave.
   * Start timeleft to next wave.
   */
  public complete() {
    this.isGoing = false;
    this.runTimeleft();

    this.emit(WaveEvents.UPDATE);
    this.emit(WaveEvents.COMPLETE, this.number);
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

    for (const [type, meta] of Object.entries(ENEMY_VARIANTS_META)) {
      if (meta.spawnMinWave <= this.number) {
        for (let k = 0; k < meta.spawnFrequency; k++) {
          variants.push(<EnemyVariant> type);
        }
      }
    }

    return Phaser.Utils.Array.GetRandom(variants);
  }
}
