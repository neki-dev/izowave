import React, { useMemo } from 'react';

import { GameStat } from '~type/game';

import {
  Wrapper, Item,
} from './styles';

type Props = {
  stat: GameStat
  record: Nullable<GameStat>
};

export const Result: React.FC<Props> = ({ stat, record }) => {
  const statItems: {
    key: keyof GameStat
    label: string
    value: number | string
  }[] = useMemo(
    () => [
      { key: 'waves', label: 'WAVES COMPLETED', value: stat.waves },
      { key: 'kills', label: 'ENEMIES KILLED', value: stat.kills },
      { key: 'lived', label: 'MINUTES LIVED', value: stat.lived.toFixed(1) },
    ],
    [],
  );

  return (
      <Wrapper>
        {statItems.map((item) => (
          <Item key={item.key}>
            <Item.Value>{item.value}</Item.Value>
            <Item.Label>{item.label}</Item.Label>
            {(record?.[item.key] ?? 0) < stat[item.key] && (
              <Item.Record>RECORD</Item.Record>
            )}
          </Item>
        ))}
      </Wrapper>
  );
};
