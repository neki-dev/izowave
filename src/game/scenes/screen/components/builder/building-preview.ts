import { TILE_META } from '~const/world/level';
import { Component, switchSize } from '~lib/interface';
import { ComponentCost } from '~scene/screen/components/building-info/cost';

type Props = {
  image: () => string
  cost: () => number
};

export const ComponentBuildingPreview = Component<Props>(function (container, {
  image, cost,
}) {
  const ref: {
    image?: Phaser.GameObjects.Image
    costAmount?: Phaser.GameObjects.Container
    costBody?: Phaser.GameObjects.Rectangle
  } = {};

  const state: {
    image: string
    cost: number
  } = {
    image: null,
    cost: null,
  };

  /**
   * Image
   */

  container.add(
    ref.image = this.add.image(0, 0, image()),
  );

  ref.image.setOrigin(0.5, TILE_META.origin);

  /**
   * Cos: Body
   */

  container.add(
    ref.costBody = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.75),
  );

  ref.costBody.setOrigin(0.5, 0.0);
  ref.costBody.useAdaptationBefore(() => {
    const padding = switchSize(8);
    const offset = switchSize(10);

    ref.costBody.setPosition(0, -(ref.image.displayHeight / 2) - offset - (padding / 2));
    ref.costBody.setSize(ref.costAmount.width + padding, ref.costAmount.height + padding);
  });

  /**
   * Cost: Amount
   */

  container.add(
    ref.costAmount = ComponentCost(this, {
      amount: cost,
    }),
  );

  ref.costAmount.useAdaptationBefore(() => {
    const offset = switchSize(10);

    ref.costAmount.setPosition(-ref.costAmount.width / 2, -(ref.image.displayHeight / 2) - offset);
  });

  /**
   * Updating
   */

  return {
    update: () => {
      const currentImage = image();

      if (state.image !== currentImage) {
        ref.image.setTexture(currentImage);
      }

      const currentCost = cost();

      if (state.cost !== currentCost) {
        ref.costBody.refreshAdaptation();
        ref.costAmount.refreshAdaptation();
      }
    },
  };
});
