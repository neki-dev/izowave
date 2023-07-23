import React from 'react';

import { SETTINGS } from '~const/game';
import { mapEntries } from '~lib/utils';

import { Param } from './param';
import { Wrapper } from './styles';

type Props = {
  disabled?: boolean
};

export const Settings: React.FC<Props> = ({ disabled }) => (
  <Wrapper>
    {mapEntries(SETTINGS, (type, data) => (
      <Param key={type} type={type} data={data} disabled={disabled} />
    ))}
  </Wrapper>
);
