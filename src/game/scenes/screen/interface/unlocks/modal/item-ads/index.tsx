import { useClick } from 'phaser-react-ui';
import React, { useRef } from 'react';

import { phrase } from '~lib/lang';
import { SDK } from '~lib/sdk';
import { SDKAdsType } from '~type/sdk';

import {
  Container, IconPlay, Text, Body, IconAdd,
} from './styles';

type Props = {
  onComplete: () => void
};

export const ItemAds: React.FC<Props> = ({ onComplete }) => {
  const refContainer = useRef<HTMLDivElement>(null);

  useClick(refContainer, 'down', () => {
    SDK.ShowAds(SDKAdsType.REWARDED, {
      onReward: () => {
        onComplete();
      },
    });
  }, []);

  return (
    <Container ref={refContainer}>
      <Body>
        <IconAdd src="assets/sprites/hud/add.png" />
      </Body>
      <Text>
        <IconPlay src="assets/sprites/hud/ads.png" />
        {phrase('ADS_UNLOCK')}
      </Text>
    </Container>
  );
};
