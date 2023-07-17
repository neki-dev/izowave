import { DIFFICULTY } from '~const/world/difficulty';
import { progressionLinear } from '~lib/utils';
import { Particles } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import {
  BuildingVariant, BuildingTexture, BuildingParam, BuildingVariantData, BuildingIcon,
} from '~type/world/entities/building';
import { IAssistant } from '~type/world/entities/npc/assistant';
import { IPlayer } from '~type/world/entities/player';

import { Building } from '../building';

export class BuildingMedic extends Building {
  static Name = 'Medic';

  static Description = 'Heals player, that are in radius of this building';

  static Params: BuildingParam[] = [
    { label: 'HEALTH', value: DIFFICULTY.BUILDING_MEDIC_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'HEAL', value: DIFFICULTY.BUILDING_MEDIC_HEAL_AMOUNT, icon: BuildingIcon.HEAL },
  ];

  static Texture = BuildingTexture.MEDIC;

  static Cost = DIFFICULTY.BUILDING_MEDIC_COST;

  static Health = DIFFICULTY.BUILDING_MEDIC_HEALTH;

  static Limit = DIFFICULTY.BUILDING_MEDIC_LIMIT;

  static AllowByWave = DIFFICULTY.BUILDING_MEDIC_ALLOW_BY_WAVE;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.MEDIC,
      health: BuildingMedic.Health,
      texture: BuildingMedic.Texture,
      actions: {
        radius: DIFFICULTY.BUILDING_MEDIC_HEAL_RADIUS,
        pause: DIFFICULTY.BUILDING_MEDIC_HEAL_PAUSE,
      },
    });
  }

  public update() {
    super.update();

    if (!this.isActionAllowed()) {
      return;
    }

    const target = this.getTarget();

    if (!target) {
      return;
    }

    this.heal(target);
    this.pauseActions();
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'HEAL',
      icon: BuildingIcon.HEAL,
      value: this.getHealAmount(),
    }];

    return super.getInfo().concat(info);
  }

  private getTarget() {
    const candidates = [this.scene.player, this.scene.player.assistant];

    return candidates.find((candidate) => (
      candidate
      && !candidate.live.isDead()
      && !candidate.live.isMaxHealth()
      && this.actionsAreaContains(candidate)
    ));
  }

  private getHealAmount() {
    return progressionLinear(
      DIFFICULTY.BUILDING_MEDIC_HEAL_AMOUNT,
      DIFFICULTY.BUILDING_MEDIC_HEAL_AMOUNT_GROWTH,
      this.upgradeLevel,
    );
  }

  private heal(target: IPlayer | IAssistant) {
    const health = this.getHealAmount();

    target.live.addHealth(health);

    if (
      !this.visible
      || !this.scene.game.isSettingEnabled(GameSettings.EFFECTS)
    ) {
      return;
    }

    new Particles(this, {
      key: 'heal',
      texture: ParticlesTexture.BIT,
      positionAtWorld: this,
      params: {
        duration: 500,
        lifespan: { min: 100, max: 300 },
        scale: { start: 1.0, end: 0.5 },
        speed: 100,
        maxAliveParticles: 6,
        alpha: 0.75,
      },
    });
  }
}
