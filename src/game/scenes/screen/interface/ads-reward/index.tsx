import { useGame, useScene } from 'phaser-react-ui';
import React, { useState, useEffect, useCallback } from 'react';

import { DIFFICULTY } from '~const/world/difficulty';
import { Environment } from '~lib/environment';
import { IGame, GameScene, GameFlag } from '~type/game';
import { IWorld } from '~type/world';
import { WaveEvents } from '~type/world/wave';

import { Modal } from './modal';

export const AdsReward: React.FC = () => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isAdsOfferOpen, setAdsOfferOpen] = useState(false);
  const [adsReward, setAdsReward] = useState({
    experience: 0,
    resources: 0,
  });

  const onClose = useCallback(() => {
    setAdsOfferOpen(false);
  }, []);

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
    isAdsOfferOpen && <Modal {...adsReward} onClose={onClose} />
  );
};
