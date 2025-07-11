import { PLAYER_TILE_SIZE } from '../const';
import { PlayerAudio, PlayerSkillIcon, PlayerSuperskillIcon, PlayerTexture } from '../types';

import audioDamage1 from './audio/damage_1.mp3';
import audioDamage2 from './audio/damage_2.mp3';
import audioDamage3 from './audio/damage_3.mp3';
import audioDead from './audio/dead.mp3';
import audioSuperskill from './audio/superskill.mp3';
import audioUpgrade from './audio/upgrade.mp3';
import audioWalk from './audio/walk.mp3';
import iconSkillAttackDamage from './icons/skills/attack_damage.png';
import iconSkillAttackDistance from './icons/skills/attack_distance.png';
import iconSkillAttackSpeed from './icons/skills/attack_speed.png';
import iconSkillBuildSpeed from './icons/skills/build_speed.png';
import iconSkillMaxHealth from './icons/skills/max_health.png';
import iconSkillSpeed from './icons/skills/speed.png';
import iconSkillStamina from './icons/skills/stamina.png';
import iconSuperskillFire from './icons/superskills/fire.png';
import iconSuperskillFrost from './icons/superskills/frost.png';
import iconSuperskillInvisible from './icons/superskills/invisible.png';
import iconSuperskillRage from './icons/superskills/rage.png';
import iconSuperskillShield from './icons/superskills/shield.png';
import texturePlayer from './textures/player.png';
import textureSuperskill from './textures/superskill.png';

import { Assets } from '~lib/assets';

Assets.AddAudio(PlayerAudio.DAMAGE_1, audioDamage1);
Assets.AddAudio(PlayerAudio.DAMAGE_2, audioDamage2);
Assets.AddAudio(PlayerAudio.DAMAGE_3, audioDamage3);
Assets.AddAudio(PlayerAudio.DEAD, audioDead);
Assets.AddAudio(PlayerAudio.SUPERSKILL, audioSuperskill);
Assets.AddAudio(PlayerAudio.UPGRADE, audioUpgrade);
Assets.AddAudio(PlayerAudio.WALK, audioWalk);

Assets.AddImage(PlayerTexture.SUPERSKILL, textureSuperskill);
Assets.AddImage(PlayerSkillIcon.ATTACK_DAMAGE, iconSkillAttackDamage);
Assets.AddImage(PlayerSkillIcon.ATTACK_DISTANCE, iconSkillAttackDistance);
Assets.AddImage(PlayerSkillIcon.ATTACK_SPEED, iconSkillAttackSpeed);
Assets.AddImage(PlayerSkillIcon.BUILD_SPEED, iconSkillBuildSpeed);
Assets.AddImage(PlayerSkillIcon.MAX_HEALTH, iconSkillMaxHealth);
Assets.AddImage(PlayerSkillIcon.SPEED, iconSkillSpeed);
Assets.AddImage(PlayerSkillIcon.STAMINA, iconSkillStamina);
Assets.AddImage(PlayerSuperskillIcon.FIRE, iconSuperskillFire);
Assets.AddImage(PlayerSuperskillIcon.FROST, iconSuperskillFrost);
Assets.AddImage(PlayerSuperskillIcon.INVISIBLE, iconSuperskillInvisible);
Assets.AddImage(PlayerSuperskillIcon.RAGE, iconSuperskillRage);
Assets.AddImage(PlayerSuperskillIcon.SHIELD, iconSuperskillShield);

Assets.AddSprite(PlayerTexture.PLAYER, texturePlayer, PLAYER_TILE_SIZE);
