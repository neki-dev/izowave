import assets from '../__mocks__/assets';
import { registerAssets, getAssetsPack } from '../assets';

describe('assets.ts', () => {
  beforeAll(() => {
    registerAssets(assets);
  });

  it('should return registered assets', () => {
    expect(getAssetsPack().files.length).toEqual(1);
    expect(getAssetsPack().files[0].key).toEqual(assets[0].key);
  });
});
