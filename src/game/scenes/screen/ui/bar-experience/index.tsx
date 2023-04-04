import React, { useContext, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/ui';

import { ComponentBar } from '../bar';

export const ComponentBarExperience: React.FC = () => {
  const game = useContext(GameContext);

  const [level, setLevel] = useState(0);
  const [experience, setExperience] = useState(0);
  const [nextExperience, setNextExperience] = useState(0);

  useWorldUpdate(() => {
    setLevel(game.world.player.level);
    setExperience(game.world.player.experience);
    setNextExperience(game.world.player.getNextExperience());
  });

  return (
    <ComponentBar percent={experience / nextExperience} color='#1975c5'>
      {`${level} LVL`}
    </ComponentBar>
  );
};

ComponentBarExperience.displayName = 'ComponentBarExperience';
