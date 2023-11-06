import Phaser from 'phaser';
import { Interface } from 'phaser-react-ui';
import { v4 as uuidv4 } from 'uuid';

import { DIFFICULTY } from '~const/world/difficulty';
import { LEVEL_PLANETS } from '~const/world/level';
import { Crystal } from '~entity/crystal';
import { Assistant } from '~entity/npc/variants/assistant';
import { Player } from '~entity/player';
import { Scene } from '~game/scenes';
import { Analytics } from '~lib/analytics';
import { Assets } from '~lib/assets';
import { aroundPosition } from '~lib/dimension';
import { progressionLinear } from '~lib/progression';
import { hashString } from '~lib/utils';
import { Builder } from '~scene/world/builder';
import { Camera } from '~scene/world/camera';
import { FXManager } from '~scene/world/effects/fx-manager';
import { WorldUI } from '~scene/world/interface';
import { Level } from '~scene/world/level';
import { Spawner } from '~scene/world/spawner';
import { Wave } from '~scene/world/wave';
import { GameEvents, GameScene, GameState } from '~type/game';
import { LiveEvents } from '~type/live';
import {
  IWorld, WorldEvents, WorldHint, WorldMode, WorldModeIcons, WorldSavePayload, WorldTimerParams,
} from '~type/world';
import { IBuilder } from '~type/world/builder';
import { ICamera } from '~type/world/camera';
import { IFXManager } from '~type/world/effects/fx-manager';
import { EntityType } from '~type/world/entities';
import { BuildingVariant, IBuilding } from '~type/world/entities/building';
import { ICrystal } from '~type/world/entities/crystal';
import { IAssistant } from '~type/world/entities/npc/assistant';
import { IPlayer } from '~type/world/entities/player';
import { ISprite } from '~type/world/entities/sprite';
import {
  ILevel, LevelData, SpawnTarget, PositionAtWorld, PositionAtMatrix,
} from '~type/world/level';
import { ISpawner } from '~type/world/spawner';
import { IWave, WaveEvents } from '~type/world/wave';

Assets.RegisterImages(WorldModeIcons);

export class World extends Scene implements IWorld {
  private entityGroups: Record<EntityType, Phaser.GameObjects.Group>;

  private _player: IPlayer;

  public get player() { return this._player; }

  private set player(v) { this._player = v; }

  private _assistant: IAssistant;

  public get assistant() { return this._assistant; }

  private set assistant(v) { this._assistant = v; }

  private _level: ILevel;

  public get level() { return this._level; }

  private set level(v) { this._level = v; }

  private _wave: IWave;

  public get wave() { return this._wave; }

  private set wave(v) { this._wave = v; }

  private _builder: IBuilder;

  public get builder() { return this._builder; }

  private set builder(v) { this._builder = v; }

  private _spawner: ISpawner;

  public get spawner() { return this._spawner; }

  private set spawner(v) { this._spawner = v; }

  private _fx: IFXManager;

  public get fx() { return this._fx; }

  private set fx(v) { this._fx = v; }

  private _camera: ICamera;

  public get camera() { return this._camera; }

  private set camera(v) { this._camera = v; }

  private lifecyle: Phaser.Time.TimerEvent;

  private _deltaTime: number = 1;

  public get deltaTime() { return this._deltaTime; }

  private set deltaTime(v) { this._deltaTime = v; }

  private timers: Phaser.Time.TimerEvent[] = [];

  private modes: Record<WorldMode, boolean> = {
    [WorldMode.TIME_SCALE]: false,
    [WorldMode.BUILDING_INDICATORS]: false,
    [WorldMode.AUTO_REPAIR]: false,
    [WorldMode.PATH_TO_CRYSTAL]: false,
  };

  constructor() {
    super(GameScene.WORLD);
  }

  public create(data: LevelData) {
    this.input.setPollAlways();

    this.level = new Level(this, data);
    this.fx = new FXManager(this);
    this.camera = new Camera(this);
    this.spawner = new Spawner(this);

    this.timers = [];
    this.modes = {
      [WorldMode.TIME_SCALE]: false,
      [WorldMode.BUILDING_INDICATORS]: false,
      [WorldMode.AUTO_REPAIR]: false,
      [WorldMode.PATH_TO_CRYSTAL]: false,
    };

    this.addEntityGroups();
  }

  public start() {
    new Interface(this, WorldUI);

    this.addLifecycle();

    this.camera.addZoomControl();

    this.addWaveManager();
    this.addBuilder();
    this.addPlayer();
    this.addAssistant();
    this.addCrystals();

    if (this.game.usedSave?.payload.world) {
      this.loadSavePayload(this.game.usedSave.payload.world);
    }
  }

  public update(time: number, delta: number) {
    if (this.game.state !== GameState.STARTED) {
      return;
    }

    try {
      this.deltaTime = delta;

      this.builder.update();
      this.wave.update();
    } catch (error) {
      Analytics.TrackWarn('Failed to update world', error as TypeError);
    }
  }

  public showHint(hint: WorldHint) {
    const id = hint.unique
      ? hashString(hint.label)
      : uuidv4();

    this.events.emit(WorldEvents.SHOW_HINT, id, hint);

    return id;
  }

  public hideHint(id: string) {
    this.events.emit(WorldEvents.HIDE_HINT, id);
  }

  public getTime() {
    return Math.floor(this.lifecyle.getElapsed());
  }

  public isTimePaused() {
    return this.lifecyle.paused;
  }

  public setTimePause(state: boolean) {
    this.lifecyle.paused = state;
  }

  public getTimeScale() {
    return this.lifecyle.timeScale;
  }

  public setTimeScale(scale: number) {
    this.physics.world.timeScale = 1 / scale;

    this.timers.forEach((timer) => {
      // eslint-disable-next-line no-param-reassign
      timer.timeScale = scale;
    });
  }

  public addProgression(params: WorldTimerParams) {
    const delay = params.frequence ?? 50;
    const repeat = Math.ceil(params.duration / delay);
    const timer = this.time.addEvent({
      timeScale: this.getTimeScale(),
      delay,
      repeat,
      callback: () => {
        const left = timer.getRepeatCount() - 1;

        if (params.onProgress) {
          params.onProgress?.(left, repeat);
        }
        if (left <= 0) {
          params.onComplete();
          this.removeProgression(timer);
        }
      },
    });

    this.timers.push(timer);

    return timer;
  }

  public removeProgression(timer: Phaser.Time.TimerEvent): void {
    const index = this.timers.indexOf(timer);

    if (index !== -1) {
      timer.destroy();
      this.timers.splice(index, 1);
    }
  }

  public setModeActive(mode: WorldMode, state: boolean) {
    this.modes[mode] = state;

    this.events.emit(WorldEvents.TOGGLE_MODE, mode, state);
  }

  public isModeActive(mode: WorldMode) {
    return this.modes[mode];
  }

  public getResourceExtractionSpeed() {
    const generators = this.builder.getBuildingsByVariant(BuildingVariant.GENERATOR);
    const countPerSecond = generators.reduce((current, generator) => (
      current + ((1 / generator.getActionsDelay()) * 1000)
    ), 0);

    return countPerSecond;
  }

  public addEntityToGroup(gameObject: Phaser.GameObjects.GameObject, type: EntityType) {
    this.entityGroups[type].add(gameObject);
  }

  public getEntitiesGroup(type: EntityType) {
    return this.entityGroups[type];
  }

  public getEntities<T = Phaser.GameObjects.GameObject>(type: EntityType) {
    return this.entityGroups[type].getChildren() as T[];
  }

  public getFuturePosition(sprite: ISprite, seconds: number): PositionAtWorld {
    const fps = this.game.loop.actualFps;
    const drag = 0.3 ** (1 / fps);
    const per = 1 - drag ** (seconds * fps);
    const offset = {
      x: ((sprite.body.velocity.x / fps) * per) / (1 - drag),
      y: ((sprite.body.velocity.y / fps) * per) / (1 - drag),
    };

    return {
      x: sprite.body.center.x + offset.x,
      y: sprite.body.center.y + offset.y,
    };
  }

  private addEntityGroups() {
    this.entityGroups = {
      [EntityType.CRYSTAL]: this.add.group(),
      [EntityType.NPC]: this.add.group(),
      [EntityType.ENEMY]: this.add.group(),
      [EntityType.BUILDING]: this.add.group({
        runChildUpdate: true,
      }),
      [EntityType.SHOT]: this.add.group({
        runChildUpdate: true,
      }),
      [EntityType.SPRITE]: this.add.group({
        runChildUpdate: true,
      }),
    };
  }

  private addLifecycle() {
    this.lifecyle = this.time.addEvent({
      delay: Number.MAX_SAFE_INTEGER,
      loop: true,
      startAt: this.game.usedSave?.payload.world.time ?? 0,
    });

    this.timers.push(this.lifecyle);
  }

  private addWaveManager() {
    this.wave = new Wave(this);

    if (this.game.usedSave?.payload.wave) {
      this.wave.loadSavePayload(this.game.usedSave.payload.wave);
    } else {
      this.wave.runTimeleft();
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.wave.destroy();
    });
  }

  private addBuilder() {
    this.builder = new Builder(this);

    this.game.events.once(GameEvents.FINISH, () => {
      this.builder.close();
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.builder.destroy();
    });
  }

  private addPlayer() {
    const positionAtMatrix = (
      this.game.usedSave?.payload.player.position
      ?? Phaser.Utils.Array.GetRandom(
        this.level.readSpawnPositions(SpawnTarget.PLAYER),
      )
    );

    this.player = new Player(this, { positionAtMatrix });

    if (this.game.usedSave?.payload.player) {
      this.player.loadSavePayload(this.game.usedSave.payload.player);
    }

    this.camera.focusOn(this.player);

    this.player.live.on(LiveEvents.DEAD, () => {
      this.camera.zoomOut();
      this.game.finishGame();
    });
  }

  private addAssistant() {
    const positionAtMatrix = aroundPosition(this.player.positionAtMatrix).find((spawn) => {
      const biome = this.level.map.getAt(spawn);

      return biome?.solid;
    });

    this.assistant = new Assistant(this, {
      owner: this.player,
      positionAtMatrix: positionAtMatrix || this.player.positionAtMatrix,
      speed: this.player.speed,
    });
  }

  private addCrystals() {
    const positions = this.level.readSpawnPositions(SpawnTarget.CRYSTAL);

    const getRandomPosition = () => {
      const freePositions = positions.filter((position) => this.level.isFreePoint({ ...position, z: 1 }));

      return Phaser.Utils.Array.GetRandom(freePositions);
    };

    const create = (position: PositionAtMatrix) => {
      const variants = LEVEL_PLANETS[this.level.planet].CRYSTAL_VARIANTS;

      new Crystal(this, {
        positionAtMatrix: position,
        variant: Phaser.Utils.Array.GetRandom(variants),
      });
    };

    const getMaxCount = () => progressionLinear({
      defaultValue: DIFFICULTY.CRYSTAL_COUNT / this.game.getDifficultyMultiplier(),
      scale: DIFFICULTY.CRYSTAL_COUNT_GROWTH,
      level: this.wave.number,
      maxLevel: DIFFICULTY.CRYSTAL_COUNT_GROWTH_MAX_LEVEL,
    });

    if (this.game.usedSave?.payload.world.crystals) {
      this.game.usedSave.payload.world.crystals.forEach((crystal) => {
        create(crystal.position);
      });
    } else {
      const maxCount = getMaxCount();

      for (let i = 0; i < maxCount; i++) {
        const position = getRandomPosition();

        create(position);
      }
    }

    this.wave.on(WaveEvents.COMPLETE, () => {
      const newCount = getMaxCount() - this.getEntitiesGroup(EntityType.CRYSTAL).getTotalUsed();

      for (let i = 0; i < newCount; i++) {
        const position = getRandomPosition();

        create(position);
      }
    });
  }

  public getSavePayload(): WorldSavePayload {
    return {
      time: this.getTime(),
      crystals: this.getEntities<ICrystal>(EntityType.CRYSTAL)
        .map((crystal) => crystal.getSavePayload()),
      buildings: this.getEntities<IBuilding>(EntityType.BUILDING)
        .map((building) => building.getSavePayload()),
    };
  }

  private loadSavePayload(data: WorldSavePayload) {
    data.buildings.forEach((buildingData) => {
      try {
        // PATCH: For saves with old version
        // @ts-ignore
        const variant = (buildingData.variant === 'ELECTRO')
          ? BuildingVariant.TOWER_ELECTRO
          : buildingData.variant;

        const building = this.builder.createBuilding({
          variant,
          positionAtMatrix: buildingData.position,
        });

        building.loadSavePayload(buildingData);
      } catch (error) {
        Analytics.TrackWarn(`Failed to load '${buildingData.variant}' building`, error as TypeError);
      }
    });
  }
}
