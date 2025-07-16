import React, { useMemo } from 'react';

import { phrase } from '~core/lang';
import type { LangPhrase } from '~core/lang/types';
import type { GameStat } from '~game/types';

import { Wrapper, Item, Value, Label, Record } from './styles';

type Props = {
  stat: GameStat
  record: Nullable<GameStat>
};

export const Result: React.FC<Props> = ({ stat, record }) => {
  const statItems: {
    key: keyof GameStat
    label: LangPhrase
    value: number | string
  }[] = useMemo(() => [
    { key: 'score', label: 'TOTAL_SCORE', value: stat.score },
    { key: 'waves', label: 'WAVES_COMPLETED', value: stat.waves },
    { key: 'kills', label: 'ENEMIES_KILLED', value: stat.kills },
    { key: 'lived', label: 'MINUTES_LIVED', value: Math.floor(stat.lived) },
  ], []);

  return (
    <Wrapper>
      {statItems.map((item) => (
        <Item key={item.key}>
          <Value>{item.value}</Value>
          <Label>{phrase(item.label)}</Label>
          {(record?.[item.key] ?? 0) < stat[item.key] && (
            <Record>{phrase('RECORD')}</Record>
          )}
        </Item>
      ))}
    </Wrapper>
  );
};
