import { RelativePosition, RelativeScale } from 'phaser-react-ui';
import React, { useEffect, useRef } from 'react';

import { INTERFACE_SCALE } from '~core/interface/const';
import { Cost } from '~scene/system/interface/cost';
import type { PositionAtWorld } from '~scene/world/level/types';

import { Container } from './styles';

type Props = {
  position: PositionAtWorld
  value: number
  onHide: () => void
};

export const Amount: React.FC<Props> = ({ position, value, onHide }) => {
  const refContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: Nullable<NodeJS.Timeout> = null;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        const el = refContainer.current;

        if (!el) {
          return;
        }

        const opacity = el.style.opacity ? parseFloat(el.style.opacity) : 1.0;

        if (opacity === 0) {
          onHide();
        } else {
          el.style.opacity = String(opacity - 0.05);
        }
      }, 50);
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <RelativePosition x={position.x} y={position.y}>
      <RelativeScale {...INTERFACE_SCALE}>
        <Container ref={refContainer}>
          <Cost type='RESOURCES' value={`+${value}`} />
        </Container>
      </RelativeScale>
    </RelativePosition>
  );
};
