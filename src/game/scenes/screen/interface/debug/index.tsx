import { useGame, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import type { IGame } from '~game/types';
import { GameScene } from '~game/types';
import type { IWorld } from '~scene/world/types';

import { Value } from './styles';

export const Debug: React.FC = () => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [frames, setFrames] = useState(0);
  const [memory, setMemory] = useState(0);

  useSceneUpdate(world, () => {
    setFrames(Math.round(game.loop.actualFps));

    // @ts-ignore
    const heapSize = performance?.memory?.usedJSHeapSize;
    if (heapSize) {
      setMemory(Math.round(heapSize / 1024 / 1024));
    }
  }, []);

  return (
    <Value>
      {frames} FPS
      {Boolean(memory) && (
        <>
          <br />
          {memory} MB
        </>
      )}
    </Value>
  );
};
