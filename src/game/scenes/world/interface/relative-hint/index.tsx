import { RelativePosition, useScene } from 'phaser-react-ui';
import React, { useEffect, useRef, useState } from 'react';

import { Hint } from '~scene/basic/interface/hint';
import { GameScene } from '~type/game';
import { IWorld, WorldEvents, WorldHint } from '~type/world';

import { Wrapper } from './styles';

export const RelativeHint: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [hint, setHint] = useState<Nullable<WorldHint>>(null);

  const refWrapper = useRef<HTMLDivElement>(null);

  const showHint = (target: WorldHint) => {
    setHint(target);
  };

  const hideHint = () => {
    setHint(null);
  };

  useEffect(() => {
    world.events.on(WorldEvents.SHOW_HINT, showHint);
    world.events.on(WorldEvents.HIDE_HINT, hideHint);

    return () => {
      world.events.off(WorldEvents.SHOW_HINT, showHint);
      world.events.off(WorldEvents.HIDE_HINT, hideHint);
    };
  }, []);

  return hint && (
    <RelativePosition x={hint.position.x} y={hint.position.y}>
      <Wrapper ref={refWrapper}>
        <Hint side={hint.side}>{hint.text}</Hint>
      </Wrapper>
    </RelativePosition>
  );
};
