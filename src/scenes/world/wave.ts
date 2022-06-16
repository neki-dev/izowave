import EventEmitter from 'events';
import { calcGrowth } from '~lib/utils';
import World from '~scene/world';

import { WaveEvents } from '~type/wave';
import { EnemyVariant } from '~type/enemy';

import { ENEMY_VARIANTS_BY_WAVE } from '~const/enemy';
import {
  WAVE_BOSS_SPAWN_RATE,
  WAVE_ENEMIES_COUNT, WAVE_ENEMIES_COUNT_GROWTH,
  WAVE_ENEMIES_SPAWN_PAUSE, WAVE_ENEMIES_SPAWN_PAUSE_GROWTH,
  WAVE_EXPERIENCE, WAVE_EXPERIENCE_GROWTH,
  WAVE_PAUSE,
} from '~const/difficulty';

export default class Wave extends EventEmitter {
  readonly scene: World;

  /**
   * State of wave starting.
   */
  private _isGoing: boolean = false;

  public get isGoing() { return this._isGoing; }

  private set isGoing(v) { this._isGoing = v; }

  /**
   * Pause for next wave.
   */
  private timeleft: number = null;

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
   * Pause for next enemy spawn.
   */
  private spawnPause: number = 0;

  /**
   * Wave constructor.
   */
  constructor(scene: World) {
    super();

    this.scene = scene;

    this.runTimeleft();

    scene.input.keyboard.once('keyup-N', this.skipTimeleft, this);
  }

  /**
   * Get timeleft to next wave.
   */
  public getTimeleft(): number {
    const now = this.scene.getTimerNow();
    return Math.max(0, this.timeleft - now);
  }

  /**
   * Update wave process.
   */
  public update() {
    const now = this.scene.getTimerNow();
    if (this.isGoing) {
      if (this.spawnedCount < this.maxSpawnedCount) {
        if (this.spawnPause < now) {
          this.spawn();
          const pause = calcGrowth(
            WAVE_ENEMIES_SPAWN_PAUSE,
            WAVE_ENEMIES_SPAWN_PAUSE_GROWTH,
            this.number,
          );
          this.spawnPause = now + pause;
        }
      } else if (this.scene.getEnemies().getTotalUsed() === 0) {
        this.complete();
      }
    } else if (this.timeleft < now) {
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
    const pause = WAVE_PAUSE / this.scene.difficulty;
    this.timeleft = this.scene.getTimerNow() + pause;
  }

  /**
   * Skip timeleft.
   */
  public skipTimeleft() {
    if (this.isGoing) {
      return;
    }

    const now = this.scene.getTimerNow();
    if (this.timeleft - now <= 1000) {
      return;
    }

    this.timeleft = now + 1000;
  }

  /**
   * Start wave.
   * Increment current wave number and start enemies spawning.
   */
  public start() {
    this.number++;
    this.isGoing = true;

    this.spawnPause = 0;
    this.spawnedCount = 0;
    this.maxSpawnedCount = calcGrowth(
      WAVE_ENEMIES_COUNT,
      WAVE_ENEMIES_COUNT_GROWTH,
      this.number,
    );

    this.emit(WaveEvents.UPDATE);
    this.emit(WaveEvents.START, this.number);
  }

  /**
   * Complete wave.
   * Start timeleft to next wave and give player experience.
   */
  public complete() {
    this.isGoing = false;
    this.runTimeleft();

    this.emit(WaveEvents.UPDATE);
    this.emit(WaveEvents.FINISH, this.number);

    const experience = calcGrowth(WAVE_EXPERIENCE, WAVE_EXPERIENCE_GROWTH, this.number);
    this.scene.player.giveExperience(experience);
  }

  /**
   * Spawn enemy with random variant.
   * Boss will spawn every `WAVE_BOSS_SPAWN_RATE`th wave.
   */
  private spawn() {
    let variant: EnemyVariant;
    if (
      this.number % WAVE_BOSS_SPAWN_RATE === 0
      && this.spawnedCount < Math.ceil(this.number / WAVE_BOSS_SPAWN_RATE)
    ) {
      variant = EnemyVariant.BOSS;
    } else {
      const variants: EnemyVariant[] = [];
      for (const [type, [wave, frequency]] of Object.entries(ENEMY_VARIANTS_BY_WAVE)) {
        if (wave <= this.number) {
          for (let k = 0; k < frequency; k++) {
            variants.push(<EnemyVariant> type);
          }
        }
      }
      variant = Phaser.Utils.Array.GetRandom(variants);
    }

    this.scene.spawnEnemy(variant);
    this.spawnedCount++;
  }
}
