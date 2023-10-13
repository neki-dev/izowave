import { RelativePosition, RelativeScale, useScene } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { INTERFACE_SCALE } from '~const/interface';
import { Hint } from '~scene/system/interface/hint';
import { GameScene } from '~type/game';
import { IWorld, WorldEvents, WorldHint } from '~type/world';

import { Wrapper } from './styles';

export const RelativeHints: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

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
    world.events.on(WorldEvents.SHOW_HINT, showHint);
    world.events.on(WorldEvents.HIDE_HINT, hideHint);

    return () => {
      world.events.off(WorldEvents.SHOW_HINT, showHint);
      world.events.off(WorldEvents.HIDE_HINT, hideHint);
    };
  }, []);

  return Object.entries(hints).map(([id, hint]) => (
    <RelativePosition key={id} x={hint.position.x} y={hint.position.y}>
      <Wrapper>
        <RelativeScale {...INTERFACE_SCALE}>
          <Hint label={hint.label} side={hint.side} />
        </RelativeScale>
      </Wrapper>
    </RelativePosition>
  ));
};
