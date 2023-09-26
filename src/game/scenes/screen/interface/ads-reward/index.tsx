import { useGame, useScene } from 'phaser-react-ui';
import React, { useState, useEffect } from 'react';

import { DIFFICULTY } from '~const/world/difficulty';
import { progressionLinear } from '~lib/difficulty';
import { Amount } from '~scene/system/interface/amount';
import { Modal } from '~scene/system/interface/modal';
import {
  IGame, GameScene, GameAdType, GameFlag,
} from '~type/game';
import { IWorld } from '~type/world';
import { WaveEvents } from '~type/world/wave';

import { Amounts } from './styles';

export const AdsReward: React.FC = () => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isAdsOfferOpen, setAdsOfferOpen] = useState(false);
  const [adsReward, setAdsReward] = useState({
    experience: 0,
    resources: 0,
  });

  const onConfirmAds = () => {
    game.showAdv(GameAdType.REWARDED, () => {
      world.player.giveExperience(adsReward.experience);
      world.player.giveResources(adsReward.resources);
    });
    setAdsOfferOpen(false);
  };

  const onDeclineAds = () => {
    setAdsOfferOpen(false);
  };

  const onWaveComplete = (number: number) => {
    if (number % DIFFICULTY.ADS_REWARD_FREQUENCY === 0) {
      const experience = progressionLinear({
        defaultValue: DIFFICULTY.ADS_REWARD_EXPERIENCE,
        scale: DIFFICULTY.ADS_REWARD_GROWTH,
        level: number,
      });
      const resources = progressionLinear({
        defaultValue: DIFFICULTY.ADS_REWARD_RESOURCES,
        scale: DIFFICULTY.ADS_REWARD_GROWTH,
        level: number,
      });

      setAdsOfferOpen(true);
      setAdsReward({ experience, resources });
    }
  };

  useEffect(() => {
    if (!game.isFlagEnabled(GameFlag.ADS)) {
      return;
    }

    world.wave.on(WaveEvents.START, onDeclineAds);
    world.wave.on(WaveEvents.COMPLETE, onWaveComplete);

    return () => {
      world.wave.off(WaveEvents.START, onDeclineAds);
      world.wave.off(WaveEvents.COMPLETE, onWaveComplete);
    };
  }, []);

  return (
    isAdsOfferOpen && (
      <Modal onConfirm={onConfirmAds} onClose={onDeclineAds}>
        Do you want to get reward
        <br />
        by watching ads?
        <Amounts>
          <Amount type="resources">+{adsReward.resources}</Amount>
          <Amount type="experience">+{adsReward.experience}</Amount>
        </Amounts>
      </Modal>
    )
  );
};
