import {
  getAssetsPack, registerAudioAssets, registerImageAssets, registerSpriteAssets,
} from '~lib/assets';

import assets from '../__mocks__/assets';

describe('assets.ts', () => {
  beforeAll(() => {
    registerAudioAssets(assets.audio);
    registerImageAssets(assets.images);
    registerSpriteAssets(assets.sprites, {
      width: 10,
      height: 10,
    });
  });

  it('should register audio', () => {
    const { files } = getAssetsPack();
    const audio = files.filter((file) => (file.type === 'audio'));

    expect(audio.length).toBe(Object.values(assets.audio).length);
    expect(audio[0].key).toBe(Object.values(assets.audio)[0]);
  });

  it('should register images', () => {
    const { files } = getAssetsPack();
    const images = files.filter((file) => (file.type === 'image'));

    expect(images.length).toBe(Object.values(assets.images).length);
    expect(images[0].key).toBe(Object.values(assets.images)[0]);
  });

  it('should register sprites', () => {
    const { files } = getAssetsPack();
    const sprites = files.filter((file) => (file.type === 'spritesheet'));

    expect(sprites.length).toBe(Object.values(assets.sprites).length);
    expect(sprites[0].key).toBe(Object.values(assets.sprites)[0]);
  });
});
