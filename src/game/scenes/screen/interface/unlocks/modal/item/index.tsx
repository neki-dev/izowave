import { Texture } from 'phaser-react-ui';
import React from 'react';

import { Feature } from '../..';
import { phrase } from '~lib/lang';
import { LangPhrase } from '~type/lang';
import { BuildingTexture, BuildingVariant } from '~type/world/entities/building';
import { PlayerSuperskill, PlayerSuperskillIcon } from '~type/world/entities/player';

import {
  Container, IconContainer, Name, Type, Body, Description, Info,
} from './styles';

export const Item: React.FC<Feature> = ({ type, item }) => {
  const name = (type === 'BUILDING'
    ? `BUILDING_NAME_${item}`
    : `SUPERSKILL_NAME_${item}`
  ) as LangPhrase;

  const description = (type === 'BUILDING'
    ? `BUILDING_DESCRIPTION_${item}`
    : `SUPERSKILL_DESCRIPTION_${item}`
  ) as LangPhrase;

  const icon = type === 'BUILDING'
    ? BuildingTexture[item as BuildingVariant]
    : PlayerSuperskillIcon[item as PlayerSuperskill];

  return (
    <Container>
      <Body>
        <IconContainer $type={type}>
          <Texture name={icon} />
        </IconContainer>
      </Body>
      <Info>
        <Type>{phrase(type)}</Type>
        <Name>{phrase(name)}</Name>
        <Description>{phrase(description)}</Description>
      </Info>
    </Container>
  );
};
