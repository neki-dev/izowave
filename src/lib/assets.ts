import Phaser from 'phaser';

const ASSETS_PACK = {
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

export async function loadFontFace(name: string, file?: string): Promise<void> {
  const font = new FontFace(name, `url(assets/interface/fonts/${file || name}.ttf)`);
  const e = await font.load();
  document.fonts.add(e);
}
