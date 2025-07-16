import type Phaser from 'phaser';

import type { AssetsSpriteConfig } from './types';

export class Assets {
  public static Files: Phaser.Types.Loader.FileConfig[] = [];

  public static AddAudio(key: string, url: string) {
    this.Files.push({
      key,
      type: 'audio',
      url,
    });
  }

  public static AddImage(key: string, url: string) {
    this.Files.push({
      key,
      type: 'image',
      url,
    });
  }

  public static AddSprite(key: string, url: string, { width, height, margin, spacing }: AssetsSpriteConfig) {
    this.Files.push({
      key,
      type: 'spritesheet',
      url,
      frameConfig: {
        frameWidth: width,
        frameHeight: height,
        margin,
        spacing,
      },
    });
  }

  public static async ImportFontFace(name: string, file: string) {
    const font = new FontFace(name, `url('assets/fonts/${file}')`);

    await font.load();
    document.fonts.add(font);

    return font;
  }

  public static Clear() {
    this.Files = [];
  }
}
