import { useClick, useGame, useScene } from 'phaser-react-ui';
import React, { useRef, useCallback } from 'react';

import { phrase } from '~lib/lang';
import { Amount } from '~scene/system/interface/amount';
import { Button } from '~scene/system/interface/button';
import { IGame, GameScene } from '~type/game';
import { SDKAdsType } from '~type/sdk';
import { IWorld } from '~type/world';

import {
  Amounts, Overlay, Buttons, Container, Text,
} from './styles';

type Props = {
  experience: number
  resources: number
  onClose: () => void
};

export const Modal: React.FC<Props> = ({ experience, resources, onClose }) => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const refOverlay = useRef<HTMLDivElement>(null);

  const onConfirmAds = useCallback(() => {
    game.resume();
    game.showAds(SDKAdsType.REWARDED, () => {
      world.player.giveExperience(experience);
      world.player.giveResources(resources);
    });
    onClose();
  }, [onClose, experience, resources]);

  const onDeclineAds = useCallback(() => {
    game.resume();
    onClose();
  }, [onClose]);

  useClick(refOverlay, 'down', () => {}, []);

  return (
    <Overlay ref={refOverlay}>
      <Container>
        <Text>{phrase('ADS_OFFER')}</Text>
        <Amounts>
          <Amount type="RESOURCES">+{resources}</Amount>
          <Amount type="EXPERIENCE">+{experience}</Amount>
        </Amounts>
        <Buttons>
          <Button view="confirm" size="medium" onClick={onConfirmAds}>
            {phrase('YES')}
          </Button>
          <Button view="decline" size="medium" onClick={onDeclineAds}>
            {phrase('NO')}
          </Button>
        </Buttons>
      </Container>
    </Overlay>
  );
};
