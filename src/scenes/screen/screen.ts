import Phaser from 'phaser';
import ComponentExperience from '~scene/screen/components/experience';
import ComponentWave from '~scene/screen/components/wave';
import ComponentResources from '~scene/screen/components/resources';
import ComponentFPS from '~scene/screen/components/fps';
import ComponentBuilder from '~scene/screen/components/builder';
import ComponentGameOver from '~scene/screen/components/gameover';
import ComponentNotices from '~scene/screen/components/notices';
import ComponentHealth from '~scene/screen/components/health';
import World from '~scene/world';

import { WorldEvents } from '~type/world';
import { SceneKey } from '~type/scene';
import { PlayerStat } from '~type/player';
import { Notice } from '~type/notice';

import { INTERFACE_PADDING } from '~const/interface';

export default class Screen extends Phaser.Scene {
  readonly notices: Notice[] = [];

  constructor() {
    super(SceneKey.SCREEN);
  }

  create() {
    const world = <World> this.scene.get(SceneKey.WORLD);

    ComponentFPS.call(this, {
      x: INTERFACE_PADDING,
      y: this.sys.canvas.height - INTERFACE_PADDING,
    });

    let shift = INTERFACE_PADDING;

    const wave = ComponentWave.call(this, {
      x: INTERFACE_PADDING,
      y: shift,
    }, {
      wave: world.wave,
    });
    shift += wave.height + INTERFACE_PADDING;

    const notices = ComponentNotices.call(this, {
      x: this.sys.canvas.width / 2,
      y: INTERFACE_PADDING,
    });

    const health = ComponentHealth.call(this, {
      x: INTERFACE_PADDING,
      y: shift,
    }, {
      player: world.player,
    });
    shift += health.height + 8;

    const experience = ComponentExperience.call(this, {
      x: INTERFACE_PADDING,
      y: shift,
    }, {
      player: world.player,
    });
    shift += experience.height + INTERFACE_PADDING / 2;

    const resources = ComponentResources.call(this, {
      x: INTERFACE_PADDING,
      y: shift,
    }, {
      player: world.player,
    });

    const builder = ComponentBuilder.call(this, {
      x: this.sys.canvas.width - INTERFACE_PADDING,
      y: INTERFACE_PADDING,
    }, {
      builder: world.builder,
      wave: world.wave,
      player: world.player,
    });

    world.events.on(WorldEvents.GAMEOVER, (stat: PlayerStat, record: PlayerStat) => {
      notices.destroy();
      wave.destroy();
      experience.destroy();
      health.destroy();
      resources.destroy();
      builder.destroy();

      ComponentGameOver.call(this, { x: 0, y: 0 }, { stat, record });
    });
  }
}
