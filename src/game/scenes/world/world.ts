import Phaser from 'phaser';
import { Interface } from 'phaser-react-ui';
import { v4 as uuidv4 } from 'uuid';

import { DIFFICULTY } from '~const/world/difficulty';
import { ENEMIES } from '~const/world/entities/enemies';
import {
  ENEMY_SPAWN_DISTANCE_FROM_BUILDING, ENEMY_SPAWN_DISTANCE_FROM_PLAYER, ENEMY_SPAWN_POSITIONS, ENEMY_SPAWN_POSITIONS_GRID,
} from '~const/world/entities/enemy';
import { LEVEL_PLANETS } from '~const/world/level';
import { Crystal } from '~entity/crystal';
import { Assistant } from '~entity/npc/variants/assistant';
import { Player } from '~entity/player';
import { Scene } from '~game/scenes';
import { aroundPosition, sortByDistance } from '~lib/utils';
import { Builder } from '~scene/world/builder';
import { Camera } from '~scene/world/camera';
import { WorldUI } from '~scene/world/interface';
import { Level } from '~scene/world/level';
import { Wave } from '~scene/world/wave';
import { GameScene } from '~type/game';
import { LiveEvents } from '~type/live';
import { IWorld, WorldEvents, WorldHint } from '~type/world';
import { IBuilder } from '~type/world/builder';
import { ICamera } from '~type/world/camera';
import { EntityType } from '~type/world/entities';
import { BuildingVariant, IBuilding } from '~type/world/entities/building';
import { IAssistant } from '~type/world/entities/npc/assistant';
import { EnemyVariant, IEnemy } from '~type/world/entities/npc/enemy';
import { IPlayer, PlayerSkill } from '~type/world/entities/player';
import { ISprite } from '~type/world/entities/sprite';
import {
  ILevel, LevelPlanet, SpawnTarget, Vector2D,
} from '~type/world/level';
import { IWave, WaveEvents } from '~type/world/wave';

export class World extends Scene implements IWorld {
  private entityGroups: Record<EntityType, Phaser.GameObjects.Group>;

  private _player: IPlayer;

  public get player() { return this._player; }

  private set player(v) { this._player = v; }

  private _assistant: Nullable<IAssistant> = null;

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

  private _camera: ICamera;

  public get camera() { return this._camera; }

  private set camera(v) { this._camera = v; }

  public enemySpawnPositions: Vector2D[] = [];

  private enemySpawnPositionsAnalog: Vector2D[] = [];

  private lifecyle: Phaser.Time.TimerEvent;

  private currentHintId: Nullable<string> = null;

  private _deltaTime: number = 1;

  public get deltaTime() { return this._deltaTime; }

  private set deltaTime(v) { this._deltaTime = v; }

  constructor() {
    super(GameScene.WORLD);
  }

  public create(data: { planet?: LevelPlanet }) {
    this.input.setPollAlways();

    this.lifecyle = this.time.addEvent({
      delay: Number.MAX_SAFE_INTEGER,
      loop: true,
    });

    this.level = new Level(this, data.planet ?? LevelPlanet.EARTH);
    this.camera = new Camera(this);

    this.generateEnemySpawnPositions();
  }

  public start() {
    new Interface(this, WorldUI);

    this.addEntityGroups();

    this.camera.addZoomControl();

    this.wave = new Wave(this);

    this.addPlayer();
    this.addAssistant();
    this.addCrystals();

    this.builder = new Builder(this);
  }

  public update(time: number, delta: number) {
    if (!this.game.isStarted) {
      return;
    }

    this.deltaTime = delta;

    this.player.update();
    this.builder.update();
    this.wave.update();
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
    return Math.floor(this.lifecyle.getElapsed());
  }

  public isTimePaused() {
    return this.lifecyle.paused;
  }

  public setTimePause(state: boolean) {
    this.lifecyle.paused = state;
  }

  public getResourceExtractionSpeed() {
    const generators = this.builder.getBuildingsByVariant(BuildingVariant.GENERATOR);
    const countPerSecond = generators.reduce((current, generator) => (
      current + ((1 / generator.getActionsDelay()) * 1000)
    ), 0);

    return countPerSecond;
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

  public spawnEnemy(variant: EnemyVariant): Nullable<IEnemy> {
    const EnemyInstance = ENEMIES[variant];
    const positionAtMatrix = this.getEnemySpawnPosition();
    const enemy: IEnemy = new EnemyInstance(this, { positionAtMatrix });

    return enemy;
  }

  private generateEnemySpawnPositions() {
    this.enemySpawnPositions = this.level.readSpawnPositions(
      SpawnTarget.ENEMY,
      ENEMY_SPAWN_POSITIONS_GRID,
    );

    this.enemySpawnPositionsAnalog = [];
    for (let x = 0; x < this.level.map.width; x++) {
      for (let y = 0; y < this.level.map.height; y++) {
        if (
          x === 0
          || x === this.level.map.width - 1
          || y === 0
          || y === this.level.map.height - 1
        ) {
          this.enemySpawnPositionsAnalog.push({ x, y });
        }
      }
    }
  }

  public getEnemySpawnPosition() {
    const buildings = this.getEntities<IBuilding>(EntityType.BUILDING);
    let freePositions = this.enemySpawnPositions.filter((position) => (
      Phaser.Math.Distance.BetweenPoints(position, this.player.positionAtMatrix) >= ENEMY_SPAWN_DISTANCE_FROM_PLAYER
      && buildings.every((building) => (
        Phaser.Math.Distance.BetweenPoints(position, building.positionAtMatrix) >= ENEMY_SPAWN_DISTANCE_FROM_BUILDING
      ))
    ));

    if (freePositions.length === 0) {
      freePositions = this.enemySpawnPositionsAnalog;
    }

    const closestPositions = sortByDistance(freePositions, this.player.positionAtMatrix)
      .slice(0, ENEMY_SPAWN_POSITIONS);
    const positionAtMatrix = Phaser.Utils.Array.GetRandom(closestPositions);

    return positionAtMatrix;
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

  private addEntityGroups() {
    this.entityGroups = {
      [EntityType.CRYSTAL]: this.add.group(),
      [EntityType.ENEMY]: this.add.group(),
      [EntityType.NPC]: this.add.group({
        runChildUpdate: true,
      }),
      [EntityType.BUILDING]: this.add.group({
        runChildUpdate: true,
      }),
      [EntityType.SHOT]: this.add.group({
        runChildUpdate: true,
      }),
    };
  }

  private addPlayer() {
    const positions = this.level.readSpawnPositions(SpawnTarget.PLAYER);

    this.player = new Player(this, {
      positionAtMatrix: Phaser.Utils.Array.GetRandom(positions),
    });

    this.camera.focusOn(this.player);

    this.player.live.on(LiveEvents.DEAD, () => {
      this.camera.zoomOut();
      this.game.finishGame();
    });
  }

  private addAssistant() {
    const create = () => {
      const positionAtMatrix = aroundPosition(this.player.positionAtMatrix).find((spawn) => {
        const biome = this.level.map.getAt(spawn);

        return biome?.solid;
      });

      this.assistant = new Assistant(this, {
        owner: this.player,
        positionAtMatrix: positionAtMatrix || this.player.positionAtMatrix,
        speed: this.player.speed,
        health: this.player.live.maxHealth,
        level: this.player.upgradeLevel[PlayerSkill.ASSISTANT],
      });

      this.assistant.once(Phaser.Scenes.Events.DESTROY, () => {
        this.assistant = null;
        this.wave.once(WaveEvents.COMPLETE, () => {
          create();
        });
      });
    };

    create();
  }

  private addCrystals() {
    const positions = this.level.readSpawnPositions(SpawnTarget.CRYSTAL);

    const create = () => {
      const freePositions = positions.filter((position) => this.level.isFreePoint({ ...position, z: 1 }));
      const variants = LEVEL_PLANETS[this.level.planet].CRYSTAL_VARIANTS;

      new Crystal(this, {
        positionAtMatrix: Phaser.Utils.Array.GetRandom(freePositions),
        variant: Phaser.Utils.Array.GetRandom(variants),
      });
    };

    const maxCount = Math.ceil(
      Math.floor((this.level.size * DIFFICULTY.CRYSTAL_SPAWN_FACTOR) / this.game.getDifficultyMultiplier()),
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
}
