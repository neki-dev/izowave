import { useCurrentScene, useGame } from 'phaser-react-ui';
import React, { useMemo, useState } from 'react';

import { Param } from './param';
import { Record } from './record';

import { phrase } from '~core/lang';
import type { Game } from '~game/index';
import type { MenuScene } from '~game/scenes/menu';
import { GameDifficulty } from '~game/types';
import { Button } from '~scene/system/interface/button';
import { LevelPlanet } from '~scene/world/level/types';

import { Wrapper, Params } from './styles';

export const NewGame: React.FC = () => {
  const game = useGame<Game>();
  const scene = useCurrentScene<MenuScene>();

  const [planet, setPlanet] = useState(game.planet);
  const [difficulty, setDifficulty] = useState(game.difficulty);

  const score = useMemo(() => (
    game.getRecordStat(`BEST_STAT.${planet}.${difficulty}`)?.score ?? 0
  ), [planet, difficulty]);

  const planets = useMemo(() => (
    Object.keys(LevelPlanet) as LevelPlanet[]
  ), []);
  const difficulties = useMemo(() => (
    Object.keys(GameDifficulty) as GameDifficulty[]
  ), []);

  const onChangePlanet = (planet: LevelPlanet) => {
    setPlanet(planet);
    scene.scene.restart({ planet });
    game.planet = planet;
  };

  const onChangeDifficulty = (difficulty: GameDifficulty) => {
    setDifficulty(difficulty);
    game.difficulty = difficulty;
  };

  const onClickStart = () => {
    game.startNewGame();
  };

  return (
    <Wrapper>
      <Params>
        <Param
          label="PLANET"
          values={planets}
          defaultValue={planet}
          onChange={onChangePlanet}
        />
        <Param
          label="DIFFICULTY"
          values={difficulties}
          defaultValue={game.difficulty}
          onChange={onChangeDifficulty}
        />
      </Params>
      <Record value={score} />
      <Button onClick={onClickStart} view='primary' size="large">
        {phrase('START')}
      </Button>
    </Wrapper>
  );
};
