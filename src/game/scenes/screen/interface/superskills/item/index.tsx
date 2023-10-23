import {
  useGame, useScene, useSceneUpdate, useInteraction, Texture, useEvent,
} from 'phaser-react-ui';
import React, { useEffect, useRef, useState } from 'react';

import { DIFFICULTY } from '~const/world/difficulty';
import { phrase } from '~lib/lang';
import { Cost } from '~scene/system/interface/cost';
import { GameScene, GameState, IGame } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerEvents, PlayerSuperskill, PlayerSuperskillIcon } from '~type/world/entities/player';

import {
  Container, Timeout, Lock, Info, Body, Head, Name, Description, Wrapper, IconContainer, IconLock, Newest,
} from './styles';

type Props = {
  type: PlayerSuperskill
};

export const Item: React.FC<Props> = ({ type }) => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);
  const scene = useScene(GameScene.SYSTEM);

  const [isAllow, setAllow] = useState(Boolean(world.player.unlockedSuperskills[type]));
  const [isNewest, setNewest] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [isActive, setActive] = useState(false);
  const [cost, setCost] = useState(0);

  const refContainer = useRef<HTMLDivElement>(null);

  const isHover = useInteraction(refContainer, () => {
    if (isAllow) {
      world.player.useSuperskill(type);
    }
  }, [type, isAllow]);

  useEffect(() => {
    if (isAllow && !world.game.usedSave) {
      setNewest(true);
    }
  }, [isAllow]);

  useEffect(() => {
    if (isHover) {
      setNewest(false);
    }
  }, [isHover]);

  useEvent(world.player, PlayerEvents.UNLOCK_SUPERSKILL, (superskill: PlayerSuperskill) => {
    if (superskill === type) {
      setAllow(true);
    }
  }, []);

  useSceneUpdate(scene, () => {
    setPaused(game.state === GameState.PAUSED);
    setCost(world.player.getSuperskillCost(type));
    setActive(Boolean(world.player.activeSuperskills[type]));
  }, []);

  return (
    <Wrapper>
      {(isHover && isAllow) && (
        <Info>
          <Head>
            <Name>{phrase(`SUPERSKILL_NAME_${type}`)}</Name>
            <Cost type="RESOURCES" value={cost} />
          </Head>
          <Body>
            <Description>{phrase(`SUPERSKILL_DESCRIPTION_${type}`)}</Description>
          </Body>
        </Info>
      )}
      <Container ref={refContainer} $active={isActive} $allow={isAllow}>
        {isActive && (
          <Timeout
            style={{
              animationDuration: `${DIFFICULTY[`SUPERSKILL_${type}_DURATION`]}ms`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        )}
        {isAllow ? (
          isNewest && (
            <Newest />
          )
        ) : (
          <Lock>
            <IconLock src='assets/sprites/hud/lock.png' />
          </Lock>
        )}
        <IconContainer $allow={isAllow}>
          <Texture name={PlayerSuperskillIcon[type]} />
        </IconContainer>
      </Container>
    </Wrapper>
  );
};
