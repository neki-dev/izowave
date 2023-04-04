import React, {
  useContext, useEffect, useRef, useState,
} from 'react';

import { GameContext, useWorldUpdate } from '~lib/ui';
import { ComponentHint } from '~scene/screen/ui/hint';
import { WorldEvents, WorldHint } from '~type/world';

import { Wrapper } from './styles';

export const ComponentRelativeHint: React.FC = () => {
  const game = useContext(GameContext);

  const [hint, setHint] = useState<WorldHint>(null);

  const refHint = useRef<WorldHint>(null);
  const refWrapper = useRef<HTMLDivElement>(null);

  const showHint = (target: WorldHint) => {
    refHint.current = target;
    setHint(target);
  };

  const hideHint = () => {
    refHint.current = null;
    setHint(null);
  };

  useWorldUpdate(() => {
    if (!refHint.current || !refWrapper.current) {
      return;
    }

    const camera = game.world.cameras.main;
    const x = Math.round((refHint.current.position.x - camera.worldView.x) * camera.zoom);
    const y = Math.round((refHint.current.position.y - camera.worldView.y) * camera.zoom);

    refWrapper.current.style.left = `${x}px`;
    refWrapper.current.style.top = `${y}px`;
  });

  useEffect(() => {
    game.world.events.on(WorldEvents.SHOW_HINT, showHint);
    game.world.events.on(WorldEvents.HIDE_HINT, hideHint);

    return () => {
      game.world.events.off(WorldEvents.SHOW_HINT, showHint);
      game.world.events.off(WorldEvents.HIDE_HINT, hideHint);
    };
  }, []);

  return hint && (
    <Wrapper ref={refWrapper}>
      <ComponentHint side={hint.side}>{hint.text}</ComponentHint>
    </Wrapper>
  );
};

ComponentRelativeHint.displayName = 'ComponentRelativeHint';
