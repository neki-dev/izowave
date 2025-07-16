import { ASSISTANT_TILE_SIZE } from '../const';
import { AssistantTexture } from '../types';

import textureDefault from './textures/default.png';
import textureFirebot from './textures/firebot.png';
import textureLaserbot from './textures/laserbot.png';

import { Assets } from '~core/assets';

Assets.AddSprite(AssistantTexture.DEFAULT, textureDefault, ASSISTANT_TILE_SIZE);
Assets.AddSprite(AssistantTexture.FIREBOT, textureFirebot, ASSISTANT_TILE_SIZE);
Assets.AddSprite(AssistantTexture.LASERBOT, textureLaserbot, ASSISTANT_TILE_SIZE);
