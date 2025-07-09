import { useScene } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import type { WorldScene } from '../..';

import { RelativeHint } from './relative-hint';

import { GameScene } from '~game/types';
import type { WorldHint } from '~scene/world/types';
import { WorldEvent } from '~scene/world/types';

export const RelativeHints: React.FC = () => {
  const world = useScene<WorldScene>(GameScene.WORLD);

  const [hints, setHints] = useState<Record<string, WorldHint>>({});

  const showHint = (id: string, hint: WorldHint) => {
    setHints((current) => ({
      ...current,
      [id]: hint,
    }));
  };

  const hideHint = (id: string) => {
    setHints((current) => {
      if (!current[id]) {
        return current;
      }

      const newHints = { ...current };

      delete newHints[id];

      return newHints;
    });
  };

  useEffect(() => {
    world.events.on(WorldEvent.SHOW_HINT, showHint);
    world.events.on(WorldEvent.HIDE_HINT, hideHint);

    return () => {
      world.events.off(WorldEvent.SHOW_HINT, showHint);
      world.events.off(WorldEvent.HIDE_HINT, hideHint);
    };
  }, []);

  return Object.entries(hints).map(([id, hint]) => (
    <RelativeHint key={id} {...hint} />
  ));
};
