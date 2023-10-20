import Phaser from 'phaser';

import pkg from '../../package.json';
import { AssetsSource, AssetsSpriteParams } from '~type/assets';

export class Assets {
  static Files: Phaser.Types.Loader.FileConfig[] = [];

  static RegisterAudio(files: AssetsSource) {
    this.Files = this.Files.concat(
      this.Normalize(files).map((file) => ({
        key: file,
        type: 'audio',
        url: `assets/audio/${file}.mp3?v=${pkg.version}`,
      })),
    );
  }

  static RegisterImages(files: AssetsSource) {
    this.Files = this.Files.concat(
      this.Normalize(files).map((file) => ({
        key: file,
        type: 'image',
        url: `assets/sprites/${file}.png?v=${pkg.version}`,
      })),
    );
  }

  static RegisterSprites<T extends string>(files: AssetsSource<T>, params: AssetsSpriteParams<T>) {
    this.Files = this.Files.concat(
      this.Normalize(files).map((file) => {
        const {
          width, height, margin, spacing,
        } = (typeof params === 'function') ? params(file) : params;

        return {
          key: file,
          type: 'spritesheet',
          url: `assets/sprites/${file}.png?v=${pkg.version}`,
          frameConfig: {
            frameWidth: width,
            frameHeight: height,
            margin,
            spacing,
          },
        };
      }),
    );
  }

  static async ImportFontFace(name: string, file: string) {
    const font = new FontFace(name, `url('assets/fonts/${file}')`);

    await font.load();
    document.fonts.add(font);

    return font;
  }

  static Clear() {
    this.Files = [];
  }

  private static Normalize<T extends string>(files: AssetsSource<T>) {
    if (typeof files === 'string') {
      return [files];
    }

    return Object.values(files);
  }
}
