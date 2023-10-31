import {
  useGame, useScene, useSceneUpdate, useInteraction, Texture, useEvent,
} from 'phaser-react-ui';
import React, { useRef, useState } from 'react';

import { phrase } from '~lib/lang';
import { Cost } from '~scene/system/interface/cost';
import { GameEvents, GameScene, IGame } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerEvents, PlayerSuperskill, PlayerSuperskillIcon } from '~type/world/entities/player';

import {
  Container, Timeout, Lock, Info, Body, Head, Name, Description, Wrapper, IconContainer, IconLock,
} from './styles';

type Props = {
  type: PlayerSuperskill
};

export const Item: React.FC<Props> = ({ type }) => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isAllow, setAllow] = useState(Boolean(world.player.unlockedSuperskills[type]));
  const [isGamePaused, setGamePaused] = useState(false);
  const [progress, setProgress] = useState<Nullable<Phaser.Time.TimerEvent>>(null);
  const [cost, setCost] = useState(0);

  const refContainer = useRef<HTMLDivElement>(null);

  const isHover = useInteraction(refContainer, () => {
    if (isAllow) {
      world.player.useSuperskill(type);
    }
  }, [type, isAllow]);

  useEvent(world.player, PlayerEvents.UNLOCK_SUPERSKILL, (superskill: PlayerSuperskill) => {
    if (superskill === type) {
      setAllow(true);
    }
  }, []);

  useEvent(game.events, GameEvents.TOGGLE_PAUSE, (paused: boolean) => {
    setGamePaused(paused);
  }, []);

  useSceneUpdate(world, () => {
    setCost(world.player.getSuperskillCost(type));
    setProgress(world.player.activeSuperskills[type] ?? null);
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
      <Container ref={refContainer} $active={Boolean(progress)} $allow={isAllow}>
        {progress && (
          <Timeout
            style={{
              animationDuration: `${progress.delay}ms`,
              animationPlayState: isGamePaused ? 'paused' : 'running',
            }}
          />
        )}
        {!isAllow && (
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
