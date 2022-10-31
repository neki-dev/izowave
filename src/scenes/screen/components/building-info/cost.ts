import { INTERFACE_TEXT_COLOR, INTERFACE_FONT } from '~const/interface';
import { Player } from '~entity/player';
import {
  useAdaptation, Component, scaleText, switchSize, useAdaptationAfter, refreshAdaptive,
} from '~lib/ui';
import { ScreenTexture } from '~type/screen';

type Props = {
  player: Player
  amount: () => number
};

export const ComponentCost = Component<Props>(function (container, {
  player, amount,
}) {
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

  useAdaptationAfter(container, () => {
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
  useAdaptation(ref.icon, () => {
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
  useAdaptation(ref.amount, () => {
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

        refreshAdaptive(container, false);
      }

      if (state.need !== currentAmount || state.have !== player.resources) {
        if (player.resources < currentAmount) {
          ref.amount.setColor(INTERFACE_TEXT_COLOR.ERROR);
        } else {
          ref.amount.setColor('#fff');
        }
      }

      state.need = currentAmount;
      state.have = player.resources;
    },
  };
});
