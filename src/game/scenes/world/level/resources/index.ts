import { LEVEL_MAP_TILE, LEVEL_SCENERY_TILE } from '../const';
import { LevelSceneryTexture, LevelTilesetTexture } from '../types';

import textureSceneryEarth from './textures/earth/scenery.png';
import textureTilesEarth from './textures/earth/tiles.png';
import textureSceneryMars from './textures/mars/scenery.png';
import textureTilesMars from './textures/mars/tiles.png';
import textureSceneryMoon from './textures/moon/scenery.png';
import textureTilesMoon from './textures/moon/tiles.png';

import { Assets } from '~lib/assets';

Assets.AddSprite(LevelTilesetTexture.EARTH, textureTilesEarth, LEVEL_MAP_TILE);
Assets.AddSprite(LevelTilesetTexture.MARS, textureTilesMars, LEVEL_MAP_TILE);
Assets.AddSprite(LevelTilesetTexture.MOON, textureTilesMoon, LEVEL_MAP_TILE);

Assets.AddSprite(LevelSceneryTexture.EARTH, textureSceneryEarth, LEVEL_SCENERY_TILE);
Assets.AddSprite(LevelSceneryTexture.MARS, textureSceneryMars, LEVEL_SCENERY_TILE);
Assets.AddSprite(LevelSceneryTexture.MOON, textureSceneryMoon, LEVEL_SCENERY_TILE);
