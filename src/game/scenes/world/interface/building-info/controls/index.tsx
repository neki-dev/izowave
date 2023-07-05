import React, { useState } from 'react';

import { useWorldUpdate } from '~lib/interface';
import { getMutableArray } from '~lib/utils';
import { ComponentAmount } from '~scene/basic/interface/amount';
import { BuildingControl, IBuilding } from '~type/world/entities/building';

import { Wrapper, Action } from './styles';

type Props = {
  building: IBuilding
};

export const ComponentBuildingControls: React.FC<Props> = ({ building }) => {
  const [controls, setControls] = useState<BuildingControl[]>([]);

  useWorldUpdate(() => {
    setControls((current) => getMutableArray(current, building.getControls(), ['label', 'cost']));
  });

  return (
    <Wrapper>
      {controls.map((control) => (
        <Action key={control.label} onClick={control.onClick}>
          <Action.Label>{control.label}</Action.Label>

          {control.cost && (
            <Action.Addon>
              <ComponentAmount
                type="resources"
                value={control.cost}
                view="small"
              />
            </Action.Addon>
          )}
        </Action>
      ))}
    </Wrapper>
  );
};

ComponentBuildingControls.displayName = 'ComponentBuildingControls';
