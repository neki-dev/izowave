import Phaser from 'phaser';
import ComponentExperience from '~scene/screen/components/experience';
import ComponentWave from '~scene/screen/components/wave';
import ComponentResources from '~scene/screen/components/resources';
import ComponentFPS from '~scene/screen/components/fps';
import ComponentBuilder from '~scene/screen/components/builder';
import ComponentGaveOver from '~scene/screen/components/gameover';
import World from '~scene/world';

import { WorldEvents } from '~type/world';
import { SceneKey } from '~type/scene';
import { PlayerStat } from '~type/player';

import { INTERFACE_PADDING } from '~const/interface';

export default class Screen extends Phaser.Scene {
  constructor() {
    super(SceneKey.SCREEN);
  }

  create() {
    const world = <World> this.scene.get(SceneKey.WORLD);

    ComponentFPS.call(this, {
      x: this.sys.game.canvas.width - INTERFACE_PADDING,
      y: INTERFACE_PADDING,
    });

    const wave = ComponentWave.call(this, {
      x: this.sys.canvas.width / 2,
      y: INTERFACE_PADDING,
    }, {
      wave: world.wave,
    });

    const experience = ComponentExperience.call(this, {
      x: INTERFACE_PADDING,
      y: INTERFACE_PADDING,
    }, {
      player: world.player,
    });

    const resources = ComponentResources.call(this, {
      x: INTERFACE_PADDING,
      y: INTERFACE_PADDING + experience.height + INTERFACE_PADDING / 2,
    }, {
      player: world.player,
    });

    const builder = ComponentBuilder.call(this, {
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height - INTERFACE_PADDING,
    }, {
      builder: world.builder,
      wave: world.wave,
      player: world.player,
    });

    world.events.on(WorldEvents.GAMEOVER, (stat: PlayerStat, record: PlayerStat) => {
      wave.destroy();
      experience.destroy();
      resources.destroy();
      builder.destroy();

      ComponentGaveOver.call(this, {
        x: this.sys.game.canvas.width / 2,
        y: this.sys.game.canvas.height / 2,
      }, {
        data: [
          `COMPLETED WAVES - ${stat.waves}${(record.waves < stat.waves) ? ' - NEW RECORD' : ''}`,
          `KILLED ENEMIES - ${stat.kills}${(record.kills < stat.kills) ? ' - NEW RECORD' : ''}`,
          `REACHED LEVEL - ${stat.level}${(record.level < stat.level) ? ' - NEW RECORD' : ''}`,
          `LIVED MINUTES - ${stat.lived.toFixed(1)}${(record.lived < stat.lived) ? ' - NEW RECORD' : ''}`,
        ],
      });
    });
  }
}
