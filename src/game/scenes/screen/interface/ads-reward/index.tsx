import { useGame, useScene } from 'phaser-react-ui';
import React, { useState, useEffect } from 'react';

import { DIFFICULTY } from '~const/world/difficulty';
import { Environment } from '~lib/environment';
import { phrase } from '~lib/lang';
import { Amount } from '~scene/system/interface/amount';
import { Button } from '~scene/system/interface/button';
import { IGame, GameScene, GameFlag } from '~type/game';
import { SDKAdsType } from '~type/sdk';
import { IWorld } from '~type/world';
import { WaveEvents } from '~type/world/wave';

import {
  Amounts, Backdrop, Buttons, Container, Text,
} from './styles';

export const AdsReward: React.FC = () => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isAdsOfferOpen, setAdsOfferOpen] = useState(false);
  const [adsReward, setAdsReward] = useState({
    experience: 0,
    resources: 0,
  });

  const onConfirmAds = () => {
    game.resume();
    game.showAds(SDKAdsType.REWARDED, () => {
      world.player.giveExperience(adsReward.experience);
      world.player.giveResources(adsReward.resources);
    });
    setAdsOfferOpen(false);
  };

  const onDeclineAds = () => {
    game.resume();
    setAdsOfferOpen(false);
  };

  const onWaveComplete = (number: number) => {
    if (number % DIFFICULTY.ADS_REWARD_FREQUENCY !== 0) {
      return;
    }

    game.pause();
    setAdsOfferOpen(true);
    setAdsReward({
      experience: DIFFICULTY.ADS_REWARD_EXPERIENCE * number,
      resources: DIFFICULTY.ADS_REWARD_RESOURCES * number,
    });
  };

  useEffect(() => {
    if (!Environment.GetFlag(GameFlag.ADS)) {
      return;
    }

    world.wave.on(WaveEvents.COMPLETE, onWaveComplete);

    return () => {
      world.wave.off(WaveEvents.COMPLETE, onWaveComplete);
    };
  }, []);

  return (
    isAdsOfferOpen && (
      <Backdrop>
        <Container>
          <Text>{phrase('ADS_OFFER')}</Text>
          <Amounts>
            <Amount type="RESOURCES">+{adsReward.resources}</Amount>
            <Amount type="EXPERIENCE">+{adsReward.experience}</Amount>
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
      </Backdrop>
    )
  );
};
