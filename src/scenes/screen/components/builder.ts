import Phaser from 'phaser';
import Player from '~scene/world/entities/player';
import ComponentInfoBox from '~scene/world/components/info-box';
import Building from '~scene/world/entities/building';
import Rectangle from '~ui/rectangle';
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

  const addPreview = (variant: BuildingVariant, index: number) => {
    const item = this.add.container(
      ITEMS_MARGIN_H + (width + ITEMS_PADDING) * index,
      ITEMS_MARGIN_V,
    );
    item.setSize(width, fullHeight);

    const body = new Rectangle(this, {
      size: { x: width + ITEMS_PADDING, y: fullHeight },
      position: { x: -ITEMS_PADDING / 2, y: -ITEMS_MARGIN_V },
      origin: [0, 0],
      background: 0x3b1954,
      update: (self) => {
        const isActive = (builder.variantIndex === index) || (hover.current === index);
        self.setAlpha(isActive ? 1.0 : 0.4);
      },
    });
    body.setInteractive();

    const preview = this.add.image(0, 0, BUILDINGS[variant].Texture)
      .setOrigin(0, 0);

    const number = this.add.text(0, height, String(index + 1), { fontSize: '14px' })
      .setOrigin(0, 1);

    body.on(Phaser.Input.Events.POINTER_OVER, () => {
      if (!builder.isBuild) {
        return;
      }
      this.input.setDefaultCursor('pointer');
      infoBox.setVisible(true);
      infoBox.setPosition(
        item.x - infoBox.width / 2 + ITEMS_MARGIN_H,
        item.y - infoBox.height - ITEMS_MARGIN_V - ITEMS_PADDING / 2,
      );
      hover.current = index;
    });

    body.on(Phaser.Input.Events.POINTER_OUT, () => {
      if (!builder.isBuild) {
        return;
      }
      this.input.setDefaultCursor('default');
      infoBox.setVisible(false);
      hover.current = null;
    });

    body.on(Phaser.Input.Events.POINTER_UP, () => {
      if (!builder.isBuild) {
        return;
      }
      builder.setBuildingVariant(index);
    });

    item.add([body, preview, number]);
    container.add(item);
  };

  let index = 0;
  for (const variant of BUILDING_VARIANTS) {
    addPreview(variant, index);
    index++;
  }

  container.add(infoBox);

  wave.on(WaveEvents.START, () => {
    container.setVisible(false);
    this.input.setDefaultCursor('default');
  });

  wave.on(WaveEvents.FINISH, () => {
    container.setVisible(true);
  });

  return container
    .setName('ComponentBuilder');
};

export default Component;
