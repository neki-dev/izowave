import { ENEMY_SIZE_PARAMS, ENEMY_TEXTURE_SIZE } from '../const';
import { EnemyAudio, EnemyTexture } from '../types';

import audioRoar from './audio/roar.mp3';
import textureAdherent from './textures/adherent.png';
import textureBerserk from './textures/berserk.png';
import textureBoss from './textures/boss.png';
import textureDemon from './textures/demon.png';
import textureExplosive from './textures/explosive.png';
import textureGhost from './textures/ghost.png';
import textureRisper from './textures/risper.png';
import textureSpike from './textures/spike.png';
import textureStranger from './textures/stranger.png';
import textureTank from './textures/tank.png';
import textureTelepath from './textures/telepath.png';
import textureTermer from './textures/termer.png';
import textureUndead from './textures/undead.png';

import { Assets } from '~core/assets';

Assets.AddAudio(EnemyAudio.ROAR, audioRoar);

addSprite(EnemyTexture.ADHERENT, textureAdherent);
addSprite(EnemyTexture.DEMON, textureDemon);
addSprite(EnemyTexture.RISPER, textureRisper);
addSprite(EnemyTexture.UNDEAD, textureUndead);
addSprite(EnemyTexture.SPIKE, textureSpike);
addSprite(EnemyTexture.BERSERK, textureBerserk);
addSprite(EnemyTexture.EXPLOSIVE, textureExplosive);
addSprite(EnemyTexture.GHOST, textureGhost);
addSprite(EnemyTexture.STRANGER, textureStranger);
addSprite(EnemyTexture.TANK, textureTank);
addSprite(EnemyTexture.TELEPATH, textureTelepath);
addSprite(EnemyTexture.TERMER, textureTermer);
addSprite(EnemyTexture.BOSS, textureBoss);

function addSprite(texture: EnemyTexture, url: string) {
  Assets.AddSprite(texture, url, ENEMY_SIZE_PARAMS[ENEMY_TEXTURE_SIZE[texture]]);
}

