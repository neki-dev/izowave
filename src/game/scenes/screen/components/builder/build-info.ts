import { INTERFACE_BOX_COLOR, INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { Component, scaleText, switchSize } from '~lib/interface';
import { ComponentCost } from '~game/scenes/screen/components/building-info/cost';
import { ComponentParams } from '~game/scenes/screen/components/building-info/params';
import { BuildingParamItem } from '~type/world/entities/building';

type Props = {
  name: string
  description: string
  params: BuildingParamItem[]
  cost: number
  limit?: [number, number]
  allowed: boolean
};

export const ComponentBuildInfo = Component<Props>(function (container, {
  name, description, params, cost, limit, allowed,
}) {
  const ref: {
    body?: Phaser.GameObjects.Rectangle
    name?: Phaser.GameObjects.Text
    limit?: Phaser.GameObjects.Text
    description?: Phaser.GameObjects.Text
    params?: Phaser.GameObjects.Container
    costBody?: Phaser.GameObjects.Rectangle
    costLabel?: Phaser.GameObjects.Text
    cost?: Phaser.GameObjects.Container
    pointer?: Phaser.GameObjects.Triangle
  } = {};

  /**
   * Adaptation
   */

  container.useAdaptationBefore(() => {
    // eslint-disable-next-line no-param-reassign
    container.width = switchSize(220);
  });

  container.useAdaptationAfter(() => {
    // eslint-disable-next-line no-param-reassign
    container.height = ((ref.costBody)
      ? (ref.costBody.y + ref.costBody.height)
      : (ref.description.y + ref.description.height)
    ) + switchSize(12);
  });

  /**
   * Creating
   */

  /**
   * Body
   */

  container.add(
    ref.body = this.add.rectangle(0, 0, 0, 0, INTERFACE_BOX_COLOR.BLUE, 0.8),
  );

  ref.body.setOrigin(0.0, 0.0);
  ref.body.useAdaptationBefore(() => {
    ref.body.setSize(container.width, container.height);
  });

  /**
   * Name
   */

  container.add(
    ref.name = this.add.text(0, 0, name, {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      color: INTERFACE_TEXT_COLOR.PRIMARY,
      shadow: {
        color: '#332717',
        fill: true,
      },
    }),
  );

  ref.name.useAdaptationBefore(() => {
    scaleText(ref.name, 18, true);
    ref.name.setPosition(
      switchSize(12),
      switchSize(12),
    );
  });

  /**
   * Description
   */

  container.add(
    ref.description = this.add.text(0, 0, description, {
      // resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.MONOSPACE,
    }),
  );

  ref.description.useAdaptationBefore(() => {
    const offsetX = switchSize(12);

    scaleText(ref.description, 12);
    ref.description.setPosition(
      offsetX,
      ref.name.y + ref.name.height + switchSize(6),
    );
    ref.description.setWordWrapWidth(
      container.width - (offsetX * 2),
    );

    if (!allowed) {
      container.refreshAdaptation(false);
      ref.body.refreshAdaptation();
    }
  });

  if (allowed) {
    /**
     * Limit
     */

    if (limit) {
      container.add(
        ref.limit = this.add.text(0, 0, `CURRENT LIMIT: ${limit[0]}/${limit[1]}`, {
          // resolution: window.devicePixelRatio,
          fontFamily: INTERFACE_FONT.MONOSPACE,
          color: (limit[0] >= limit[1])
            ? INTERFACE_TEXT_COLOR.ERROR
            : '#dddddd',
        }),
      );

      ref.limit.useAdaptationBefore(() => {
        scaleText(ref.limit, 11);
        ref.limit.setPosition(
          switchSize(12),
          ref.description.y + ref.description.height + switchSize(8),
        );
      });
    }

    /**
     * Params
     */

    container.add(
      ref.params = ComponentParams(this, {
        params: () => params,
      }),
    );

    ref.params.useAdaptationBefore(() => {
      ref.params.setPosition(
        switchSize(12),
        (ref.limit
          ? (ref.limit.y + ref.limit.height)
          : (ref.description.y + ref.description.height)
        ) + switchSize(12),
      );
    });

    /**
     * Cost: Body
     */

    container.add(
      ref.costBody = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.5),
    );

    ref.costBody.setOrigin(0.0, 0.0);
    ref.costBody.useAdaptationBefore(() => {
      ref.costBody.setPosition(
        switchSize(12),
        ref.params.y + ref.params.height + switchSize(12),
      );
      ref.costBody.setSize(
        container.width - (ref.costBody.x * 2),
        switchSize(27),
      );

      container.refreshAdaptation(false);
      ref.body.refreshAdaptation();
    });

    /**
     * Cost: Label
     */

    container.add(
      ref.costLabel = this.add.text(0, 0, 'BUILDING COST', {
      // resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.MONOSPACE,
      }),
    );

    ref.costLabel.setOrigin(0.0, 0.5);
    ref.costLabel.useAdaptationBefore(() => {
      scaleText(ref.costLabel, 10);
      ref.costLabel.setPosition(
        ref.costBody.x + switchSize(9),
        ref.costBody.y + (ref.costBody.height / 2),
      );
    });

    /**
     * Cost: Amount
     */

    container.add(
      ref.cost = ComponentCost(this, {
        amount: () => cost,
      }),
    );

    ref.cost.useAdaptationBefore(() => {
      ref.cost.setPosition(
        ref.costLabel.x + ref.costLabel.width + switchSize(3),
        ref.costLabel.y - (ref.cost.height / 2) - 1,
      );
    });
  }

  /**
   * Pointer
   */

  const size = switchSize(10);

  container.add(
    ref.pointer = this.add.triangle(0, 0, 0, -size, size, 0, 0, size, ref.body.fillColor, ref.body.fillAlpha),
  );

  ref.pointer.setOrigin(0.0, 0.0);
  ref.pointer.useAdaptationBefore(() => {
    ref.pointer.setPosition(
      container.width,
      switchSize(27),
    );
  });
});
