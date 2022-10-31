import { INTERFACE_FONT } from '~const/interface';
import {
  useAdaptation, Component, scaleText, switchSize,
} from '~lib/ui';
import { ComponentAdditions } from '~scene/screen/components/additions';

type Props = {
  display: () => string
  percent: () => number
  event: (callback: (amount: number) => void) => void
  color: number
};

export const ComponentBar = Component<Props>(function (container, {
  display, percent, event, color,
}) {
  const ref: {
    body?: Phaser.GameObjects.Rectangle
    progress?: Phaser.GameObjects.Rectangle
    value?: Phaser.GameObjects.Text
    additions?: Phaser.GameObjects.Container
  } = {};

  const state: {
    percent: number
    display: string
  } = {
    percent: null,
    display: null,
  };

  /**
   * Adaptation
   */

  useAdaptation(container, () => {
    container.setSize(
      switchSize(104),
      switchSize(26),
    );
  });

  /**
   * Body
   */

  container.add(
    ref.body = this.add.rectangle(0, 0, 0, 0, 0x000000),
  );

  ref.body.setOrigin(0.0, 0.0);
  useAdaptation(ref.body, () => {
    ref.body.setSize(container.width, container.height);
  });

  /**
   * Progress
   */

  container.add(
    ref.progress = this.add.rectangle(0, 0, 0, 0, color),
  );

  ref.progress.setOrigin(0.0, 0.0);
  useAdaptation(ref.progress, (width) => {
    const offset = (width <= 900) ? 1 : 2;

    ref.progress.setPosition(offset, offset);
    ref.progress.height = container.height - (offset * 2);
  });

  /**
   * Value
   */

  container.add(
    ref.value = this.add.text(0, 0, '', {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      shadow: {
        fill: true,
      },
    }),
  );

  ref.value.setOrigin(0.5, 0.5);
  useAdaptation(ref.value, () => {
    scaleText(ref.value, 10, true);
    ref.value.setPosition(
      container.width / 2,
      container.height / 2,
    );
  });

  /**
   * Additions
   */

  container.add(
    ref.additions = ComponentAdditions.call(this, { event }),
  );

  useAdaptation(ref.additions, () => {
    ref.additions.setPosition(container.width + 10, container.height / 2);
  });

  /**
   * Updating
   */

  return {
    update: () => {
      const currentDisplay = display();
      const currentPercent = percent();

      if (state.percent !== currentPercent) {
        const offset = ref.progress.x;
        const fullWidth = ref.body.width - (offset * 2);

        ref.progress.width = fullWidth * currentPercent;

        state.percent = currentPercent;
      }

      if (state.display !== currentDisplay) {
        ref.value.setText(currentDisplay);

        state.display = currentDisplay;
      }
    },
  };
});
