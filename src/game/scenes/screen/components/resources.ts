import { INTERFACE_FONT } from '~const/interface';
import { Component, scaleText, switchSize } from '~lib/interface';
import { ComponentAdditions } from '~scene/screen/components/additions';
import { ScreenTexture } from '~type/screen';
import { PlayerEvents } from '~type/world/entities/player';

export const ComponentResources = Component(function (container) {
  const ref: {
    icon?: Phaser.GameObjects.Image
    label?: Phaser.GameObjects.Text
    amount?: Phaser.GameObjects.Text
    additions?: Phaser.GameObjects.Container
  } = {};

  const state: {
    amount: Nullable<number>
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
  ref.icon.useAdaptationBefore(() => {
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
  ref.label.useAdaptationBefore(() => {
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

  ref.amount.useAdaptationBefore(() => {
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
    ref.additions = ComponentAdditions(this, {
      event: (callback: (amount: number) => void) => {
        this.game.world.player.on(PlayerEvents.UPDATE_RESOURCE, callback);
      },
    }),
  );

  ref.additions.useAdaptationBefore(() => {
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
      if (state.amount !== this.game.world.player.resources) {
        ref.amount.setText(String(this.game.world.player.resources));
        ref.additions.refreshAdaptation(false);

        state.amount = this.game.world.player.resources;
      }
    },
  };
});
