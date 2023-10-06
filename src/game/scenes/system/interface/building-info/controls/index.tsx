import { useMobilePlatform } from 'phaser-react-ui';
import React from 'react';

import { Cost } from '~scene/system/interface/cost';
import { BuildingControl } from '~type/world/entities/building';

import {
  Wrapper, Action, Label, Addon,
} from './styles';

type Props = {
  list: BuildingControl[]
};

export const BuildingControls: React.FC<Props> = ({ list }) => {
  const isMobile = useMobilePlatform();

  return (
    <Wrapper>
      {list.map((control) => (
        <Action
          key={control.label}
          $disabled={control.disabled}
          {...{
            [isMobile ? 'onTouchEnd' : 'onClick']: control.onClick,
          }}
        >
          <Label>{control.label}</Label>
          {!!control.cost && (
            <Addon>
              <Cost type="resources" value={control.cost} size="small" />
            </Addon>
          )}
        </Action>
      ))}
    </Wrapper>
  );
};
