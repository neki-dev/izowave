import { DIFFICULTY } from '~const/world/difficulty';
import { progressionLinear } from '~lib/difficulty';
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

  static Description = 'Heals player and assistant within building radius';

  static Params: BuildingParam[] = [
    { label: 'Health', value: DIFFICULTY.BUILDING_MEDIC_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'Power', value: `${DIFFICULTY.BUILDING_MEDIC_HEAL_AMOUNT} HP`, icon: BuildingIcon.HEAL },
  ];

  static Texture = BuildingTexture.MEDIC;

  static Cost = DIFFICULTY.BUILDING_MEDIC_COST;

  static Health = DIFFICULTY.BUILDING_MEDIC_HEALTH;

  static LimitFactor = DIFFICULTY.BUILDING_MEDIC_LIMIT_FACTOR;

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
      label: 'Power',
      icon: BuildingIcon.HEAL,
      value: `${this.getHealAmount()} HP`,
    }];

    return super.getInfo().concat(info);
  }

  private getTarget() {
    const candidates = [this.scene.player, this.scene.assistant];

    return candidates.find((candidate) => (
      candidate
      && !candidate.live.isDead()
      && !candidate.live.isMaxHealth()
      && this.actionsAreaContains(candidate)
    ));
  }

  private getHealAmount() {
    return progressionLinear({
      defaultValue: DIFFICULTY.BUILDING_MEDIC_HEAL_AMOUNT,
      scale: DIFFICULTY.BUILDING_MEDIC_HEAL_AMOUNT_GROWTH,
      level: this.upgradeLevel,
    });
  }

  private heal(target: IPlayer | IAssistant) {
    const health = this.getHealAmount();

    target.live.addHealth(health);

    if (!this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      return;
    }

    new Particles(this, {
      key: 'heal',
      texture: ParticlesTexture.GLOW,
      positionAtWorld: {
        x: this.x,
        y: this.y - 8,
      },
      params: {
        duration: 400,
        lifespan: { min: 100, max: 300 },
        scale: { start: 0.2, end: 0.05 },
        speed: 60,
        maxAliveParticles: 6,
        blendMode: 'ADD',
      },
    });
  }
}
