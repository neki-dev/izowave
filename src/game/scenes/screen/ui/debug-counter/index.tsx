import React, { useContext, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/ui';

import { Value } from './styles';

export const ComponentDebugCounter: React.FC = () => {
  const game = useContext(GameContext);

  const [frames, setFrames] = useState(0);
  const [memory, setMemory] = useState<string>();

  useWorldUpdate(() => {
    setFrames(Math.round(game.loop.actualFps));

    // @ts-ignore
    const heapSize = performance?.memory?.usedJSHeapSize;

    if (heapSize) {
      setMemory((heapSize / 1024 / 1024).toFixed(2));
    }
  });

  return (
    <Value>
      {frames} FPS
      {memory && (
        <>
          <br />
          {memory} MB
        </>
      )}
    </Value>
  );
};

ComponentDebugCounter.displayName = 'ComponentDebugCounter';
