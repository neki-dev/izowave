import React from 'react';

import { ComponentAmount } from '~scene/basic/interface/amount';
import { BuildingControl } from '~type/world/entities/building';

import { Wrapper, Action } from './styles';

type Props = {
  actions: BuildingControl[]
};

export const ComponentBuildingControls: React.FC<Props> = ({ actions }) => (
  <Wrapper>
    {actions.map((action) => (
      <Action key={action.label} onClick={action.onClick}>
        <Action.Label>{action.label}</Action.Label>

        {action.cost && (
          <Action.Addon>
            <ComponentAmount
              type="resources"
              value={action.cost}
              view="small"
            />
          </Action.Addon>
        )}
      </Action>
    ))}
  </Wrapper>
);

ComponentBuildingControls.displayName = 'ComponentBuildingControls';
