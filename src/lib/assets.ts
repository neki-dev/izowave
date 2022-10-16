import Phaser from 'phaser';

const ASSETS_PACK: {
  files: Phaser.Types.Loader.FileConfig[]
} = {
  files: [],
};

export function registerAssets(
  items: Phaser.Types.Loader.FileConfig | Phaser.Types.Loader.FileConfig[],
) {
  if (Array.isArray(items)) {
    ASSETS_PACK.files = ASSETS_PACK.files.concat(items);
  } else {
    ASSETS_PACK.files.push(items);
  }
}

export function getAssetsPack() {
  return ASSETS_PACK;
}

export async function loadFontFace(name: string, file?: string): Promise<FontFace> {
  const font = new FontFace(name, `url('assets/fonts/${file || name}.ttf')`);

  return font.load().then(() => {
    document.fonts.add(font);

    return font;
  });
}
