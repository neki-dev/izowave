import React, { useContext } from 'react';

import { GameContext } from '~lib/ui';
import { GameStat } from '~type/game';
import { MenuAudio } from '~type/menu';

import {
  Wrapper, Label, Stats, Overlay, Restart,
} from './styles';

type Props = {
  stat: GameStat
  record: Nullable<GameStat>
};

export const GameOverUI: React.FC<Props> = React.memo(({ stat, record }) => {
  const game = useContext(GameContext);

  const statItems: {
    key: keyof GameStat
    label: string
    value: number | string
  }[] = [
    { key: 'waves', label: 'WAVES COMPLETED', value: stat.waves },
    { key: 'level', label: 'LEVEL REACHED', value: stat.level },
    { key: 'kills', label: 'ENEMIES KILLED', value: stat.kills },
    { key: 'lived', label: 'MINUTES LIVED', value: stat.lived.toFixed(1) },
  ];

  const handleRestartClick = () => {
    game.sound.play(MenuAudio.CLICK);
    game.restartGame();
  };

  return (
    <Overlay>
      <Wrapper>
        <Label>GAME OVER</Label>
        <Stats>
          {statItems.map((item) => (
            <Stats.Item key={item.key}>
              <Stats.Value>{item.value}</Stats.Value>
              <Stats.Label>{item.label}</Stats.Label>
              {(record?.[item.key] ?? 0) < stat[item.key] && (
                <Stats.Record>RECORD</Stats.Record>
              )}
            </Stats.Item>
          ))}
        </Stats>
        <Restart onClick={handleRestartClick}>PLAY AGAIN</Restart>
      </Wrapper>
    </Overlay>
  );
});

GameOverUI.displayName = 'GameOverUI';
