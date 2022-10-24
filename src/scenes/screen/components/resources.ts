import { INTERFACE_FONT, RESOURCE_COLOR } from '~const/interface';
import { Player } from '~entity/player';
import { useAdaptation, Component, scaleText } from '~lib/ui';
import { ComponentAdditions } from '~scene/screen/components/additions';
import { PlayerEvents } from '~type/world/entities/player';
import { ResourceType } from '~type/world/resources';

type Props = {
  player: Player
};

export const ComponentResources = Component<Props>(function (container, {
  player,
}) {
  Object.values(ResourceType).forEach((type, index) => {
    /**
     * Wrapper
     */
    const wrapper = this.add.container();

    useAdaptation(wrapper, (width, height) => {
      const offsetY = height * 0.008;

      wrapper.setSize(
        Math.max(60, width * 0.06),
        Math.max(25, width * 0.02),
      );
      wrapper.setPosition(0, (wrapper.height + offsetY) * index);
    });

    container.add(wrapper);

    /**
     * Body
     */

    const body = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.75);

    body.setOrigin(0.0, 0.0);
    useAdaptation(body, () => {
      body.setSize(wrapper.width, wrapper.height);
    });

    wrapper.add(body);

    /**
     * Icon
     */

    const icon = this.add.rectangle(0, 0, 0, 0, RESOURCE_COLOR[type]);

    icon.setOrigin(0.0, 0.0);
    useAdaptation(icon, () => {
      const offset = wrapper.height * 0.18;
      const size = wrapper.height - (offset * 2);

      icon.setPosition(offset, offset);
      icon.setSize(size, size);
    });

    wrapper.add(icon);

    /**
     * Text
     */

    const text = this.add.text(0, 0, type, {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      color: '#ddd',
    });

    useAdaptation(text, () => {
      const offsetX = wrapper.height * 0.2;
      const offsetY = wrapper.height * 0.18;

      scaleText(text, {
        by: wrapper.height,
        scale: 0.2,
      });
      text.setPosition(
        icon.x + icon.width + offsetX,
        offsetY,
      );
    });

    wrapper.add(text);

    /**
     * Amount
     */

    const amount = this.add.text(0, 0, '', {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
    });

    amount.setName('Amount');
    amount.setOrigin(0.0, 1.0);
    useAdaptation(amount, () => {
      const offsetX = wrapper.height * 0.2;
      const offsetY = wrapper.height * 0.2;

      scaleText(amount, {
        by: wrapper.height,
        scale: 0.4,
      });
      amount.setPosition(
        icon.x + icon.width + offsetX,
        wrapper.height - offsetY,
      );
    });

    wrapper.add(amount);

    /**
     * Additions
     */

    const additions = ComponentAdditions.call(this, {
      combine: true,
      event: (callback: (value: number) => void) => {
        player.on(PlayerEvents.UPDATE_RESOURCE, (resourceType: ResourceType, value: number) => {
          if (resourceType === type) {
            callback(value);
          }
        });
      },
    });

    useAdaptation(additions, () => {
      additions.setPosition(wrapper.width + 10, wrapper.height / 2);
    });

    wrapper.add(additions);
  });

  return {
    update: () => {
      Object.values(ResourceType).forEach((type, index) => {
        const item = <Phaser.GameObjects.Container> container.getAt(index);
        const amount = <Phaser.GameObjects.Text> item.getByName('Amount');

        amount.setText(String(player.getResource(type)));
      });
    },
  };
});
