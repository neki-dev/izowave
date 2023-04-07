import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import {
  WORLD_DEPTH_EFFECT, WORLD_FIND_PATH_RATE, WORLD_MAX_ZOOM, WORLD_MIN_ZOOM,
} from '~const/world';
import { DIFFICULTY } from '~const/world/difficulty';
import { ENEMIES } from '~const/world/entities/enemies';
import {
  ENEMY_SPAWN_DISTANCE_FROM_BUILDING, ENEMY_SPAWN_DISTANCE_FROM_PLAYER, ENEMY_SPAWN_POSITIONS,
} from '~const/world/entities/enemy';
import { Chest } from '~entity/chest';
import { Player } from '~entity/player';
import { Interface } from '~lib/interface';
import { eachEntries } from '~lib/system';
import { sortByDistance } from '~lib/utils';
import { Builder } from '~scene/world/builder';
import { Level } from '~scene/world/level';
import { Wave } from '~scene/world/wave';
import { IGame, SceneKey } from '~type/game';
import { IWorld, WorldEvents, WorldHint } from '~type/world';
import { IBuilder } from '~type/world/builder';
import { ParticlesList, ParticlesTexture, ParticlesType } from '~type/world/effects';
import { BuildingVariant, IBuilding } from '~type/world/entities/building';
import { LiveEvents } from '~type/world/entities/live';
import { INPC } from '~type/world/entities/npc';
import { EnemyVariant, IEnemy } from '~type/world/entities/npc/enemy';
import { IPlayer } from '~type/world/entities/player';
import { ILevel, SpawnTarget, Vector2D } from '~type/world/level';
import { IWave, WaveEvents } from '~type/world/wave';

import { WorldUI } from './ui';

export class World extends Phaser.Scene implements IWorld {
  readonly game: IGame;

  private _entityGroups: Record<string, Phaser.GameObjects.Group>;

  public get entityGroups() { return this._entityGroups; }

  private set entityGroups(v) { this._entityGroups = v; }

  private _particles: ParticlesList = {};

  public get particles() { return this._particles; }

  private set particles(v) { this._particles = v; }

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

  private enemySpawnPositions: Vector2D[] = [];

  private lifecyleTimer: Phaser.Time.TimerEvent;

  private nextFindPathTimestamp: number = 0;

  constructor() {
    super(SceneKey.WORLD);
  }

  public create() {
    this.registerOptimization();
    this.registerParticles();

    this.makeLevel();
    this.addLifecycleTime();
    this.enableCheats();

    this.input.setPollAlways();
  }

  public start() {
    new Interface(this, WorldUI);

    this.wave = new Wave(this);
    this.builder = new Builder(this);

    this.addEntityGroups();
    this.addPlayer();
    this.addChests();
    this.addZoomControl();

    this.level.hideTiles();
  }

  public update() {
    if (!this.game.isStarted) {
      return;
    }

    this.player.update();
    this.builder.update();
    this.wave.update();
    this.level.updateVisibleTiles();
    this.updateNPCPath();
  }

  public showHint(hint: WorldHint) {
    this.events.emit(WorldEvents.SHOW_HINT, hint);
  }

  public hideHint() {
    this.events.emit(WorldEvents.HIDE_HINT);
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

  public getBuildings() {
    return this.entityGroups.buildings.getChildren() as IBuilding[];
  }

  public getBuildingsByVariant(variant: BuildingVariant) {
    const buildings = this.getBuildings();

    return buildings.filter((building) => (building.variant === variant));
  }

  public getEnemies() {
    return this.entityGroups.enemies.getChildren() as IEnemy[];
  }

  public spawnEnemy(variant: EnemyVariant): IEnemy {
    const buildings = this.getBuildings();
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

    return new EnemyInstance(this, {
      positionAtMatrix: Phaser.Utils.Array.GetRandom(positions),
    });
  }

  private updateNPCPath() {
    const now = Date.now();

    if (this.nextFindPathTimestamp > now) {
      return;
    }

    for (const npc of <INPC[]> this.entityGroups.npc.getChildren()) {
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
      paused: !this.game.tutorial.isDisabled,
      loop: true,
    });
  }

  private addEntityGroups() {
    this.entityGroups = {
      chests: this.add.group(),
      buildings: this.add.group({ runChildUpdate: true }),
      shots: this.add.group({ runChildUpdate: true }),
      npc: this.add.group({ runChildUpdate: true }),
      enemies: this.add.group(),
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
    this.cameras.main.setZoom(1.3);
    this.cameras.main.zoomTo(1.0, 100);

    this.player.live.on(LiveEvents.DEAD, () => {
      this.game.finishGame();
    });
  }

  private addChests() {
    const positions = this.level.readSpawnPositions(SpawnTarget.CHEST);

    const create = () => {
      new Chest(this, {
        positionAtMatrix: Phaser.Utils.Array.GetRandom(positions),
        variant: Phaser.Math.Between(0, 14),
      });
    };

    const maxCount = Math.ceil(
      Math.floor(this.level.size * DIFFICULTY.CHEST_SPAWN_FACTOR) / this.game.difficulty,
    );

    for (let i = 0; i < maxCount; i++) {
      create();
    }

    this.wave.on(WaveEvents.COMPLETE, () => {
      const newCount = maxCount - this.entityGroups.chests.getTotalUsed();

      for (let i = 0; i < newCount; i++) {
        create();
      }
    });
  }

  private addZoomControl() {
    this.input.keyboard.on(CONTROL_KEY.ZOOM_IN, () => {
      const currentZoom = this.cameras.main.zoom;

      if (currentZoom < WORLD_MAX_ZOOM) {
        this.cameras.main.zoomTo(currentZoom + 0.5, 300);
      }
    });

    this.input.keyboard.on(CONTROL_KEY.ZOOM_OUT, () => {
      const currentZoom = this.cameras.main.zoom;

      if (currentZoom > WORLD_MIN_ZOOM) {
        this.cameras.main.zoomTo(currentZoom - 0.5, 300);
      }
    });
  }

  private enableCheats() {
    const scheme = {
      HEALPLS: () => {
        this.player.live.heal();
      },
      RICHBITCH: () => {
        this.player.giveResources(9999);
      },
      BOOSTME: () => {
        this.player.giveExperience(9999);
      },
      GODHAND: () => {
        this.wave.skipEnemies();
        for (const enemy of this.getEnemies()) {
          enemy.live.kill();
        }
      },
      FUTURE: () => {
        this.wave.number += Phaser.Math.Between(3, 7);
        this.wave.runTimeleft();
      },
      PEACE: () => {
        this.wave.isPeaceMode = !this.wave.isPeaceMode;
      },
    };

    eachEntries(scheme, (code, callback) => {
      // @ts-ignore
      window[code] = () => {
        if (this.game.isStarted) {
          callback();

          return 'Cheat activated';
        }

        return null;
      };
    });
  }

  private registerParticles() {
    for (const effect of Object.values(ParticlesType)) {
      const particles = this.add.particles(ParticlesTexture[effect]);

      particles.setDepth(WORLD_DEPTH_EFFECT);
      this.particles[effect] = particles;
    }
  }

  private registerOptimization() {
    const ref = this.scene.systems.displayList;

    ref.depthSort = () => {
      if (ref.sortChildrenFlag) {
        ref.list.sort(ref.sortByDepth);
        ref.sortChildrenFlag = false;
      }
    };
  }
}
