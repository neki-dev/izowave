import { ASSISTANT_PATH_BREAKPOINT, ASSISTANT_TILE_SIZE } from '~const/assistant';
import { DIFFICULTY } from '~const/difficulty';
import { NPC } from '~entity/npc';
import { Enemy } from '~entity/npc/variants/enemy';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { calcGrowth, selectClosest } from '~lib/utils';
import { World } from '~scene/world';
import { Effect } from '~scene/world/effects';
import { EffectTexture } from '~type/world/effects';
import { AssistantTexture, AssistantData, AssistantAudio } from '~type/world/entities/assistant';
import { ShotParams } from '~type/world/entities/shot';

export class Assistant extends NPC {
  /**
   * Assistant shot item.
   */
  readonly shot: ShotBallFire;

  /**
   * Pause for next attack.
   */
  private nextAttackTimestamp: number = 0;

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

    this.shot = new ShotBallFire(this);

    this.body.setCircle(this.width / 2, 0, 1);
  }

  /**
   * Event update.
   */
  public update() {
    super.update();

    if (this.pathComplete) {
      this.setVelocity(0, 0);
    }

    if (!this.scene.player.live.isDead()) {
      this.attack();
    }
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
   * Event dead.
   */
  public onDead() {
    super.onDead();

    if (!this.visible) {
      return;
    }

    new Effect(this.scene, {
      texture: EffectTexture.EXPLOSION,
      audio: AssistantAudio.DEAD,
      position: this,
    });
  }

  /**
   * Attack enemy.
   */
  private attack() {
    const now = this.scene.getTimerNow();

    if (this.nextAttackTimestamp >= now) {
      return;
    }

    const target = this.getTarget();

    if (!target) {
      return;
    }

    const params = this.getShotParams();

    this.shot.shoot(target, params);

    const pause = calcGrowth(
      DIFFICULTY.ASSISTANT_ATTACK_PAUSE,
      DIFFICULTY.ASSISTANT_ATTACK_PAUSE_GROWTH,
      this.scene.player.level,
    );

    this.nextAttackTimestamp = now + pause;
  }

  /**
   * Find nearby enemy for shoot.
   */
  private getTarget(): Enemy {
    const distance = calcGrowth(
      DIFFICULTY.ASSISTANT_ATTACK_DISTANCE,
      DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
      this.scene.player.level,
    );

    const enemies = (<Enemy[]> this.scene.enemies.getChildren()).filter((enemy) => (
      !enemy.live.isDead()
      && Phaser.Math.Distance.BetweenPoints(enemy, this) <= distance
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

registerAudioAssets(AssistantAudio);
registerSpriteAssets(AssistantTexture, {
  width: ASSISTANT_TILE_SIZE[0],
  height: ASSISTANT_TILE_SIZE[1],
});
