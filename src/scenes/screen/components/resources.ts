import { INTERFACE_FONT } from '~const/interface';
import { Player } from '~entity/player';
import {
  useAdaptation, Component, scaleText, switchSize, refreshAdaptive,
} from '~lib/ui';
import { ComponentAdditions } from '~scene/screen/components/additions';
import { ScreenTexture } from '~type/screen';
import { PlayerEvents } from '~type/world/entities/player';

type Props = {
  player: Player
};

export const ComponentResources = Component<Props>(function (container, {
  player,
}) {
  const ref: {
    icon?: Phaser.GameObjects.Image
    label?: Phaser.GameObjects.Text
    amount?: Phaser.GameObjects.Text
    additions?: Phaser.GameObjects.Container
  } = {};

  const state: {
    amount: number
  } = { amount: null };

  /**
   * Creating
   */

  /**
   * Icon
   */

  container.add(
    ref.icon = this.add.image(0, 0, ScreenTexture.RESOURCES),
  );

  ref.icon.setOrigin(0.0, 0.0);
  useAdaptation(ref.icon, () => {
    ref.icon.setScale(switchSize(1.0));
  });

  /**
   * Label
   */

  container.add(
    ref.label = this.add.text(0, 0, 'Resources', {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      shadow: {
        fill: true,
      },
    }),
  );

  ref.label.setAlpha(0.75);
  useAdaptation(ref.label, () => {
    scaleText(ref.label, 9, true);
    ref.label.setPosition(
      ref.icon.x + ref.icon.width + switchSize(8),
      0,
    );
  });

  /**
   * Amount
   */

  container.add(
    ref.amount = this.add.text(0, 0, '0', {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      shadow: {
        fill: true,
      },
    }),
  );

  useAdaptation(ref.amount, () => {
    scaleText(ref.amount, 16, true);
    ref.amount.setPosition(
      ref.icon.x + ref.icon.width + switchSize(8) - 1,
      ref.label.y + ref.label.height + 2,
    );
  });

  /**
   * Additions
   */

  container.add(
    ref.additions = ComponentAdditions.call(this, {
      event: (callback: (amount: number) => void) => {
        player.on(PlayerEvents.UPDATE_RESOURCE, callback);
      },
    }),
  );

  useAdaptation(ref.additions, () => {
    ref.additions.setPosition(
      ref.amount.x + ref.amount.width + switchSize(8),
      ref.amount.y + (ref.amount.height / 2) - 1,
    );
  });

  /**
   * Updating
   */

  return {
    update: () => {
      if (state.amount !== player.resources) {
        ref.amount.setText(String(player.resources));
        refreshAdaptive(ref.additions, false);

        state.amount = player.resources;
      }
    },
  };
});
