import Phaser from 'phaser';
import Component from '~lib/ui';
import Player from '~scene/world/entities/player';
import ComponentBuildingInfo from '~scene/screen/components/building-info';
import Wave from '~scene/world/wave';
import Builder from '~scene/world/builder';

import { BuildingInstance, BuildingVariant } from '~type/building';

import BUILDINGS from '~const/buildings';
import { WaveEvents } from '~type/wave';
import { INTERFACE_BOX_COLOR_PURPLE, INTERFACE_FONT_MONOSPACE } from '~const/interface';

type Props = {
  builder: Builder
  wave: Wave
  player: Player
};

const BUILDING_VARIANTS = Object.values(BuildingVariant);
const ITEM_SIZE = 50;
const ITEMS_MARGIN = 5;

export default Component(function ComponentBuilder(container, { builder, wave, player }: Props) {
  const hover = { current: null };

  container.setPosition(container.x - ITEM_SIZE, container.y);
  container.setSize(ITEM_SIZE, (ITEM_SIZE + ITEMS_MARGIN) * BUILDING_VARIANTS.length);

  const info = ComponentBuildingInfo.call(this, { x: 0, y: 0 }, {
    mode: 'builder',
    origin: [1.0, 0.0],
    player,
    data: (): BuildingInstance => (
      (hover.current !== null)
        ? BUILDINGS[BUILDING_VARIANTS[hover.current]]
        : undefined
    ),
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
    const item = this.add.container(0, (ITEM_SIZE + ITEMS_MARGIN) * index);
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
          body.setFillStyle(INTERFACE_BOX_COLOR_PURPLE);
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
