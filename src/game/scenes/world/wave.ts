import Phaser from 'phaser';

import { DIFFICULTY } from '~const/world/difficulty';
import { ENEMIES } from '~const/world/entities/enemies';
import { ENEMY_BOSS_SPAWN_WAVE_RATE } from '~const/world/entities/enemy';
import { WAVE_INCREASED_TIME_SCALE, WAVE_TIMELEFT_ALARM } from '~const/world/wave';
import { Analytics } from '~lib/analytics';
import { Assets } from '~lib/assets';
import { progressionLinear, progressionQuadraticMixed } from '~lib/progression';
import { Tutorial } from '~lib/tutorial';
import { eachEntries } from '~lib/utils';
import { TutorialStep } from '~type/tutorial';
import { IWorld, WorldEvents, WorldMode } from '~type/world';
import { EntityType } from '~type/world/entities';
import { EnemyVariant, IEnemy } from '~type/world/entities/npc/enemy';
import { PositionAtMatrix } from '~type/world/level';
import {
  IWave, WaveAudio, WaveEvents, WaveSavePayload,
} from '~type/world/wave';

Assets.RegisterAudio(WaveAudio);

export class Wave extends Phaser.Events.EventEmitter implements IWave {
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

  private alarmInterval: Nullable<Phaser.Time.TimerEvent> = null;

  constructor(scene: IWorld) {
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
      Analytics.TrackWarn('Failed to update wave', error as TypeError);
    }
  }

  private handleProcessing() {
    if (!this.isGoing) {
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
    if (this.isGoing || this.isPeaceMode) {
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
    this.scene.sound.play(WaveAudio.TICK);

    this.alarmInterval = this.scene.addProgression({
      duration: WAVE_TIMELEFT_ALARM,
      frequence: 1000,
      onProgress: () => {
        this.scene.sound.play(WaveAudio.TICK);
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

  public skipTimeleft() {
    if (this.isGoing || this.scene.isTimePaused()) {
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
        defaultValue: DIFFICULTY.WAVE_TIMELEFT,
        scale: DIFFICULTY.WAVE_TIMELEFT_GROWTH,
        level: this.number,
        maxLevel: DIFFICULTY.WAVE_TIMELEFT_GROWTH_MAX_LEVEL,
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
      this.scene.removeProgression(this.alarmInterval);
      this.alarmInterval = null;
    }

    if (this.scene.isModeActive(WorldMode.TIME_SCALE)) {
      this.scene.setTimeScale(WAVE_INCREASED_TIME_SCALE);
    }

    this.emit(WaveEvents.START, this.number);

    this.scene.sound.play(WaveAudio.START);

    if (Tutorial.IsInProgress(TutorialStep.SKIP_TIMELEFT)) {
      Tutorial.Complete(TutorialStep.SKIP_TIMELEFT);
    }
  }

  private complete() {
    const prevNumber = this.number;

    this.isGoing = false;
    this.number++;

    this.scene.setTimeScale(1.0);
    this.scene.level.looseEffects();

    this.runTimeleft();

    this.emit(WaveEvents.COMPLETE, prevNumber);

    this.scene.sound.play(WaveAudio.COMPLETE);

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

    const pause = progressionLinear({
      defaultValue: DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE,
      scale: DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE_GROWTH,
      level: this.number,
      maxLevel: DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE_GROWTH_MAX_LEVEL,
    });

    this.nextSpawnTimestamp = this.scene.getTime() + pause;
    this.spawnedEnemiesCount++;

    this.createEnemy(variant);
  }

  private async createEnemy(variant: EnemyVariant) {
    const EnemyInstance = ENEMIES[variant];
    const positionAtMatrix: PositionAtMatrix = await this.scene.spawner.getSpawnPosition();
    const enemy = new EnemyInstance(this.scene, { positionAtMatrix });

    this.addSpawnEffect(enemy);
  }

  private addSpawnEffect(enemy: IEnemy) {
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
