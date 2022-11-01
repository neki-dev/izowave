import Phaser from 'phaser';

import { BUILDINGS } from '~const/buildings';
import { INTERFACE_BOX_COLOR, INTERFACE_FONT } from '~const/interface';
import { TILE_META } from '~const/level';
import { entries } from '~lib/system';
import {
  useAdaptation, Component, scaleText, switchSize, refreshAdaptive,
} from '~lib/ui';
import { debounce } from '~lib/utils';
import { ComponentBuildInfo } from '~scene/screen/components/builder/build-info';
import { ComponentHelp } from '~scene/screen/components/help';
import { World } from '~scene/world';
import { SceneKey } from '~type/scene';
import { TutorialEvent, TutorialStep } from '~type/tutorial';
import { BuildingMeta, BuildingVariant } from '~type/world/entities/building';
import { WaveEvents } from '~type/world/wave';

const BUILDING_VARIANTS = Object.values(BuildingVariant);

export const ComponentBuilder = Component(function (container) {
  const world = <World> this.scene.get(SceneKey.WORLD);

  const ref: {
    help?: Phaser.GameObjects.Container
    list?: Phaser.GameObjects.Container
    info?: Phaser.GameObjects.Container
    items?: Partial<Record<BuildingVariant, {
      wrapper?: Phaser.GameObjects.Container
      body?: Phaser.GameObjects.Rectangle
      preview?: Phaser.GameObjects.Image
      number?: Phaser.GameObjects.Text
    }>>
  } = { items: {} };

  const state: {
    variant: number
  } = { variant: null };

  /**
   * Creating
   */

  /**
   * List
   */

  container.add(
    ref.list = this.add.container(),
  );

  /**
   * Items
   */

  BUILDING_VARIANTS.forEach((variant, index) => {
    ref.items[variant] = {};

    /**
     * Wrapper
     */

    ref.list.add(
      ref.items[variant].wrapper = this.add.container(),
    );

    useAdaptation(ref.items[variant].wrapper, () => {
      const size = switchSize(54);

      ref.items[variant].wrapper.setSize(size, size);
      ref.items[variant].wrapper.setPosition(
        -ref.items[variant].wrapper.width,
        (ref.items[variant].wrapper.height + switchSize(8)) * index,
      );
    });

    /**
     * Body
     */

    ref.items[variant].wrapper.add(
      ref.items[variant].body = this.add.rectangle(0, 0, 0, 0, 0x000000),
    );

    ref.items[variant].body.setAlpha(0.5);
    ref.items[variant].body.setOrigin(0.0, 0.0);
    useAdaptation(ref.items[variant].body, () => {
      ref.items[variant].body.setSize(
        ref.items[variant].wrapper.width,
        ref.items[variant].wrapper.height,
      );
      ref.items[variant].body.setInteractive();
    });

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ref.items[variant].body.on(Phaser.Input.Events.POINTER_OVER, () => focus(variant, index));
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ref.items[variant].body.on(Phaser.Input.Events.POINTER_OUT, () => unfocus());
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ref.items[variant].body.on(Phaser.Input.Events.POINTER_UP, () => select(index));

    /**
     * Preview
     */

    ref.items[variant].wrapper.add(
      ref.items[variant].preview = this.add.image(0, 0, BUILDINGS[variant].Texture),
    );

    useAdaptation(ref.items[variant].preview, () => {
      const offset = ref.items[variant].wrapper.width * 0.18;

      ref.items[variant].preview.setScale(
        (ref.items[variant].wrapper.height - (offset * 2)) / TILE_META.height,
      );
      ref.items[variant].preview.setPosition(
        ref.items[variant].wrapper.width / 2,
        ref.items[variant].wrapper.height / 2,
      );
    });

    /**
     * Number
     */

    ref.items[variant].wrapper.add(
      ref.items[variant].number = this.add.text(0, 0, String(index + 1), {
        resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.MONOSPACE,
      }),
    );

    ref.items[variant].number.setOrigin(1.0, 0.0);
    useAdaptation(ref.items[variant].number, () => {
      scaleText(ref.items[variant].number, 11);
      ref.items[variant].number.setPosition(
        ref.items[variant].wrapper.width - 4,
        4,
      );
    });
  });

  /**
   * Help
   */

  const addHelp = (variant: BuildingVariant, message: string) => {
    container.add(
      ref.help = ComponentHelp(this, {
        message,
        side: 'right',
      }),
    );

    useAdaptation(ref.help, () => {
      ref.help.setPosition(
        ref.items[variant].wrapper.x - switchSize(12),
        ref.items[variant].wrapper.y + (ref.items[variant].wrapper.height / 2),
      );
    });
  };

  /**
   * Info
   */

  const addInfo = debounce((variant: BuildingVariant) => {
    if (ref.info) {
      ref.info.destroy();
    }

    const data: BuildingMeta = { ...BUILDINGS[variant] };
    let limit: [number, number];

    if (data.Limit) {
      limit = [
        world.selectBuildings(variant).length,
        world.builder.getBuildCurrentLimit(data.Limit),
      ];
    }

    container.add(
      ref.info = ComponentBuildInfo(this, {
        name: data.Name,
        description: data.Description,
        cost: data.Cost,
        params: data.Params,
        limit,
        allowed: world.builder.isBuildingAllowedByWave(variant),
      }),
    );

    ref.info.setPosition(
      -ref.info.width - ref.items[variant].wrapper.width - switchSize(12),
      ref.items[variant].wrapper.y,
    );
  }, 100);

  /**
   * Updating
   */

  const focus = (variant: BuildingVariant, index: number) => {
    if (world.wave.isGoing || !world.builder.isBuildingAllowedByTutorial(variant)) {
      return;
    }

    if (ref.help) {
      ref.help.setVisible(false);
    }

    this.input.setDefaultCursor('pointer');
    state.variant = index;

    addInfo.call(variant);
  };

  const unfocus = () => {
    if (state.variant === null) {
      return;
    }

    if (ref.help) {
      ref.help.setVisible(true);
    }

    if (ref.info) {
      ref.info.destroy();
    } else {
      addInfo.reject();
    }

    this.input.setDefaultCursor('default');
    state.variant = null;
  };

  const select = (index: number) => {
    if (world.builder.variantIndex === index) {
      world.builder.unsetBuildingVariant();
    } else {
      world.builder.setBuildingVariant(index);
    }
  };

  const checkTutorailHelps = (step: TutorialStep) => {
    if (ref.help) {
      ref.help.destroy();
      delete ref.help;
    }

    switch (step) {
      case TutorialStep.BUILD_GENERATOR: {
        addHelp(BuildingVariant.GENERATOR, 'Build generator to get resources');
        break;
      }
      case TutorialStep.BUILD_TOWER_FIRE: {
        addHelp(BuildingVariant.TOWER_FIRE, 'Build fire tower to defend yourself from enemies');
        break;
      }
      default: return;
    }

    refreshAdaptive(ref.help);
  };

  world.wave.on(WaveEvents.START, unfocus);

  world.tutorial.on(TutorialEvent.PROGRESS, checkTutorailHelps);
  checkTutorailHelps(world.tutorial.step);

  return {
    update: () => {
      entries(ref.items).forEach(([variant, { wrapper, body, preview }], index) => {
        if (world.wave.isGoing) {
          wrapper.setAlpha(0.25);
          preview.setAlpha(1.0);
        } else if (
          !world.builder.isBuildingAllowedByTutorial(variant)
          || !world.builder.isBuildingAllowedByWave(variant)
        ) {
          wrapper.setAlpha(0.25);
          preview.setAlpha(0.5);
        } else {
          wrapper.setAlpha(1.0);
          preview.setAlpha(1.0);
        }

        if (world.builder.variantIndex === index) {
          body.setFillStyle(INTERFACE_BOX_COLOR.BLUE);
          body.setAlpha(1.0);
        } else if (state.variant === index) {
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
