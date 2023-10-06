import { useCurrentScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { IScreen, Notice, ScreenEvents } from '~type/screen';

import { Item, Wrapper } from './styles';

export const Notices: React.FC = () => {
  const screen = useCurrentScene<IScreen>();

  const [notices, setNotices] = useState<Notice[]>([]);

  const addNotice = (data: Notice) => {
    setNotices((currentNotices) => {
      let isExist = false;
      const newNotices = currentNotices.map((currentNotice) => {
        if (currentNotice.text === data.text) {
          isExist = true;

          return {
            ...currentNotice,
            timestamp: Date.now(),
          };
        }

        return currentNotice;
      });

      if (!isExist) {
        newNotices.push({
          ...data,
          timestamp: Date.now(),
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

  useSceneUpdate(screen, () => {
    const now = Date.now();

    setNotices((currentNotices) => {
      const newNotices = currentNotices.filter(
        (currentNotice) => now - currentNotice.timestamp < 3000,
      );

      return newNotices.length === currentNotices.length
        ? currentNotices
        : newNotices;
    });
  }, []);

  return (
    <Wrapper>
      {notices.map((notice) => (
        <Item role="notice" key={notice.text} $type={notice.type}>
          {notice.text}
        </Item>
      ))}
    </Wrapper>
  );
};
