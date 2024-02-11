import {
  RelativePosition, RelativeScale, useScene, useSceneUpdate,
} from 'phaser-react-ui';
import React, { useRef, useState } from 'react';

import { GameScene } from '../../../../../types';
import { isPositionsEqual } from '~lib/dimension';
import { INTERFACE_SCALE } from '~lib/interface/const';
import { Hint } from '~scene/system/interface/hint';
import type { PositionAtWorld } from '~scene/world/level/types';
import { WorldHint, IWorld } from '~scene/world/types';

import { Wrapper } from './styles';

type Props = WorldHint;

export const RelativeHint: React.FC<Props> = ({ label, side, position }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

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
