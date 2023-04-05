import React from 'react';

import { ComponentCost } from '~interface/cost';
import { BuildingAction } from '~type/world/entities/building';

import { Actions, Action } from './styles';

type Props = {
  actions: BuildingAction[]
};

export const ComponentBuildingActions: React.FC<Props> = ({ actions }) => (
  <Actions>
    {actions.map((action) => (
      <Action key={action.label} onClick={action.onClick}>
        <Action.Label>{action.label}</Action.Label>

        {action.cost && (
          <Action.Addon>
            <ComponentCost amount={action.cost} view='small' />
          </Action.Addon>
        )}
      </Action>
    ))}
  </Actions>
);

ComponentBuildingActions.displayName = 'ComponentBuildingActions';
