import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { Component, scaleText } from '~lib/ui';
import { Notice, NoticeType } from '~type/screen/notice';

export const ComponentNotices = Component(function (container) {
  const update = () => {
    let offset = 0;

    container.iterate((notice: Phaser.GameObjects.Container) => {
      notice.setPosition(0, offset);
      offset += notice.height + (window.innerWidth * 0.005);
    });
  };

  const create = ({ message, type }: Notice) => {
    const notice = this.add.text(0, 0, message, {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      backgroundColor: (() => {
        switch (type) {
          case NoticeType.INFO: return INTERFACE_TEXT_COLOR.INFO_DARK;
          case NoticeType.WARN: return INTERFACE_TEXT_COLOR.WARN_DARK;
          case NoticeType.ERROR: return INTERFACE_TEXT_COLOR.ERROR_DARK;
          default: return '#000';
        }
      })(),
    });

    notice.setOrigin(0.5, 0.0);
    notice.adaptive = (width) => {
      const padding = width * 0.006;

      scaleText(notice, {
        by: width,
        scale: 0.01,
      });
      notice.setPadding(padding, padding * 0.8, padding, padding);
    };

    return notice;
  };

  this.events.on('notice', (data: Notice) => {
    container.iterate((notice: Phaser.GameObjects.Text) => {
      if (notice.text === data.message) {
        notice.destroy();
      }
    });

    const notice = create(data);

    container.add(notice);
    container.refreshAdaptive();

    update();

    this.tweens.add({
      targets: notice,
      alpha: 1.0,
      duration: 500,
      ease: 'Power2',
      hold: 2000,
      yoyo: true,
      onComplete: () => {
        notice.destroy();
        update();
      },
    });
  });
});
