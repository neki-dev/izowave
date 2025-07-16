import {
  RelativePosition, RelativeScale, useScene, useSceneUpdate,
} from 'phaser-react-ui';
import React, { useRef, useState } from 'react';

import { isPositionsEqual } from '~core/dimension';
import { INTERFACE_SCALE } from '~core/interface/const';
import type { WorldScene } from '~game/scenes/world';
import { GameScene } from '~game/types';
import { Hint } from '~scene/system/interface/hint';
import type { PositionAtWorld } from '~scene/world/level/types';
import type { WorldHint } from '~scene/world/types';

import { Wrapper } from './styles';

type Props = WorldHint;

export const RelativeHint: React.FC<Props> = ({ label, side, position }) => {
  const world = useScene<WorldScene>(GameScene.WORLD);

  const [currentPosition, setCurrentPosition] = useState(position);

  const refLastPosition = useRef<PositionAtWorld>();

  useSceneUpdate(world, () => {
    if (typeof position === 'function') {
      const newPosition = position();

      if (
        !refLastPosition.current
        || !isPositionsEqual(newPosition, refLastPosition.current)
      ) {
        refLastPosition.current = newPosition;
        setCurrentPosition(newPosition);
      }
    }
  }, []);

  return (
    <RelativePosition x={currentPosition.x} y={currentPosition.y}>
      <Wrapper>
        <RelativeScale {...INTERFACE_SCALE}>
          <Hint label={label} side={side} />
        </RelativeScale>
      </Wrapper>
    </RelativePosition>
  );
};
