import React, { useMemo } from 'react';

import { GameStat } from '~type/game';

import {
  Wrapper, Item, Value, Label, Record,
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
      { key: 'score', label: 'Total score', value: stat.score },
      { key: 'waves', label: 'Waves completed', value: stat.waves },
      { key: 'kills', label: 'Enemies killed', value: stat.kills },
      { key: 'lived', label: 'Minutes lived', value: stat.lived.toFixed(1) },
    ],
    [],
  );

  return (
    <Wrapper>
      {statItems.map((item) => (
        <Item key={item.key}>
          <Value>{item.value}</Value>
          <Label>{item.label}</Label>
          {(record?.[item.key] ?? 0) < stat[item.key] && (
            <Record>RECORD</Record>
          )}
        </Item>
      ))}
    </Wrapper>
  );
};
