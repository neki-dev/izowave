import Phaser from 'phaser';
import Component from '~lib/ui';
import Player from '~scene/world/entities/player';
import ComponentBuildingInfo from '~scene/screen/components/info-box';
import Wave from '~scene/world/wave';
import Builder from '~scene/world/builder';

import { BuildingInstance, BuildingVariant } from '~type/building';

import BUILDINGS from '~const/buildings';
import { WaveEvents } from '~type/wave';
import { INTERFACE_BOX_COLOR_PURPLE } from '~const/interface';

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

  const infoBox = ComponentBuildingInfo.call(this, { x: 0, y: 0 }, {
    player,
    params: (): BuildingInstance => (
      (hover.current !== null)
        ? BUILDINGS[BUILDING_VARIANTS[hover.current]]
        : undefined
    ),
  });
  infoBox.setVisible(false);
  container.add(infoBox);

  BUILDING_VARIANTS.forEach((variant: BuildingVariant, index: number) => {
    const item = this.add.container(0, (ITEM_SIZE + ITEMS_MARGIN) * index);
    item.setSize(ITEM_SIZE, ITEM_SIZE);

    const body = this.add.rectangle(0, 0, ITEM_SIZE, ITEM_SIZE);
    body.setOrigin(0.0, 0.0);
    body.setInteractive();
    body.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.input.setDefaultCursor('pointer');
      infoBox.setPosition(item.x - infoBox.width - 10, item.y);
      infoBox.setVisible(true);
      hover.current = index;
    });
    body.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.input.setDefaultCursor('default');
      infoBox.setVisible(false);
      hover.current = null;
    });
    body.on(Phaser.Input.Events.POINTER_UP, () => {
      builder.setBuildingVariant(
        (builder.variantIndex === index) ? null : index,
      );
    });

    const preview = this.add.image(ITEM_SIZE / 2, ITEM_SIZE / 2, BUILDINGS[variant].Texture);
    preview.setScale(0.65);

    const number = this.add.text(4, 4, String(index + 1), { fontSize: '12px' });

    item.add([body, preview, number]);
    container.add(item);
  });

  wave.on(WaveEvents.START, () => {
    container.setVisible(false);
    this.input.setDefaultCursor('default');
  });

  wave.on(WaveEvents.FINISH, () => {
    container.setVisible(true);
  });

  return {
    update: () => {
      if (!container.visible) {
        return;
      }

      const itemsCount = container.getAll().length;
      for (let i = 1; i < itemsCount; i++) {
        const item = <Phaser.GameObjects.Container> container.getAt(i);
        const body = <Phaser.GameObjects.Rectangle> item.getAt(0);
        if (builder.variantIndex === i - 1) {
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
