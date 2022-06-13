import Phaser from 'phaser';

export type UIComponent<T = Object> = (props?: T) =>
Phaser.GameObjects.Container | Phaser.GameObjects.Image | Phaser.GameObjects.Text;

export enum InterfaceSprite {
  LEVEL = 'icons/level',
  RESOURCES = 'icons/resources',
}

export enum ResourcesSpriteFrames {
  BRONZE = 0,
  SILVER = 1,
  GOLD = 2,
}
