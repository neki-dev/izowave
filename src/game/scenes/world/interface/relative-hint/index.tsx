import { RelativePosition, useScene } from 'phaser-react-ui';
import React, { useEffect, useRef, useState } from 'react';

import { ComponentHint } from '~scene/basic/interface/hint';
import { GameScene } from '~type/game';
import { IWorld, WorldEvents, WorldHint } from '~type/world';

import { Wrapper } from './styles';

export const ComponentRelativeHint: React.FC = () => {
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
        <ComponentHint side={hint.side}>{hint.text}</ComponentHint>
      </Wrapper>
    </RelativePosition>
  );
};

ComponentRelativeHint.displayName = 'ComponentRelativeHint';
