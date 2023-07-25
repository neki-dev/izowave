/**
 * Round number to specified scale.
 * @param value - Number
 * @param scale - Scale
 */
function roundToScale(value: number, scale?: number) {
  return scale ? Math.ceil(value / scale) * scale : Math.ceil(value);
}

/**
 * Function to mixed quadratic progressively increase value,
 * relative to specified level.
 * @param defaultValue - Default value for first level
 * @param scale - Part of default value for growth
 * @param level - Difficulty level
 * @param roundTo - Round value
 */
export function progressionQuadraticMixed(params: {
  defaultValue: number
  scale: number
  level: number
  roundTo?: number
}) {
  const value = params.defaultValue * params.level ** (params.scale + 1);

  return roundToScale(value, params.roundTo);
}

/**
 * Function to quadratic progressively increase value,
 * relative to specified level.
 * @param defaultValue - Default value for first level
 * @param scale - Part of default value for growth
 * @param level - Difficulty level
 * @param roundTo - Round value
 */
export function progressionQuadratic(params: {
  defaultValue: number
  scale: number
  level: number
  maxLevel?: number
  retardation?: number
  roundTo?: number
}) {
  if (params.retardation && params.level >= params.retardation) {
    return progressionQuadraticMixed(params);
  }

  const level = params.maxLevel ? Math.min(params.maxLevel, params.level) : params.level;
  const value = params.defaultValue * (params.scale + 1) ** (level - 1);

  return roundToScale(value, params.roundTo);
}

/**
 * Function to linear progressively increase value,
 * relative to specified level.
 * @param defaultValue - Default value for first level
 * @param scale - Part of default value for growth
 * @param level - Difficulty level
 * @param roundTo - Round value
 */
export function progressionLinear(params: {
  defaultValue: number
  scale: number
  level: number
  roundTo?: number
}) {
  const value = params.defaultValue + (params.defaultValue * params.scale * (params.level - 1));

  return roundToScale(value, params.roundTo);
}

/**
 * Function to linear progressively increase value,
 * relative to current value and specified level.
 * @param currentValue - Current value
 * @param defaultValue - Default value for first level
 * @param scale - Part of default value for growth
 * @param level - Difficulty level
 * @param roundTo - Round value
 */
export function progressionLinearFrom(params: {
  currentValue: number
  defaultValue: number
  scale: number
  level: number
  roundTo?: number
}) {
  const value = params.currentValue + (params.defaultValue * params.scale * (params.level - 1));

  return roundToScale(value, params.roundTo);
}
