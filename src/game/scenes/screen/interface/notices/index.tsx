import { useCurrentScene } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { phrase } from '~lib/lang';
import { IScreen, Notice, ScreenEvents } from '~type/screen';

import { Item, Wrapper } from './styles';

export const Notices: React.FC = () => {
  const screen = useCurrentScene<IScreen>();

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
            }, 3000),
          };
        }

        return currentNotice;
      });

      if (!isExist) {
        newNotices.push({
          ...notice,
          timer: setTimeout(() => {
            removeNotice(notice.text);
          }, 3000),
        });
      }

      return newNotices;
    });
  };

  useEffect(() => {
    screen.events.on(ScreenEvents.NOTICE, addNotice);

    return () => {
      screen.events.off(ScreenEvents.NOTICE, addNotice);
    };
  }, []);

  return (
    <Wrapper>
      {notices.map((notice) => (
        <Item role="notice" key={notice.text} $type={notice.type}>
          {phrase(notice.text, notice.format)}
        </Item>
      ))}
    </Wrapper>
  );
};
