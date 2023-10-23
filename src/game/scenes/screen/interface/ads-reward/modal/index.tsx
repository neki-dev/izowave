import { useClick, useGame, useScene } from 'phaser-react-ui';
import React, { useRef } from 'react';

import { phrase } from '~lib/lang';
import { SDK } from '~lib/sdk';
import { IGame, GameScene } from '~type/game';
import { SDKAdsType } from '~type/sdk';
import { IWorld } from '~type/world';

import {
  Container, Label, Amounts, Amount, IconPlay, Content, Close, Group,
} from './styles';

type Props = {
  experience: number
  resources: number
  onClose: () => void
};

export const Modal: React.FC<Props> = ({ experience, resources, onClose }) => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const refContent = useRef<HTMLDivElement>(null);

  useClick(refContent, 'down', () => {
    onClose();
    SDK.ShowAds(SDKAdsType.REWARDED, {
      onStart: () => {
        game.pause();
        SDK.TogglePlayState(false);
      },
      onFinish: () => {
        game.resume();
        SDK.TogglePlayState(true);
      },
      onReward: () => {
        world.player.giveExperience(experience);
        world.player.giveResources(resources);
      },
    });
  }, [onClose, experience, resources]);

  return (
    <Container>
      <Content ref={refContent}>
        <IconPlay src="assets/sprites/hud/ads.png" />
        <Group>
          <Label>
            {phrase('ADS_SHOW')}
          </Label>
          <Amounts>
            <Amount>
              <Amount.Icon src="assets/sprites/hud/resources.png" />
              <Amount.Value>{resources}</Amount.Value>
            </Amount>
            <Amount>
              <Amount.Icon src="assets/sprites/hud/experience.png" />
              <Amount.Value>{experience}</Amount.Value>
            </Amount>
          </Amounts>
        </Group>
      </Content>
      <Close onClick={onClose}>X</Close>
    </Container>
  );
};
