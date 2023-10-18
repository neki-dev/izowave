import {
  useGame, useScene, useSceneUpdate, useInteraction,
} from 'phaser-react-ui';
import React, { useRef, useState } from 'react';

import { DIFFICULTY } from '~const/world/difficulty';
import { phrase } from '~lib/lang';
import { Cost } from '~scene/system/interface/cost';
import { GameScene, GameState, IGame } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerSuperskill } from '~type/world/entities/player';

import {
  Container, Timeout, Info, Icon, Body, Head, Name, Description,
} from './styles';

type Props = {
  type: PlayerSuperskill
};

export const Item: React.FC<Props> = ({ type }) => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);
  const scene = useScene(GameScene.SYSTEM);

  const [isPaused, setPaused] = useState(false);
  const [isActive, setActive] = useState(false);
  const [cost, setCost] = useState(0);

  const refContainer = useRef<HTMLDivElement>(null);

  const isHover = useInteraction(refContainer, () => {
    world.player.useSuperskill(type);
  }, [type]);

  useSceneUpdate(scene, () => {
    setPaused(game.state === GameState.PAUSED);
    setActive(Boolean(world.player.activeSuperskills[type]));
    setCost(world.player.getSuperskillCost(type));
  }, []);

  return (
    <Container ref={refContainer} $active={isActive}>
      {isHover && (
        <Info>
          <Head>
            <Name>{phrase(`SUPERSKILL_NAME_${type}`)}</Name>
            <Cost type="resources" value={cost} />
          </Head>
          <Body>
            <Description>{phrase(`SUPERSKILL_DESCRIPTION_${type}`)}</Description>
          </Body>
        </Info>
      )}
      {isActive && (
        <Timeout
          style={{
            animationDuration: `${DIFFICULTY[`SUPERSKILL_${type}_DURATION`]}ms`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      )}
      <Icon src={`assets/sprites/feature/${type.toLowerCase()}.png`} />
    </Container>
  );
};
