import { useClick, useGame, useScene } from 'phaser-react-ui';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { Feature } from '..';
import { Environment } from '~lib/environment';
import { phrase } from '~lib/lang';
import { GameFlag, GameScene, IGame } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerSuperskill } from '~type/world/entities/player';

import { Item } from './item';
import { ItemAds } from './item-ads';
import {
  Button, Container, Label, List, Overlay,
} from './styles';

type Props = {
  features: Feature[]
  onClose: () => void
};

export const Modal: React.FC<Props> = ({ features, onClose }) => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [unlocks, setUnlocks] = useState(features);
  const [isAllowAds, setAllowAds] = useState(() => (
    Environment.GetFlag(GameFlag.ADS)
    && Object.keys(world.player.unlockedSuperskills).length < Object.keys(PlayerSuperskill).length
  ));

  const refOverlay = useRef<HTMLDivElement>(null);
  const refButton = useRef<HTMLDivElement>(null);

  const hasSuperskill = useMemo(() => (
    features.some((feature) => feature.type === 'SUPERSKILL')
  ), [features]);

  const onAdsComplete = () => {
    setAllowAds(false);
    world.player.unlockSuperskill();
  };

  const onKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  useClick(refOverlay, 'down', () => {}, []);
  useClick(refButton, 'down', onClose, [onClose]);

  useEffect(() => {
    setUnlocks(features);
  }, [features]);

  useEffect(() => {
    game.toggleAllHints(false);
    document.addEventListener('keyup', onKeyPress);

    return () => {
      game.toggleAllHints(true);
      document.removeEventListener('keyup', onKeyPress);
    };
  }, []);

  return (
    <Overlay ref={refOverlay}>
      <Container>
        <Label>{phrase('FEATURES_UNLOCKED')}</Label>
        <List>
          {unlocks.map((feature, i) => (
            <Item key={i} {...feature} />
          ))}
          {(isAllowAds && hasSuperskill) && (
            <ItemAds onComplete={onAdsComplete} />
          )}
        </List>
        <Button ref={refButton}>{phrase('CONTINUE_GAME')}</Button>
      </Container>
    </Overlay>
  );
};
