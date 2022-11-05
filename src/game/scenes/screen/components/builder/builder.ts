import Phaser from 'phaser';

import { INTERFACE_BOX_COLOR, INTERFACE_FONT } from '~const/interface';
import { BUILDINGS } from '~const/world/entities/buildings';
import { TILE_META } from '~const/world/level';
import { Component, scaleText, switchSize } from '~lib/interface';
import { entries } from '~lib/system';
import { debounce } from '~lib/utils';
import { ComponentBuildInfo } from '~game/scenes/screen/components/builder/build-info';
import { ComponentHelp } from '~game/scenes/screen/components/help';
import { TutorialEvent, TutorialStep } from '~type/tutorial';
import { BuildingMeta, BuildingVariant } from '~type/world/entities/building';
import { WaveEvents } from '~type/world/wave';

export const ComponentBuilder = Component(function (container) {
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
    variant: BuildingVariant
    mods: Partial<Record<BuildingVariant, 'normal' | 'disallow' | 'disabled'>>
  } = {
    variant: null,
    mods: {},
  };

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

  Object.values(BuildingVariant).forEach((variant, index) => {
    ref.items[variant] = {};

    /**
     * Wrapper
     */

    ref.list.add(
      ref.items[variant].wrapper = this.add.container(),
    );

    ref.items[variant].wrapper.useAdaptationBefore(() => {
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
    ref.items[variant].body.useAdaptationBefore(() => {
      ref.items[variant].body.setSize(
        ref.items[variant].wrapper.width,
        ref.items[variant].wrapper.height,
      );
      ref.items[variant].body.setInteractive();
    });

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ref.items[variant].body.on(Phaser.Input.Events.POINTER_OVER, () => focus(variant));
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ref.items[variant].body.on(Phaser.Input.Events.POINTER_OUT, () => unfocus());
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ref.items[variant].body.on(Phaser.Input.Events.POINTER_UP, () => select(variant));

    /**
     * Preview
     */

    ref.items[variant].wrapper.add(
      ref.items[variant].preview = this.add.image(0, 0, BUILDINGS[variant].Texture),
    );

    ref.items[variant].preview.useAdaptationBefore(() => {
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
    ref.items[variant].number.useAdaptationBefore(() => {
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

    ref.help.useAdaptationBefore(() => {
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

    const data: BuildingMeta = BUILDINGS[variant];

    const limit = this.game.world.builder.getBuildingLimit(variant);
    const limitState: [number, number] = limit ? [
      this.game.world.selectBuildings(variant).length,
      limit,
    ] : undefined;

    container.add(
      ref.info = ComponentBuildInfo(this, {
        name: data.Name,
        description: data.Description,
        cost: data.Cost,
        params: data.Params,
        limit: limitState,
        allowed: this.game.world.builder.isBuildingAllowedByWave(variant),
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

  const focus = (variant: BuildingVariant) => {
    if (
      this.game.world.wave.isGoing
      || !this.game.world.builder.isBuildingAllowedByTutorial(variant)
    ) {
      return;
    }

    if (ref.help) {
      ref.help.setVisible(false);
    }

    this.input.setDefaultCursor('pointer');
    state.variant = variant;

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

  const select = (variant: BuildingVariant) => {
    if (this.game.world.builder.variant === variant) {
      this.game.world.builder.unsetBuildingVariant();
    } else {
      this.game.world.builder.setBuildingVariant(variant);
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
        addHelp(BuildingVariant.TOWER_FIRE, 'Build tower to defend yourself from enemies');
        break;
      }
      case TutorialStep.BUILD_AMMUNITION: {
        addHelp(BuildingVariant.AMMUNITION, 'Build ammunition for reload tower ammo');
        break;
      }
      default: return;
    }

    ref.help.refreshAdaptation();
  };

  this.game.world.wave.on(WaveEvents.START, unfocus);

  this.game.tutorial.on(TutorialEvent.PROGRESS, checkTutorailHelps);
  checkTutorailHelps(this.game.tutorial.step);

  return {
    update: () => {
      for (const [variant, { wrapper, body, preview }] of entries(ref.items)) {
        if (this.game.world.wave.isGoing) {
          if (state.mods[variant] !== 'disabled') {
            wrapper.setAlpha(0.25);

            state.mods[variant] = 'disabled';
          }
        } else if (
          !this.game.world.builder.isBuildingAllowedByTutorial(variant)
          || !this.game.world.builder.isBuildingAllowedByWave(variant)
        ) {
          if (state.mods[variant] !== 'disallow') {
            wrapper.setAlpha(0.5);
            preview.addShader('GrayscaleShader');

            state.mods[variant] = 'disallow';
          }
        } else if (state.mods[variant] !== 'normal') {
          wrapper.setAlpha(1.0);
          preview.removeShader('GrayscaleShader');

          state.mods[variant] = 'normal';
        }

        if (this.game.world.builder.variant === variant) {
          body.setFillStyle(INTERFACE_BOX_COLOR.BLUE);
          body.setAlpha(1.0);
        } else if (state.variant === variant) {
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
