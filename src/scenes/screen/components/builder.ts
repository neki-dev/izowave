import Phaser from 'phaser';

import { INTERFACE_BOX_COLOR_BLUE, INTERFACE_FONT_MONOSPACE, INTERFACE_TEXT_COLOR_ERROR } from '~const/interface';
import { Component } from '~lib/ui';
import { ComponentBuildingInfo } from '~scene/screen/components/building-info';
import { World } from '~scene/world';
import { Builder } from '~scene/world/builder';
import { BUILDINGS } from '~scene/world/entities/buildings';
import { Player } from '~scene/world/entities/player';
import { Wave } from '~scene/world/wave';
import { SceneKey } from '~type/scene';
import { BuildingInstance, BuildingVariant } from '~type/world/entities/building';
import { WaveEvents } from '~type/world/wave';

type Props = {
  builder: Builder
  wave: Wave
  player: Player
};

const BUILDING_VARIANTS = Object.values(BuildingVariant);
const ITEM_SIZE = 50;
const ITEMS_MARGIN = 5;

export const ComponentBuilder = Component<Props>(function (container, {
  builder, wave, player,
}) {
  const hover = { current: null };

  container.setSize(ITEM_SIZE, (ITEM_SIZE + ITEMS_MARGIN) * BUILDING_VARIANTS.length);

  const getData = (): BuildingInstance => {
    if (hover.current === null) {
      return undefined;
    }

    const variant = BUILDING_VARIANTS[hover.current];
    const data = { ...BUILDINGS[variant] };

    if (data.Limit) {
      const world = <World> this.scene.get(SceneKey.WORLD);
      const count = world.selectBuildings(variant).length;
      const limit = builder.getBuildCurrentLimit(data.Limit);
      data.Description = [
        ...data.Description, {
          text: `You have ${count} of ${limit}`,
          type: 'text',
          color: (count >= limit) ? INTERFACE_TEXT_COLOR_ERROR : undefined,
        },
      ];
    }

    return data;
  };

  const info = ComponentBuildingInfo.call(this, { x: 0, y: 0 }, {
    mode: 'builder',
    origin: [1.0, 0.0],
    player,
    data: getData,
  });
  info.setVisible(false);
  container.add(info);

  const focus = (item: Phaser.GameObjects.Container, index: number) => {
    if (wave.isGoing) {
      return;
    }

    this.input.setDefaultCursor('pointer');
    info.setPositionWithOrigin(item.x - 10, item.y);
    info.setVisible(true);
    hover.current = index;
  };

  const unfocus = () => {
    if (hover.current === null) {
      return;
    }

    this.input.setDefaultCursor('default');
    info.setVisible(false);
    hover.current = null;
  };

  const select = (index: number) => {
    if (wave.isGoing) {
      return;
    }

    builder.setBuildingVariant(
      (builder.variantIndex === index) ? null : index,
    );
  };

  BUILDING_VARIANTS.forEach((variant: BuildingVariant, index: number) => {
    const item = this.add.container(-ITEM_SIZE, (ITEM_SIZE + ITEMS_MARGIN) * index);
    item.setSize(ITEM_SIZE, ITEM_SIZE);

    const body = this.add.rectangle(0, 0, ITEM_SIZE, ITEM_SIZE);
    body.setName('Body');
    body.setOrigin(0.0, 0.0);
    body.setInteractive();
    body.on(Phaser.Input.Events.POINTER_OVER, () => focus(item, index));
    body.on(Phaser.Input.Events.POINTER_OUT, () => unfocus());
    body.on(Phaser.Input.Events.POINTER_UP, () => select(index));

    const preview = this.add.image(ITEM_SIZE / 2, ITEM_SIZE / 2, BUILDINGS[variant].Texture);
    preview.setScale(0.65);

    const number = this.add.text(ITEM_SIZE - 4, 4, String(index + 1), {
      fontSize: '12px',
      fontFamily: INTERFACE_FONT_MONOSPACE,
    });
    number.setOrigin(1.0, 0.0);

    item.add([body, preview, number]);
    container.add(item);
  });

  wave.on(WaveEvents.START, () => {
    container.setAlpha(0.25);
    unfocus();
  });

  wave.on(WaveEvents.FINISH, () => {
    container.setAlpha(1.0);
  });

  return {
    update: () => {
      const itemsCount = container.getAll().length;
      for (let i = 1; i < itemsCount; i++) {
        const item = <Phaser.GameObjects.Container> container.getAt(i);
        const body = <Phaser.GameObjects.Rectangle> item.getByName('Body');
        if (wave.isGoing) {
          body.setFillStyle(0x000000);
          body.setAlpha(1.0);
        } else if (builder.variantIndex === i - 1) {
          body.setFillStyle(INTERFACE_BOX_COLOR_BLUE);
          body.setAlpha(1.0);
        } else if (hover.current === i - 1) {
          body.setFillStyle(0x000000);
          body.setAlpha(1.0);
        } else {
          body.setFillStyle(0x000000);
          body.setAlpha(0.5);
        }
      }
    },
  };
});
