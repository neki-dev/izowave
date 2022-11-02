export type AssetsSource = string | string[] | Record<string, string>;

export type AssetsSpriteParams = {
  width: number
  height: number
} | ((sprite: string) => {
  width: number
  height: number
});
