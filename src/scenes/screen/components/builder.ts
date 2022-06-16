import Phaser from 'phaser';
import Player from '~scene/world/entities/player';
import ComponentInfoBox from '~scene/world/components/info-box';
import Building from '~scene/world/entities/building';
import Wave from '~scene/world/wave';
import Builder from '~scene/world/builder';

import { UIComponent } from '~type/interface';
import { BuildingVariant } from '~type/building';

import { TILE_META } from '~const/level';
import BUILDINGS from '~const/buildings';
import { INTERFACE_PADDING } from '~const/interface';
import { WaveEvents } from '~type/wave';

type Props = {
  builder: Builder
  wave: Wave
  player: Player
};

const BUILDING_VARIANTS = Object.values(BuildingVariant);
const ITEMS_PADDING = 30;
const ITEMS_MARGIN_H = 15;
const ITEMS_MARGIN_V = 10;

const Component: UIComponent<Props> = function ComponentBuilder(
  this: Phaser.Scene,
  { builder, wave, player },
) {
  const { width, height } = TILE_META;
  const fullWidth = ((width + ITEMS_PADDING) * BUILDING_VARIANTS.length) + ITEMS_MARGIN_H * 2 - ITEMS_PADDING;
  const fullHeight = height + ITEMS_MARGIN_V * 2;
  const hover = { current: null };

  const container = this.add.container(
    this.sys.canvas.width / 2 - fullWidth / 2,
    this.sys.canvas.height - fullHeight - INTERFACE_PADDING,
  );
  container.setSize(fullWidth, fullHeight);

  const filterBuildings = (variant: string) => player.scene.getBuildings().getChildren()
    .filter((building: Building) => (building.variant === variant));

  const param = (name: string) => (
    (hover.current !== null)
      ? BUILDINGS[BUILDING_VARIANTS[hover.current]][name]
      : undefined
  );
  const infoBox = ComponentInfoBox.call(this, {
    label: () => param('Name'),
    description: () => `${param('Description') || ''}\nYou have: ${filterBuildings(BUILDING_VARIANTS[hover.current]).length}`,
    cost: () => param('Cost'),
    costTitle: 'Build cost',
    player,
  });
  infoBox.setVisible(false);
  container.add(infoBox);

  const addItem = (variant: BuildingVariant, index: number) => {
    const item = this.add.container(
      ITEMS_MARGIN_H + (width + ITEMS_PADDING) * index,
      ITEMS_MARGIN_V,
    );
    item.setSize(width, fullHeight);

    const body = this.add.rectangle(-ITEMS_PADDING / 2, -ITEMS_MARGIN_V, width + ITEMS_PADDING, fullHeight, 0x3b1954);
    body.setOrigin(0, 0);
    body.setInteractive();
    body.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.input.setDefaultCursor('pointer');
      infoBox.setPosition(
        item.x - infoBox.width / 2 + ITEMS_MARGIN_H,
        item.y - infoBox.height - ITEMS_MARGIN_V - ITEMS_PADDING / 2,
      );
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

    const preview = this.add.image(0, 0, BUILDINGS[variant].Texture);
    preview.setOrigin(0, 0);

    const number = this.add.text(0, height, String(index + 1), { fontSize: '14px' });
    number.setOrigin(0, 1);

    item.add([body, preview, number]);
    container.add(item);
  };

  BUILDING_VARIANTS.forEach(addItem);

  wave.on(WaveEvents.START, () => {
    container.setVisible(false);
    this.input.setDefaultCursor('default');
  });

  wave.on(WaveEvents.FINISH, () => {
    container.setVisible(true);
  });

  // Update event
  const update = () => {
    if (!container.visible) {
      return;
    }

    const itemsCount = container.getAll().length;
    for (let i = 1; i < itemsCount; i++) {
      const item = <Phaser.GameObjects.Container> container.getAt(i);
      const body = <Phaser.GameObjects.Rectangle> item.getAt(0);
      const isActive = (builder.variantIndex === i - 1) || (hover.current === i - 1);
      body.setAlpha(isActive ? 1.0 : 0.4);
    }
  };
  this.events.on(Phaser.Scenes.Events.UPDATE, update, this);
  container.on(Phaser.Scenes.Events.DESTROY, () => {
    this.events.off(Phaser.Scenes.Events.UPDATE, update);
  });
  update();

  return container
    .setName('ComponentBuilder');
};

export default Component;
