import Phaser from 'phaser';
import { BUILDINGS } from '~const/buildings';
import { INTERFACE_BOX_COLOR, INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { TILE_META } from '~const/level';
import { Player } from '~entity/player';
import { useAdaptation, Component, scaleText } from '~lib/ui';
import { isMobileDevice } from '~lib/utils';
import { ComponentBuildingInfo } from '~scene/screen/components/building-info';
import { World } from '~scene/world';
import { Builder } from '~scene/world/builder';
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

export const ComponentBuilder = Component<Props>(function (container, {
  builder, wave, player,
}) {
  const hover: {
    current: number
  } = { current: null };

  /**
   * List
   */

  const list = this.add.container();

  container.add(list);

  /**
   * Info
   */

  const info = ComponentBuildingInfo.call(this, {
    mode: 'builder',
    origin: [1.0, 0.0],
    player,
    data: (): BuildingInstance => {
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
            color: (count >= limit)
              ? INTERFACE_TEXT_COLOR.ERROR
              : undefined,
          },
        ];
      }

      return data;
    },
    resize: (ctn: Phaser.GameObjects.Container) => {
      if (hover.current === null) {
        return;
      }

      const wrapper = <Phaser.GameObjects.Container> list.getAt(hover.current);

      ctn.setPosition(wrapper.x - 10 - info.width, wrapper.y);
    },
  });

  info.setVisible(false);

  container.add(info);

  /**
   * Items
   */

  BUILDING_VARIANTS.forEach((variant, index) => {
    /**
     * Wrapper
     */

    const wrapper = this.add.container();

    useAdaptation(wrapper, (width, height) => {
      const size = Math.max(30, width * 0.03);
      const offsetY = height * 0.008;

      wrapper.setSize(size, size);
      wrapper.setPosition(-wrapper.width, (wrapper.height + offsetY) * index);
    });

    list.add(wrapper);

    /**
     * Body
     */

    const body = this.add.rectangle(0, 0, 0, 0);

    body.setName('Body');
    body.setAlpha(0.5);
    body.setOrigin(0.0, 0.0);
    useAdaptation(body, () => {
      body.setSize(wrapper.width, wrapper.height);
      body.setInteractive();
    });

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    body.on(Phaser.Input.Events.POINTER_OVER, () => focus(index));
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    body.on(Phaser.Input.Events.POINTER_OUT, () => unfocus());
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    body.on(Phaser.Input.Events.POINTER_UP, () => select(index));

    wrapper.add(body);

    /**
     * Preview
     */

    const preview = this.add.image(0, 0, BUILDINGS[variant].Texture);

    useAdaptation(preview, () => {
      const offset = wrapper.width * 0.18;

      preview.setScale((wrapper.height - (offset * 2)) / TILE_META.height);
      preview.setPosition(wrapper.width / 2, wrapper.height / 2);
    });

    wrapper.add(preview);

    /**
     * Number
     */

    if (!isMobileDevice()) {
      const number = this.add.text(0, 0, String(index + 1), {
        resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.MONOSPACE,
      });

      number.setOrigin(1.0, 0.0);
      useAdaptation(number, () => {
        scaleText(number, {
          by: wrapper.width,
          scale: 0.22,
        });
        number.setPosition(wrapper.width - 4, 4);
      });

      wrapper.add(number);
    }
  });

  /**
   * Updating
   */

  const focus = (index: number) => {
    if (wave.isGoing) {
      return;
    }

    info.forceUpdate();
    info.setVisible(true);

    this.input.setDefaultCursor('pointer');
    hover.current = index;
  };

  const unfocus = () => {
    if (hover.current === null) {
      return;
    }

    info.setVisible(false);

    this.input.setDefaultCursor('default');
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

  wave.on(WaveEvents.START, () => {
    unfocus();
    list.setAlpha(0.25);
  });

  wave.on(WaveEvents.COMPLETE, () => {
    list.setAlpha(1.0);
  });

  return {
    update: () => {
      list.getAll().forEach((wrapper: Phaser.GameObjects.Container, index) => {
        const body = <Phaser.GameObjects.Rectangle> wrapper.getByName('Body');

        if (wave.isGoing) {
          body.setFillStyle(0x000000);
          body.setAlpha(1.0);
        } else if (builder.variantIndex === index) {
          body.setFillStyle(INTERFACE_BOX_COLOR.BLUE);
          body.setAlpha(1.0);
        } else if (hover.current === index) {
          body.setFillStyle(0x000000);
          body.setAlpha(1.0);
        } else {
          body.setFillStyle(0x000000);
          body.setAlpha(0.5);
        }
      });
    },
  };
});
