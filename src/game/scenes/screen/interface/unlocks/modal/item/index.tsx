import { Texture } from 'phaser-react-ui';
import React, { useMemo } from 'react';

import type { Feature } from '../..';

import { phrase } from '~core/lang';
import type { LangPhrase } from '~core/lang/types';
import type { BuildingVariant } from '~scene/world/entities/building/types';
import { BuildingTexture } from '~scene/world/entities/building/types';
import type { AssistantVariant } from '~scene/world/entities/npc/assistant/types';
import { AssistantTexture } from '~scene/world/entities/npc/assistant/types';
import type { PlayerSuperskill } from '~scene/world/entities/player/types';
import { PlayerSuperskillIcon } from '~scene/world/entities/player/types';

import {
  Container, IconContainer, Name, Type, Body, Description, Info,
} from './styles';

// TODO: Refactoring
export const Item: React.FC<Feature> = ({ type, item }) => {
  const name = useMemo(() => {
    switch (type) {
      case 'BUILDING': return phrase(`BUILDING_NAME_${item as BuildingVariant}`);
      case 'SUPERSKILL': return phrase(`SUPERSKILL_NAME_${item as PlayerSuperskill}`);
      case 'ASSISTANT': return item;
    }
  }, [type, item]);

  const description = useMemo<LangPhrase>(() => {
    switch (type) {
      case 'BUILDING': return `BUILDING_DESCRIPTION_${item as BuildingVariant}`;
      case 'SUPERSKILL': return `SUPERSKILL_DESCRIPTION_${item as PlayerSuperskill}`;
      case 'ASSISTANT': return 'ASSISTANT_UNLOCK';
    }
  }, [type, item]);

  const icon = useMemo(() => {
    switch (type) {
      case 'BUILDING': return BuildingTexture[item as BuildingVariant];
      case 'SUPERSKILL': return PlayerSuperskillIcon[item as PlayerSuperskill];
      case 'ASSISTANT': return AssistantTexture[item as AssistantVariant];
    }
  }, [type, item]);

  return (
    <Container>
      <Body>
        <IconContainer $type={type}>
          <Texture name={icon} />
        </IconContainer>
      </Body>
      <Info>
        <Type>{phrase(type)}</Type>
        <Name>{name}</Name>
        <Description>{phrase(description)}</Description>
      </Info>
    </Container>
  );
};
