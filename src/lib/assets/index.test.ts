import assets from './__mocks__/assets';

import { Assets } from '.';

describe('lib / assets', () => {
  beforeAll(() => {
    Assets.RegisterAudio(assets.audio);
    Assets.RegisterImages(assets.images);
    Assets.RegisterSprites(assets.sprites, {
      width: 10,
      height: 10,
    });
  });

  it('should register audio', () => {
    const audio = Assets.Files.filter((file) => (file.type === 'audio'));

    expect(audio.length).toBe(Object.values(assets.audio).length);
    expect(audio[0].key).toBe(Object.values(assets.audio)[0]);
  });

  it('should register images', () => {
    const images = Assets.Files.filter((file) => (file.type === 'image'));

    expect(images.length).toBe(Object.values(assets.images).length);
    expect(images[0].key).toBe(Object.values(assets.images)[0]);
  });

  it('should register sprites', () => {
    const sprites = Assets.Files.filter((file) => (file.type === 'spritesheet'));

    expect(sprites.length).toBe(Object.values(assets.sprites).length);
    expect(sprites[0].key).toBe(Object.values(assets.sprites)[0]);
  });
});
