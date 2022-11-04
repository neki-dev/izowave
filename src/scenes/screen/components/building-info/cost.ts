import { INTERFACE_TEXT_COLOR, INTERFACE_FONT } from '~const/interface';
import { Component, scaleText, switchSize } from '~lib/interface';
import { World } from '~scene/world';
import { SceneKey } from '~type/core';
import { ScreenTexture } from '~type/screen';

type Props = {
  amount: () => number
};

export const ComponentCost = Component<Props>(function (container, {
  amount,
}) {
  const world = <World> this.scene.get(SceneKey.WORLD);

  const ref: {
    icon?: Phaser.GameObjects.Image
    amount?: Phaser.GameObjects.Text
  } = {};

  const state: {
    need: number
    have: number
  } = {
    need: null,
    have: null,
  };

  /**
   * Adaptation
   */

  container.useAdaptationAfter(() => {
    container.setSize(
      ref.amount.x + ref.amount.width,
      ref.icon.displayHeight,
    );
  });

  /**
   * Icon
   */

  container.add(
    ref.icon = this.add.image(0, 0, ScreenTexture.RESOURCES),
  );

  ref.icon.setOrigin(0.0, 0.5);
  ref.icon.setScale(0.38);
  ref.icon.useAdaptationBefore(() => {
    ref.icon.setPosition(
      0,
      container.height / 2,
    );
  });

  /**
   * Amount
   */

  container.add(
    ref.amount = this.add.text(0, 0, '', {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
    }),
  );

  ref.amount.setOrigin(0.0, 0.5);
  ref.amount.useAdaptationBefore(() => {
    scaleText(ref.amount, 11);
    ref.amount.setPosition(
      ref.icon.x + ref.icon.displayWidth + switchSize(3),
      container.height / 2 - 1,
    );
  });

  /**
   * Updating
   */

  return {
    update: () => {
      const currentAmount = amount();

      if (state.need !== currentAmount) {
        ref.amount.setText(String(currentAmount));

        container.refreshAdaptation(false);
      }

      if (state.need !== currentAmount || state.have !== world.player.resources) {
        if (world.player.resources < currentAmount) {
          ref.amount.setColor(INTERFACE_TEXT_COLOR.ERROR);
        } else {
          ref.amount.setColor('#fff');
        }
      }

      state.need = currentAmount;
      state.have = world.player.resources;
    },
  };
});
