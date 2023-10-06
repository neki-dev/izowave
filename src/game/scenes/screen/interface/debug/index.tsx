import { useGame, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene, IGame } from '~type/game';
import { IWorld } from '~type/world';

import { Value } from './styles';

export const Debug: React.FC = () => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [frames, setFrames] = useState(0);
  const [memory, setMemory] = useState<string>();

  useSceneUpdate(world, () => {
    setFrames(Math.round(game.loop.actualFps));

    // @ts-ignore
    const heapSize = performance?.memory?.usedJSHeapSize;

    if (heapSize) {
      setMemory((heapSize / 1024 / 1024).toFixed(2));
    }
  }, []);

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
