import React, {
  useContext, useEffect, useRef, useState,
} from 'react';

import { GameContext, useWorldUpdate } from '~lib/interface';
import { ComponentHint } from '~scene/basic/interface/hint';
import { WorldEvents, WorldHint } from '~type/world';

import { Wrapper } from './styles';

export const ComponentRelativeHint: React.FC = () => {
  const game = useContext(GameContext);

  const [hint, setHint] = useState<WorldHint>(null);

  const refWrapper = useRef<HTMLDivElement>(null);

  const showHint = (target: WorldHint) => {
    setHint(target);
  };

  const hideHint = () => {
    setHint(null);
  };

  useEffect(() => {
    game.world.events.on(WorldEvents.SHOW_HINT, showHint);
    game.world.events.on(WorldEvents.HIDE_HINT, hideHint);

    return () => {
      game.world.events.off(WorldEvents.SHOW_HINT, showHint);
      game.world.events.off(WorldEvents.HIDE_HINT, hideHint);
    };
  }, []);

  useWorldUpdate(() => {
    if (!hint || !refWrapper.current) {
      return;
    }

    const camera = game.world.cameras.main;
    const x = Math.round((hint.position.x - camera.worldView.x) * camera.zoom);
    const y = Math.round((hint.position.y - camera.worldView.y) * camera.zoom);

    refWrapper.current.style.left = `${x}px`;
    refWrapper.current.style.top = `${y}px`;
  }, [hint]);

  return hint && (
    <Wrapper ref={refWrapper}>
      <ComponentHint side={hint.side}>{hint.text}</ComponentHint>
    </Wrapper>
  );
};

ComponentRelativeHint.displayName = 'ComponentRelativeHint';
