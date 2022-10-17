import { ASSISTANT_PATH_BREAKPOINT, ASSISTANT_TILE_SIZE } from '~const/assistant';
import { DIFFICULTY } from '~const/difficulty';
import { NPC } from '~entity/npc';
import { Enemy } from '~entity/npc/variants/enemy';
import { ShotBall } from '~entity/shot';
import { registerAssets } from '~lib/assets';
import { calcGrowth, selectClosest } from '~lib/utils';
import { World } from '~scene/world';
import { AssistantTexture, AssistantData } from '~type/world/entities/assistant';
import { ShotParams, ShotTexture } from '~type/world/entities/shot';

export class Assistant extends NPC {
  /**
   * Assistant shot item.
   */
  readonly shot: ShotBall;

  /**
   * Pause between attacks.
   */
  private attackPause: number = 0;

  /**
   * Assistant constructor.
   */
  constructor(scene: World, {
    positionAtMatrix,
  }: AssistantData) {
    super(scene, {
      texture: AssistantTexture.ASSISTANT,
      positionAtMatrix,
      speed: DIFFICULTY.ASSISTANT_SPEED,
      health: DIFFICULTY.ASSISTANT_HEALTH,
      pathBreakpoint: ASSISTANT_PATH_BREAKPOINT,
    });
    scene.add.existing(this);
    scene.npc.add(this);

    this.shot = new ShotBall(this, {
      texture: ShotTexture.FIRE,
    });

    // Configure physics
    this.body.setCircle(this.width / 2, 0.0, 1.0);
  }

  /**
   * Event update.
   */
  public update() {
    this.attack();

    const targetReached = super.update();

    if (!targetReached) {
      return;
    }

    this.setVelocity(0, 0);
  }

  /**
   * Upgrade by level.
   *
   * @param level - Player level
   */
  public upgrade(level: number) {
    this.speed = calcGrowth(
      DIFFICULTY.ASSISTANT_SPEED,
      DIFFICULTY.ASSISTANT_SPEED_GROWTH,
      level,
    );

    const maxHealth = calcGrowth(
      DIFFICULTY.ASSISTANT_HEALTH,
      DIFFICULTY.ASSISTANT_HEALTH_GROWTH,
      level,
    );

    this.live.setMaxHealth(maxHealth);
    this.live.heal();
  }

  /**
   * Attack enemy.
   */
  private attack() {
    const now = this.scene.getTimerNow();

    if (this.attackPause >= now) {
      return;
    }

    const target = this.getTarget();

    if (!target) {
      return;
    }

    const params = this.getShotParams();

    this.shot.shoot(target, params);

    this.attackPause = now + DIFFICULTY.ASSISTANT_ATTACK_PAUSE;
  }

  /**
   * Find nearby enemy for shoot.
   */
  private getTarget(): Enemy {
    const attackDistance = calcGrowth(
      DIFFICULTY.ASSISTANT_ATTACK_DISTANCE,
      DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
      this.scene.player.level,
    );

    const enemies = (<Enemy[]> this.scene.enemies.getChildren()).filter((enemy) => (
      !enemy.live.isDead()
      && Phaser.Math.Distance.BetweenPoints(enemy, this) <= attackDistance
    ));

    if (enemies.length === 0) {
      return null;
    }

    return selectClosest(enemies, this)[0];
  }

  /**
   * Get shot params.
   */
  private getShotParams() {
    const params: ShotParams = {
      maxDistance: calcGrowth(
        DIFFICULTY.ASSISTANT_ATTACK_DISTANCE,
        DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
        this.scene.player.level,
      ),
      speed: calcGrowth(
        DIFFICULTY.ASSISTANT_ATTACK_SPEED,
        DIFFICULTY.ASSISTANT_ATTACK_SPEED_GROWTH,
        this.scene.player.level,
      ),
      damage: calcGrowth(
        DIFFICULTY.ASSISTANT_ATTACK_DAMAGE,
        DIFFICULTY.ASSISTANT_ATTACK_DAMAGE_GROWTH,
        this.scene.player.level,
      ),
    };

    return params;
  }
}

registerAssets([{
  key: AssistantTexture.ASSISTANT,
  type: 'spritesheet',
  url: `assets/sprites/${AssistantTexture.ASSISTANT}.png`,
  // @ts-ignore
  frameConfig: {
    frameWidth: ASSISTANT_TILE_SIZE[0],
    frameHeight: ASSISTANT_TILE_SIZE[1],
  },
}]);
