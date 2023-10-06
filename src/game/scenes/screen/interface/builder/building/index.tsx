import { useMatchMedia } from 'phaser-react-ui';
import React, { useEffect, useRef } from 'react';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { Hint } from '~scene/system/interface/hint';
import { BuildingVariant } from '~type/world/entities/building';

import { BuilderInfo } from './info';
import { BuilderPreview } from './preview';
import { Container, Info } from './styles';

type Props = {
  variant: BuildingVariant
  number: number
  isActive?: boolean
  hint?: string
  refScroll: React.RefObject<HTMLDivElement>
};

export const Building: React.FC<Props> = ({
  variant, number, isActive, hint, refScroll,
}) => {
  const isSmallScreen = useMatchMedia(INTERFACE_MOBILE_BREAKPOINT);

  const refContainer = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    if (!refScroll.current || !refContainer.current) {
      return;
    }

    const parentRect = refScroll.current.getBoundingClientRect();
    const containerRect = refContainer.current.getBoundingClientRect();

    let mask = '';
    let method: Nullable<'up' | 'down'> = null;
    let force = 0;

    if (parentRect.top > containerRect.top && parentRect.top < containerRect.bottom) {
      method = 'up';
      force = 1 - (containerRect.bottom - parentRect.top) / containerRect.height;
    } else if (parentRect.bottom > containerRect.top && parentRect.bottom < containerRect.bottom) {
      method = 'down';
      force = 1 - (parentRect.bottom - containerRect.top) / containerRect.height;
    }

    if (method) {
      mask = `
        linear-gradient(
          ${method === 'up' ? 180 : 0}deg, 
          rgba(0, 0, 0, 0) ${force * 100}%, 
          rgba(0, 0, 0, 1) 100%
        )
      `;
    }

    refContainer.current.style.webkitMaskImage = mask;
    refContainer.current.style.maskImage = mask;
  };

  useEffect(() => {
    if (!isSmallScreen) {
      return;
    }

    const elScroll = refScroll.current;
    const elContainer = refContainer.current;

    if (!elScroll || !elContainer) {
      return;
    }

    onScroll();

    elScroll.addEventListener('scroll', onScroll);

    return () => {
      elScroll.removeEventListener('scroll', onScroll);

      elContainer.style.webkitMaskImage = '';
      elContainer.style.maskImage = '';
    };
  }, [isSmallScreen]);

  return (
    <Container ref={refContainer}>
      <Info $visible={isActive}>
        <BuilderInfo variant={variant} />
      </Info>
      {hint && (
        <Hint side="right">{hint}</Hint>
      )}
      <BuilderPreview variant={variant} number={number} />
    </Container>
  );
};
