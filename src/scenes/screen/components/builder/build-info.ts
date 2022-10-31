import { INTERFACE_BOX_COLOR, INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { Player } from '~entity/player';
import {
  useAdaptation, Component, scaleText, switchSize, useAdaptationAfter, refreshAdaptive,
} from '~lib/ui';
import { ComponentCost } from '~scene/screen/components/building-info/cost';
import { ComponentParams } from '~scene/screen/components/building-info/params';
import { BuildingParamItem } from '~type/world/entities/building';

type Props = {
  player: Player
  name: string
  description: string
  params: BuildingParamItem[]
  cost: number
  limit?: [number, number]
  allowed: boolean
};

export const ComponentBuildInfo = Component<Props>(function (container, {
  player, name, description, params, cost, limit, allowed,
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

  useAdaptation(container, () => {
    // eslint-disable-next-line no-param-reassign
    container.width = switchSize(220);
  });

  useAdaptationAfter(container, () => {
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
  useAdaptation(ref.body, () => {
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

  useAdaptation(ref.name, () => {
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

  useAdaptation(ref.description, () => {
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
      refreshAdaptive(container, false);
      refreshAdaptive(ref.body);
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

      useAdaptation(ref.limit, () => {
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
      ref.params = ComponentParams.call(this, {
        unknown: !allowed,
        items: () => params,
      }),
    );

    useAdaptation(ref.params, () => {
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
    useAdaptation(ref.costBody, () => {
      ref.costBody.setPosition(
        switchSize(12),
        ref.params.y + ref.params.height + switchSize(12),
      );
      ref.costBody.setSize(
        container.width - (ref.costBody.x * 2),
        switchSize(27),
      );

      refreshAdaptive(container, false);
      refreshAdaptive(ref.body);
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
    useAdaptation(ref.costLabel, () => {
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
      ref.cost = ComponentCost.call(this, {
        player,
        amount: () => cost,
      }),
    );

    useAdaptation(ref.cost, () => {
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
  useAdaptation(ref.pointer, () => {
    ref.pointer.setPosition(
      container.width,
      switchSize(27),
    );
  });
});
