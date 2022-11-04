import { INTERFACE_FONT } from '~const/interface';
import {
  useAdaptation, Component, scaleText, switchSize, useAdaptationAfter, refreshAdaptive,
} from '~lib/interface';
import { BuildingAction } from '~type/world/entities/building';

type Props = {
  actions: () => Array<BuildingAction>
};

export const ComponentActions = Component<Props>(function (container, {
  actions,
}) {
  let ref: Record<string, {
    wrapper?: Phaser.GameObjects.Container
    body?: Phaser.GameObjects.Rectangle
    label?: Phaser.GameObjects.Text
    addon?: Phaser.GameObjects.Container
  }> = {};

  const state: {
    actions: string
    hover: boolean
  } = {
    actions: '',
    hover: false,
  };

  /**
   * Adaptation
   */

  useAdaptation(container, () => {
    // eslint-disable-next-line no-param-reassign
    container.width = switchSize(100);
  });

  useAdaptationAfter(container, () => {
    const refs = Object.values(ref);

    if (refs.length > 0) {
      const lastWrapper = refs[refs.length - 1].wrapper;

      // eslint-disable-next-line no-param-reassign
      container.height = lastWrapper.y + lastWrapper.height;
    }
  });

  /**
   * Creating
   */

  const create = ({ label, addon, onClick }: BuildingAction, index: number) => {
    ref[label] = {};

    /**
     * Wrapper
     */

    container.add(
      ref[label].wrapper = this.add.container(),
    );

    useAdaptation(ref[label].wrapper, () => {
      ref[label].wrapper.setSize(
        container.width,
        switchSize(20),
      );
      ref[label].wrapper.setPosition(
        0,
        (ref[label].wrapper.height + switchSize(2)) * index,
      );
    });

    /**
     * Body
     */

    let interactiveInit = false;

    ref[label].wrapper.add(
      ref[label].body = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.75),
    );

    ref[label].body.setOrigin(0.0, 0.0);
    ref[label].body.setOrigin(0.0, 0.0);
    useAdaptation(ref[label].body, () => {
      ref[label].body.setSize(
        ref[label].wrapper.width,
        ref[label].wrapper.height,
      );
      if (!interactiveInit) {
        ref[label].body.setInteractive();
        interactiveInit = true;
      }
    });

    ref[label].body.on(Phaser.Input.Events.POINTER_DOWN, (
      pointer: Phaser.Input.Pointer,
      x: number,
      y: number,
      event: Phaser.Types.Input.EventData,
    ) => {
      onClick();
      event.stopPropagation();
    });
    ref[label].body.on(Phaser.Input.Events.POINTER_OVER, () => {
      ref[label].body.setFillStyle(0x000000, 1.0);
      this.input.setDefaultCursor('pointer');
      state.hover = true;
    });
    ref[label].body.on(Phaser.Input.Events.POINTER_OUT, () => {
      ref[label].body.setFillStyle(0x000000, 0.75);
      this.input.setDefaultCursor('default');
      state.hover = false;
    });
    ref[label].body.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (state.hover) {
        this.input.setDefaultCursor('default');
        state.hover = false;
      }
    });

    /**
     * Label
     */

    ref[label].wrapper.add(
      ref[label].label = this.add.text(0, 0, label, {
        // resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.MONOSPACE,
      }),
    );

    ref[label].label.setOrigin(0.0, 0.5);
    useAdaptation(ref[label].label, () => {
      scaleText(ref[label].label, 10);
      ref[label].label.setPosition(
        switchSize(6),
        ref[label].wrapper.height / 2,
      );
    });

    /**
     * Addon
     */

    if (addon) {
      ref[label].wrapper.add(
        ref[label].addon = addon.component(this, addon.props),
      );

      useAdaptationAfter(ref[label].addon, () => {
        ref[label].addon.setPosition(
          ref[label].wrapper.width - ref[label].addon.width - switchSize(6),
          (ref[label].wrapper.height / 2) - (ref[label].addon.height / 2),
        );
      });
    }
  };

  /**
   * Updating
   */

  return {
    update: () => {
      const currentActions = actions();
      const memoActions = currentActions.map((action) => action.label).join(',');

      if (state.actions !== memoActions) {
        container.removeAll(true);
        ref = {};
        currentActions.forEach(create);
        refreshAdaptive(container);

        state.actions = memoActions;
      }
    },
  };
});
