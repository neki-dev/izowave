import { useMobilePlatform } from 'phaser-react-ui';
import React, { useEffect, useRef } from 'react';

import { Cost } from '~scene/system/interface/cost';
import { BuildingControl } from '~type/world/entities/building';

import {
  Container, Label, Addon, Main, Key,
} from './styles';

type Props = {
  control: BuildingControl
};

export const Action: React.FC<Props> = ({ control }) => {
  const isMobile = useMobilePlatform();

  const refContainer = useRef<HTMLDivElement>(null);

  const onClick = (event: MouseEvent) => {
    control.onClick();
    event.stopPropagation();
  };

  useEffect(() => {
    const el = refContainer.current;

    if (!el) {
      return;
    }

    el.addEventListener('mousedown', onClick);

    return () => {
      el.removeEventListener('mousedown', onClick);
    };
  }, []);

  return (
    <Container
      ref={refContainer}
      $disabled={control.disabled}
    >
      <Main>
        {!isMobile && (
          <Key>{control.hotkey}</Key>
        )}
        <Label>{control.label}</Label>
      </Main>
      {!!control.cost && (
        <Addon>
          <Cost type="resources" value={control.cost} />
        </Addon>
      )}
    </Container>
  );
};
