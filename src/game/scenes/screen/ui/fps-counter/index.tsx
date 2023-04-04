import React, { useContext, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/ui';

import { Value } from './styles';

export const ComponentFPSCounter: React.FC = () => {
  const game = useContext(GameContext);

  const [value, setValue] = useState(Math.round(game.loop.actualFps));

  useWorldUpdate(() => {
    setValue(Math.round(game.loop.actualFps));
  });

  return (
    <Value>
      {value} FPS
    </Value>
  );
};

ComponentFPSCounter.displayName = 'ComponentFPSCounter';
