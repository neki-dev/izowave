import Phaser from 'phaser';
import { Interface } from 'phaser-react-ui';
import { v4 as uuidv4 } from 'uuid';

import { CONTROL_KEY } from '~const/controls';
import {
  WORLD_FEATURES, WORLD_FIND_PATH_RATE, WORLD_MAX_ZOOM, WORLD_MIN_ZOOM,
} from '~const/world';
import { DIFFICULTY } from '~const/world/difficulty';
import { ENEMIES } from '~const/world/entities/enemies';
import {
  ENEMY_SPAWN_DISTANCE_FROM_BUILDING, ENEMY_SPAWN_DISTANCE_FROM_PLAYER, ENEMY_SPAWN_POSITIONS,
} from '~const/world/entities/enemy';
import { Crystal } from '~entity/crystal';
import { Player } from '~entity/player';
import { Scene } from '~game/scenes';
import { sortByDistance } from '~lib/utils';
import { Builder } from '~scene/world/builder';
import { WorldUI } from '~scene/world/interface';
import { Level } from '~scene/world/level';
import { Wave } from '~scene/world/wave';
import { GameScene } from '~type/game';
import { NoticeType } from '~type/screen';
import {
  IWorld, WorldEvents, WorldFeature, WorldHint,
} from '~type/world';
import { IBuilder } from '~type/world/builder';
import { EntityType } from '~type/world/entities';
import { BuildingVariant, IBuilding } from '~type/world/entities/building';
import { LiveEvents } from '~type/world/entities/live';
import { INPC } from '~type/world/entities/npc';
import { EnemyVariant, IEnemy } from '~type/world/entities/npc/enemy';
import { IPlayer } from '~type/world/entities/player';
import { ISprite } from '~type/world/entities/sprite';
import { ILevel, SpawnTarget, Vector2D } from '~type/world/level';
import { IWave, WaveEvents } from '~type/world/wave';

export class World extends Scene implements IWorld {
  private entityGroups: Record<EntityType, Phaser.GameObjects.Group>;

  private _player: IPlayer;

  public get player() { return this._player; }

  private set player(v) { this._player = v; }

  private _level: ILevel;

  public get level() { return this._level; }

  private set level(v) { this._level = v; }

  private _wave: IWave;

  public get wave() { return this._wave; }

  private set wave(v) { this._wave = v; }

  private _builder: IBuilder;

  public get builder() { return this._builder; }

  private set builder(v) { this._builder = v; }

  public selectedBuilding: Nullable<IBuilding> = null;

  private enemySpawnPositions: Vector2D[] = [];

  private lifecyleTimer: Phaser.Time.TimerEvent;

  private nextFindPathTimestamp: number = 0;

  private currentHintId: Nullable<string> = null;

  private _deltaTime: number = 1;

  public get deltaTime() { return this._deltaTime; }

  private set deltaTime(v) { this._deltaTime = v; }

  private _activeFeatures: Partial<Record<WorldFeature, boolean>> = {};

  public get activeFeatures() { return this._activeFeatures; }

  private set activeFeatures(v) { this._activeFeatures = v; }

  constructor() {
    super(GameScene.WORLD);
  }

  public create() {
    this.makeLevel();
    this.addLifecycleTime();

    this.input.setPollAlways();
  }

  public start() {
    new Interface(this, WorldUI);

    this.addZoomControl();
    this.addEntityGroups();

    this.wave = new Wave(this);

    this.addPlayer();
    this.addCrystals();

    this.builder = new Builder(this);

    this.level.hideTiles();
  }

  public update(time: number, delta: number) {
    if (!this.game.isStarted) {
      return;
    }

    this.deltaTime = delta;

    this.player.update();
    this.builder.update();
    this.wave.update();
    this.level.updateVisibleTiles();
    this.updateNPCPath();
  }

  public showHint(hint: WorldHint) {
    this.currentHintId = uuidv4();
    this.events.emit(WorldEvents.SHOW_HINT, hint);

    return this.currentHintId;
  }

  public hideHint(id?: string) {
    if (!id || id === this.currentHintId) {
      this.events.emit(WorldEvents.HIDE_HINT);
      this.currentHintId = null;
    }
  }

  public getTime() {
    return Math.floor(this.lifecyleTimer.getElapsed());
  }

  public isTimePaused() {
    return this.lifecyleTimer.paused;
  }

  public setTimePause(state: boolean) {
    this.lifecyleTimer.paused = state;
  }

  public addEntity(type: EntityType, gameObject: Phaser.GameObjects.GameObject) {
    this.add.existing(gameObject);
    this.entityGroups[type].add(gameObject);
  }

  public getEntitiesGroup(type: EntityType) {
    return this.entityGroups[type];
  }

  public getEntities<T = Phaser.GameObjects.GameObject>(type: EntityType) {
    return this.entityGroups[type].getChildren() as T[];
  }

  public getBuildingsByVariant(variant: BuildingVariant) {
    const buildings = this.getEntities<IBuilding>(EntityType.BUILDING);

    return buildings.filter((building) => (building.variant === variant));
  }

  public spawnEnemy(variant: EnemyVariant) {
    const buildings = this.getEntities<IBuilding>(EntityType.BUILDING);
    const allowedPositions = this.enemySpawnPositions.filter((position) => (
      Phaser.Math.Distance.BetweenPoints(position, this.player.positionAtMatrix) >= ENEMY_SPAWN_DISTANCE_FROM_PLAYER
      && buildings.every((building) => (
        Phaser.Math.Distance.BetweenPoints(position, building.positionAtMatrix) >= ENEMY_SPAWN_DISTANCE_FROM_BUILDING
      ))
    ));

    if (allowedPositions.length === 0) {
      console.warn('Invalid enemy spawn positions');

      return null;
    }

    const EnemyInstance = ENEMIES[variant];
    const positions = sortByDistance(allowedPositions, this.player.positionAtMatrix)
      .slice(0, ENEMY_SPAWN_POSITIONS);
    const enemy: IEnemy = new EnemyInstance(this, {
      positionAtMatrix: Phaser.Utils.Array.GetRandom(positions),
    });

    return enemy;
  }

  public getFuturePosition(sprite: ISprite, seconds: number): Vector2D {
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

  public useFeature(type: WorldFeature) {
    if (this.activeFeatures[type]) {
      return;
    }

    const { cost, duration } = WORLD_FEATURES[type];

    if (this.player.resources < cost) {
      this.game.screen.notice(NoticeType.ERROR, 'NOT ENOUGH RESOURCES');

      return;
    }

    this.activeFeatures[type] = true;

    this.player.takeResources(cost);

    this.events.emit(WorldEvents.USE_FEATURE, type);

    this.time.addEvent({
      delay: duration,
      callback: () => {
        delete this.activeFeatures[type];
      },
    });
  }

  private updateNPCPath() {
    const now = Date.now();

    if (this.nextFindPathTimestamp > now) {
      return;
    }

    const npcs = this.getEntities<INPC>(EntityType.NPC);

    for (const npc of npcs) {
      try {
        npc.findPathToTarget();
      } catch (e) {
        console.error('Error on update NPC path:', e);
      }
    }

    this.level.navigator.processing();

    this.nextFindPathTimestamp = now + WORLD_FIND_PATH_RATE;
  }

  private addLifecycleTime() {
    this.lifecyleTimer = this.time.addEvent({
      delay: Number.MAX_SAFE_INTEGER,
      loop: true,
    });
  }

  private addEntityGroups() {
    this.entityGroups = {
      [EntityType.BUILDING]: this.add.group({ runChildUpdate: true }),
      [EntityType.NPC]: this.add.group({ runChildUpdate: true }),
      [EntityType.ENEMY]: this.add.group(),
      [EntityType.SHOT]: this.add.group({ runChildUpdate: true }),
      [EntityType.CRYSTAL]: this.add.group(),
    };
  }

  private makeLevel() {
    this.level = new Level(this);
    this.enemySpawnPositions = this.level.readSpawnPositions(SpawnTarget.ENEMY);
  }

  private addPlayer() {
    const positions = this.level.readSpawnPositions(SpawnTarget.PLAYER);

    this.player = new Player(this, {
      positionAtMatrix: Phaser.Utils.Array.GetRandom(positions),
    });

    this.cameras.main.resetFX();
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(WORLD_MIN_ZOOM);
    this.cameras.main.zoomTo(WORLD_MAX_ZOOM, 100);

    this.player.live.on(LiveEvents.DEAD, () => {
      this.game.finishGame();
    });
  }

  private addCrystals() {
    const positions = this.level.readSpawnPositions(SpawnTarget.CRYSTAL);

    const create = () => {
      new Crystal(this, {
        positionAtMatrix: Phaser.Utils.Array.GetRandom(positions),
        variant: Phaser.Math.Between(0, 3),
      });
    };

    const maxCount = Math.ceil(
      Math.floor(this.level.size * DIFFICULTY.CRYSTAL_SPAWN_FACTOR),
    );

    for (let i = 0; i < maxCount; i++) {
      create();
    }

    this.wave.on(WaveEvents.COMPLETE, () => {
      const newCount = maxCount - this.getEntitiesGroup(EntityType.CRYSTAL).getTotalUsed();

      for (let i = 0; i < newCount; i++) {
        create();
      }
    });
  }

  private addZoomControl() {
    this.input.keyboard?.on(CONTROL_KEY.ZOOM_OUT, () => {
      if (this.cameras.main.zoom === WORLD_MAX_ZOOM) {
        this.cameras.main.zoomTo(WORLD_MIN_ZOOM, 300);
      }
    });

    this.input.keyboard?.on(CONTROL_KEY.ZOOM_IN, () => {
      if (this.cameras.main.zoom === WORLD_MIN_ZOOM) {
        this.cameras.main.zoomTo(WORLD_MAX_ZOOM, 300);
      }
    });
  }
}
