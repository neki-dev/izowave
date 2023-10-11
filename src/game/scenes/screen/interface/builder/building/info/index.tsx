import { useMatchMedia, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { BUILDINGS } from '~const/world/entities/buildings';
import { BuildingParams } from '~scene/system/interface/building-params';
import { Cost } from '~scene/system/interface/cost';
import { Text } from '~scene/system/interface/text';
import { Builder } from '~scene/world/builder';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { BuildingVariant } from '~type/world/entities/building';

import {
  Alert, Head, Meta, Limit, Name, Wrapper, Body,
} from './styles';

type Props = {
  variant: BuildingVariant
};

export const BuilderInfo: React.FC<Props> = ({ variant }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const isSmallScreen = useMatchMedia(INTERFACE_MOBILE_BREAKPOINT);

  const [limit, setLimit] = useState<Nullable<number>>(null);
  const [existCount, setExistCount] = useState(0);
  const [isAllowByWave, setAllowByWave] = useState(false);
  const [isAllowByTutorial, setAllowByTutorial] = useState(false);

  useSceneUpdate(world, () => {
    const currentIsAllowByWave = world.builder.isBuildingAllowByWave(variant);
    const currentIsAllowByTutorial = Builder.IsBuildingAllowByTutorial(variant);
    const currentLimit = world.builder.getBuildingLimit(variant);

    setAllowByWave(currentIsAllowByWave);
    setAllowByTutorial(currentIsAllowByTutorial);
    setLimit(currentLimit);
    if (currentLimit) {
      setExistCount(world.builder.getBuildingsByVariant(variant).length);
    }
  }, []);

  return (
    isAllowByTutorial && (
      <Wrapper>
        <Head>
          <Name>{BUILDINGS[variant].Name}</Name>
          <Meta>
            <Cost type="resources" value={BUILDINGS[variant].Cost} size="large" />
            {(isSmallScreen && limit && existCount >= limit) && (
              <Limit>Limit</Limit>
            )}
          </Meta>
        </Head>
        {!isSmallScreen && (
          <Body>
          <Text>{BUILDINGS[variant].Description}</Text>
          {isAllowByWave ? (
            !!limit && (
              <Alert $attention={existCount >= limit}>
                Current limit: {existCount}/{limit}
              </Alert>
            )
          ) : (
            <Alert $attention>
              Available from <b>{BUILDINGS[variant].AllowByWave}</b> wave
            </Alert>
          )}
          <BuildingParams list={BUILDINGS[variant].Params} />
          </Body>
        )}
      </Wrapper>
    )
  );
};
