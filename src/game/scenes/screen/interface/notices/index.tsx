import { useCurrentScene } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import type { ScreenScene } from '../..';

import { NOTICE_DURATION } from './const';
import imageFailure from './images/failure.png';

import { phrase } from '~core/lang';
import type { Notice } from '~scene/screen/types';
import { ScreenEvent } from '~scene/screen/types';

import { Icon, Item, Wrapper } from './styles';

export const Notices: React.FC = () => {
  const screen = useCurrentScene<ScreenScene>();

  const [notices, setNotices] = useState<Notice[]>([]);

  const removeNotice = (text: string) => {
    setNotices((currentNotices) => (
      currentNotices.filter((currentNotice) => currentNotice.text !== text)
    ));
  };

  const addNotice = (notice: Notice) => {
    setNotices((currentNotices) => {
      let isExist = false;
      const newNotices = currentNotices.map((currentNotice) => {
        if (currentNotice.text === notice.text) {
          isExist = true;

          clearTimeout(currentNotice.timer);

          return {
            ...currentNotice,
            timer: setTimeout(() => {
              removeNotice(currentNotice.text);
            }, NOTICE_DURATION),
          };
        }

        return currentNotice;
      });

      if (!isExist) {
        newNotices.push({
          ...notice,
          timer: setTimeout(() => {
            removeNotice(notice.text);
          }, NOTICE_DURATION),
        });
      }

      return newNotices;
    });
  };

  useEffect(() => {
    screen.events.on(ScreenEvent.NOTICE, addNotice);

    return () => {
      screen.events.off(ScreenEvent.NOTICE, addNotice);
    };
  }, []);

  return (
    <Wrapper>
      {notices.map((notice) => (
        <Item role="notice" key={notice.text}>
          <Icon src={imageFailure} />
          {phrase(notice.text, notice.format)}
        </Item>
      ))}
    </Wrapper>
  );
};
