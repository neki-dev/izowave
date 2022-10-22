import { INTERFACE_FONT } from '~const/interface';
import { Component, scaleText } from '~lib/ui';
import { ComponentAdditions } from '~scene/screen/components/additions';

type Props = {
  display: () => string
  value: () => number
  maxValue: () => number
  event: (callback: (amount: number) => void) => void
  color: number
};

export const ComponentBar = Component<Props>(function (container, {
  display, value, maxValue, event, color,
}) {
  /**
   * Body
   */

  const body = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.75);

  body.setOrigin(0.0, 0.0);
  body.adaptive = () => {
    body.setSize(container.width, container.height);
  };

  container.add(body);

  /**
   * Progress
   */

  const progress = this.add.rectangle(0, 0, 0, 0, color);

  progress.setOrigin(0.0, 0.0);
  progress.adaptive = (width) => {
    const offset = (width <= 900) ? 1 : 2;

    progress.setPosition(offset, offset);
    progress.height = container.height - (offset * 2);
  };

  container.add(progress);

  /**
   * Value
   */

  const label = this.add.text(0, 0, '', {
    fontFamily: INTERFACE_FONT.PIXEL,
    resolution: window.devicePixelRatio,
  });

  label.setOrigin(0.5, 0.5);
  label.adaptive = () => {
    scaleText(label, {
      by: body.width,
      scale: 0.1,
    });
    label.setPosition(
      container.width / 2,
      container.height / 2,
    );
  };

  container.add(label);

  /**
   * Additions
   */

  const additions = ComponentAdditions.call(this, { event });

  additions.adaptive = () => {
    additions.setPosition(container.width + 10, container.height / 2);
  };

  container.add(additions);

  /**
   * Updating
   */

  return {
    update: () => {
      const percent = value() / maxValue();
      const offset = progress.x;

      progress.width = (body.width - (offset * 2)) * percent;
      label.setText(display());
    },
  };
});
