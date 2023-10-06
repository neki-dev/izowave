import {
  useGame,
  useMobilePlatform,
  useOutsideClick,
  useScene,
  useSceneUpdate,
} from 'phaser-react-ui';
import React, { useRef, useState } from 'react';

import { PLAYER_SUPERSKILLS } from '~const/world/entities/player';
import { Cost } from '~scene/system/interface/cost';
import { Text } from '~scene/system/interface/text';
import { GameScene, GameState, IGame } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerSuperskill } from '~type/world/entities/player';

import {
  Container, Timeout, Info, Icon, Body, Head, Name,
} from './styles';

type Props = {
  type: PlayerSuperskill
};

export const SuperskillItem: React.FC<Props> = ({ type }) => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);
  const scene = useScene(GameScene.SYSTEM);

  const isMobile = useMobilePlatform();

  const [isPaused, setPaused] = useState(false);
  const [isActive, setActive] = useState(false);
  const [isSelected, setSelected] = useState(false);
  const [cost, setCost] = useState(0);

  const refContainer = useRef<HTMLDivElement>(null);

  const onClick = () => {
    if (isSelected) {
      world.player.useSuperskill(type);
    } else {
      setSelected(true);
    }
  };

  const onMouseEnter = () => {
    setSelected(true);
  };

  const onMouseLeave = () => {
    setSelected(false);
  };

  useOutsideClick(refContainer, () => {
    setSelected(false);
  }, []);

  useSceneUpdate(scene, () => {
    setPaused(game.state === GameState.PAUSED);
    setActive(Boolean(world.player.activeSuperskills[type]));
    setCost(world.player.getSuperskillCost(type));
  }, []);

  return (
    <Container
      ref={refContainer}
      {...isMobile ? {
        onTouchEnd: onClick,
      } : {
        onClick,
        onMouseEnter,
        onMouseLeave,
      }}
      $selected={isSelected}
      $active={isActive}
    >
      <Info>
        <Head>
          <Name>{type}</Name>
          <Cost type="resources" value={cost} size="small" />
        </Head>
        <Body>
          <Text>{PLAYER_SUPERSKILLS[type].description}</Text>
        </Body>
      </Info>
      {isActive && (
        <Timeout
          style={{
            animationDuration: `${PLAYER_SUPERSKILLS[type].duration}ms`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      )}
      <Icon src={`assets/sprites/feature/${type.toLowerCase()}.png`} />
    </Container>
  );
};
