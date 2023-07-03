import React, { useContext, useEffect, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/interface';
import { Notice, ScreenEvents } from '~type/screen';

import { Item, Wrapper } from './styles';

export const ComponentNotices: React.FC = () => {
  const game = useContext(GameContext);

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
    game.screen.events.on(ScreenEvents.NOTICE, addNotice);

    return () => {
      game.screen.events.off(ScreenEvents.NOTICE, addNotice);
    };
  }, []);

  useWorldUpdate(() => {
    const now = Date.now();

    setNotices((currentNotices) => {
      const newNotices = currentNotices.filter(
        (currentNotice) => now - currentNotice.timestamp < 3000,
      );

      return newNotices.length === currentNotices.length
        ? currentNotices
        : newNotices;
    });
  });

  return (
    <Wrapper>
      {notices.map((notice) => (
        <Item role="notice" key={notice.text} className={notice.type}>
          {notice.text}
        </Item>
      ))}
    </Wrapper>
  );
};

ComponentNotices.displayName = 'ComponentNotices';
