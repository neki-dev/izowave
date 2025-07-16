import { Assets } from '.';

describe('lib / assets', () => {
  it('should add audio', () => {
    Assets.AddAudio('key', 'path');

    const audio = Assets.Files.filter((file) => (file.type === 'audio'));

    expect(audio.length).toBe(1);
    expect(audio[0].key).toBe('key');
  });

  it('should add images', () => {
    Assets.AddImage('key', 'path');

    const images = Assets.Files.filter((file) => (file.type === 'image'));

    expect(images.length).toBe(1);
    expect(images[0].key).toBe('key');
  });

  it('should add sprites', () => {
    Assets.AddSprite('key', 'path', { width: 1, height: 1 });

    const sprites = Assets.Files.filter((file) => (file.type === 'spritesheet'));

    expect(sprites.length).toBe(1);
    expect(sprites[0].key).toBe('key');
  });
});
