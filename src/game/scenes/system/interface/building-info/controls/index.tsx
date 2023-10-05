import React from 'react';

import { Cost } from '~scene/system/interface/cost';
import { BuildingControl } from '~type/world/entities/building';

import {
  Wrapper, Action, Label, Addon,
} from './styles';

type Props = {
  list: BuildingControl[]
};

export const BuildingControls: React.FC<Props> = ({ list }) => (
  <Wrapper>
    {list.map((control) => (
      <Action key={control.label} onClick={control.onClick} $disabled={control.disabled}>
        <Label>{control.label}</Label>

        {!!control.cost && (
          <Addon>
            <Cost
              type="resources"
              value={control.cost}
              size="small"
            />
          </Addon>
        )}
      </Action>
    ))}
  </Wrapper>
);
