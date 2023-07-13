export type AssetsSource<T = string> = T | Record<string, T>;

export type AssetsSpriteSize = {
  width: number
  height: number
};

export type AssetsSpriteParams<T = string> =
  | AssetsSpriteSize
  | ((sprite: T) => AssetsSpriteSize);
