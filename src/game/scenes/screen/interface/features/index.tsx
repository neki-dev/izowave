import React, { useMemo } from 'react';

import { WorldFeature } from '~type/world';

import { FeatureItem } from './item';
import { Wrapper } from './styles';

export const Features: React.FC = () => {
  const features = useMemo(
    () => Object.keys(WorldFeature) as WorldFeature[],
    [],
  );

  return (
    <Wrapper>
      {features.map((feature) => (
        <FeatureItem key={feature} type={feature} />
      ))}
    </Wrapper>
  );
};
