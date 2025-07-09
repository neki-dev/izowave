export type IndicatorData = {
  color: number
  size: number
  value?: () => number
  destroyIf?: (value: number) => boolean
};
