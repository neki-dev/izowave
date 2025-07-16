import {
  useGame, useScene, useSceneUpdate, useInteraction, Texture, useEvent,
} from 'phaser-react-ui';
import React, { useRef, useState } from 'react';

import imageLock from './images/lock.png';

import { phrase } from '~core/lang';
import type { Game } from '~game/index';
import { GameScene, GameEvent } from '~game/types';
import { Cost } from '~scene/system/interface/cost';
import type { WorldScene } from '~scene/world';
import type { PlayerSuperskill } from '~scene/world/entities/player/types';
import { PlayerEvent, PlayerSuperskillIcon } from '~scene/world/entities/player/types';

import {
  Container, Timeout, Lock, Info, Body, Head, Name, Description, Wrapper, IconContainer, IconLock,
} from './styles';

type Props = {
  type: PlayerSuperskill
};

export const Item: React.FC<Props> = ({ type }) => {
  const game = useGame<Game>();
  const world = useScene<WorldScene>(GameScene.WORLD);

  const [allow, setAllow] = useState(Boolean(world.player.unlockedSuperskills[type]));
  const [gamePaused, setGamePaused] = useState(false);
  const [progress, setProgress] = useState<Nullable<Phaser.Time.TimerEvent>>(null);
  const [cost, setCost] = useState(0);

  const refContainer = useRef<HTMLDivElement>(null);

  const isHover = useInteraction(refContainer, () => {
    if (allow) {
      world.player.useSuperskill(type);
    }
  }, [type, allow]);

  useEvent(world.player, PlayerEvent.UNLOCK_SUPERSKILL, (superskill: PlayerSuperskill) => {
    if (superskill === type) {
      setAllow(true);
    }
  }, []);

  useEvent(game.events, GameEvent.TOGGLE_PAUSE, (paused: boolean) => {
    setGamePaused(paused);
  }, []);

  useSceneUpdate(world, () => {
    setCost(world.player.getSuperskillCost(type));
    setProgress(world.player.activeSuperskills[type] ?? null);
  }, []);

  return (
    <Wrapper>
      {(isHover && allow) && (
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
      <Container ref={refContainer} $active={Boolean(progress)} $allow={allow}>
        {progress && (
          <Timeout
            style={{
              animationDuration: `${progress.delay}ms`,
              animationPlayState: gamePaused ? 'paused' : 'running',
            }}
          />
        )}
        {!allow && (
          <Lock>
            <IconLock src={imageLock} />
          </Lock>
        )}
        <IconContainer $allow={allow}>
          <Texture name={PlayerSuperskillIcon[type]} />
        </IconContainer>
      </Container>
    </Wrapper>
  );
};
