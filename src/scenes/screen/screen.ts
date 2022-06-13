import Phaser from 'phaser';
import ComponentWave from '~scene/screen/components/wave';
import ComponentResources from '~scene/screen/components/resources';
import ComponentDebug from '~scene/screen/components/debug';
import ComponentBuilder from '~scene/screen/components/builder';
import ComponentGaveOver from '~scene/world/components/gameover';
import World from '~scene/world';

import { SceneKey } from '~type/scene';
import { PlayerStat } from '~type/player';

import { INTERFACE_PADDING } from '~const/interface';

export default class Screen extends Phaser.Scene {
  constructor() {
    super(SceneKey.SCREEN);
  }

  create() {
    const world = <World> this.scene.get(SceneKey.WORLD);

    if (IS_DEV_MODE) {
      ComponentDebug.call(this, { world });
    }

    const wave = ComponentWave.call(this, {
      wave: world.wave,
      enemies: world.getEnemies(),
      x: this.sys.canvas.width / 2,
      y: INTERFACE_PADDING,
    });

    const resources = ComponentResources.call(this, {
      buildings: world.getBuildings(),
      player: world.player,
      x: INTERFACE_PADDING,
      y: INTERFACE_PADDING,
    });

    const builder = ComponentBuilder.call(this, {
      builder: world.builder,
      wave: world.wave,
      player: world.player,
    });

    world.events.on('gameover', (stat: PlayerStat, record: PlayerStat) => {
      wave.destroy();
      resources.destroy();
      builder.destroy();

      ComponentGaveOver.call(this, {
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
