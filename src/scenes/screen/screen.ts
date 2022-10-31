import Phaser from 'phaser';
import { DIFFICULTY } from '~const/difficulty';
import { registerAudioAssets, registerImageAssets, registerSpriteAssets } from '~lib/assets';
import { useAdaptation, registerContainerAdaptive } from '~lib/ui';
import { calcGrowth } from '~lib/utils';
import { ComponentBar } from '~scene/screen/components/bar';
import { ComponentBuilder } from '~scene/screen/components/builder';
import { ComponentFPS } from '~scene/screen/components/fps';
import { ComponentGameOver } from '~scene/screen/components/gameover';
import { ComponentNotices } from '~scene/screen/components/notices';
import { ComponentResources } from '~scene/screen/components/resources';
import { ComponentWave } from '~scene/screen/components/wave';
import { World } from '~scene/world';
import { SceneKey } from '~type/scene';
import { ScreenAudio, ScreenTexture } from '~type/screen';
import { NoticeType } from '~type/screen/notice';
import { WorldEvents } from '~type/world';
import { LiveEvents } from '~type/world/entities/live';
import { PlayerEvents, PlayerStat } from '~type/world/entities/player';

export class Screen extends Phaser.Scene {
  constructor() {
    super(SceneKey.SCREEN);
  }

  create() {
    const world = <World> this.scene.get(SceneKey.WORLD);
    const components = this.add.container();

    /**
     * Wave
     */

    const wave = ComponentWave.call(this, {
      wave: world.wave,
    });

    useAdaptation(wave, (width: number) => {
      const offset = Math.round(width * 0.02);

      wave.setPosition(offset, offset);
    });

    components.add(wave);

    /**
     * Health bar
     */

    const health = ComponentBar.call(this, {
      display: () => `${world.player.live.health} HP`,
      percent: () => (world.player.live.health / world.player.live.maxHealth),
      event: (callback: (amount: number) => void) => {
        world.player.live.on(LiveEvents.UPDATE_HEALTH, callback);
      },
      color: 0xe4372c,
    });

    useAdaptation(health, (width: number, height: number) => {
      const offsetX = Math.round(width * 0.02);
      const offsetY = Math.round(height * 0.03);

      health.setPosition(
        offsetX,
        wave.y + wave.height + offsetY,
      );
    });

    components.add(health);

    /**
     * Experience bar
     */

    const experience = ComponentBar.call(this, {
      display: () => `${world.player.level}  LVL`,
      percent: () => (
        world.player.experience / calcGrowth(
          DIFFICULTY.EXPERIENCE_TO_NEXT_LEVEL,
          DIFFICULTY.EXPERIENCE_TO_NEXT_LEVEL_GROWTH,
          world.player.level + 1,
        )
      ),
      event: (callback: (amount: number) => void) => {
        world.player.on(PlayerEvents.UPDATE_EXPERIENCE, callback);
      },
      color: 0x1975c5,
    });

    useAdaptation(experience, (width: number, height: number) => {
      const offsetX = Math.round(width * 0.02);
      const offsetY = Math.round(height * 0.008);

      experience.setPosition(
        offsetX,
        health.y + health.height + offsetY,
      );
    });

    components.add(experience);

    /**
     * Resources
     */

    const resources = ComponentResources.call(this, {
      player: world.player,
    });

    useAdaptation(resources, (width: number, height: number) => {
      const offsetX = Math.round(width * 0.02);
      const offsetY = Math.round(height * 0.03);

      resources.setPosition(
        offsetX,
        experience.y + experience.height + offsetY,
      );
    });

    components.add(resources);

    /**
     * Notices
     */

    const notices = ComponentNotices.call(this);

    useAdaptation(notices, (width: number) => {
      const offsetY = Math.round(width * 0.02);

      notices.setPosition(width / 2, offsetY);
    });

    components.add(notices);

    /**
     * Builder
     */

    const builder = ComponentBuilder.call(this);

    useAdaptation(builder, (width: number) => {
      const offset = Math.round(width * 0.02);

      builder.setPosition(width - offset, offset);
    });

    components.add(builder);

    /**
     * FPS
     */

    const fps = ComponentFPS.call(this);

    useAdaptation(fps, (width: number, height: number) => {
      const offset = width * 0.02;

      fps.setPosition(offset, height - offset);
    });

    components.add(fps);

    /**
     * Updating
     */

    registerContainerAdaptive(components);

    world.events.on(WorldEvents.GAMEOVER, (stat: PlayerStat, record: PlayerStat) => {
      components.destroy();

      ComponentGameOver.call(this, { stat, record });
    });
  }

  /**
   * Send notice message.
   *
   * @param type - Notice type
   * @param message - Message
   */
  public message(type: NoticeType, message: string) {
    this.events.emit('notice', { type, message });
  }
}

registerAudioAssets(ScreenAudio);
registerImageAssets(ScreenTexture.RESOURCES);
registerImageAssets(ScreenTexture.ALERT);
registerSpriteAssets(ScreenTexture.ICON, {
  width: 10,
  height: 10,
});
