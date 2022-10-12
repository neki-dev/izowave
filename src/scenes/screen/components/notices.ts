import {
  INTERFACE_BOX_COLOR_ERROR, INTERFACE_BOX_COLOR_INFO,
  INTERFACE_BOX_COLOR_WARN, INTERFACE_FONT_PIXEL,
} from '~const/interface';
import { Component } from '~lib/ui';
import { toEven } from '~lib/utils';
import { Notice, NoticeType } from '~type/interface';

export const ComponentNotices = Component(function (container) {
  const update = () => {
    let offset = 0;
    container.iterate((notice: Phaser.GameObjects.Container) => {
      notice.setPosition(0, offset);
      offset += toEven(notice.height + 5);
    });
  };

  const create = ({ message, type }: Notice) => {
    const containerNotice = this.add.container(0, 0);
    containerNotice.setAlpha(0.0);

    const text = this.add.text(0, 0, message, {
      fontSize: '16px',
      fontFamily: INTERFACE_FONT_PIXEL,
      padding: {
        top: 9,
        bottom: 10,
        left: 10,
        right: 10,
      },
    });
    text.setName('Message');
    text.setOrigin(0.5, 0.0);

    const background = (() => {
      switch (type) {
        case NoticeType.INFO: return INTERFACE_BOX_COLOR_INFO;
        case NoticeType.WARN: return INTERFACE_BOX_COLOR_WARN;
        case NoticeType.ERROR: return INTERFACE_BOX_COLOR_ERROR;
        default: return 0x000000;
      }
    })();
    const body = this.add.rectangle(0, 0, text.width, text.height, background, 0.75);
    body.setOrigin(0.5, 0.0);

    containerNotice.add([body, text]);
    containerNotice.setSize(body.width, body.height);

    return containerNotice;
  };

  this.events.on('notice', (data: Notice) => {
    const existNotice = container.getAll().find((notice: Phaser.GameObjects.Container) => (
      (<Phaser.GameObjects.Text> notice.getByName('Message')).text === data.message
    ));
    if (existNotice) {
      existNotice.destroy();
    }

    const containerNotice = create(data);
    container.add(containerNotice);

    update();

    this.tweens.add({
      targets: containerNotice,
      alpha: 1.0,
      duration: 500,
      ease: 'Power2',
      hold: 2000,
      yoyo: true,
      onComplete: () => {
        containerNotice.destroy();
        update();
      },
    });
  });
});
