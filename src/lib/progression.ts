/**
 * Round number to specified scale.
 * @param value - Number
 * @param scale - Scale
 */
function roundToScale(value: number, scale?: number) {
  return scale ? Math.floor(value / scale) * scale : Math.floor(value);
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
 * Function to linear progressively increase value,
 * relative to specified level.
 * @param defaultValue - Default value for first level
 * @param scale - Part of default value for growth
 * @param level - Difficulty level
 * @param maxLevel - Max growth level
 * @param roundTo - Round value
 */
export function progressionLinear(params: {
  defaultValue: number
  scale: number
  level: number
  maxLevel?: number
  roundTo?: number
}) {
  const level = params.maxLevel ? Math.min(params.maxLevel, params.level) : params.level;
  const value = params.defaultValue + (params.defaultValue * params.scale * (level - 1));

  return roundToScale(value, params.roundTo);
}

/**
 * Function to quadratic progressively increase value,
 * relative to specified level.
 * @param defaultValue - Default value for first level
 * @param scale - Part of default value for growth
 * @param level - Difficulty level
 * @param maxLevel - Max growth level
 * @param retardation - Retardation growth level
 * @param roundTo - Round value
 */
export function progressionQuadratic(params: {
  defaultValue: number
  scale: number
  level: number
  maxLevel?: number
  retardationLevel?: number
  roundTo?: number
}): number {
  if (params.retardationLevel && params.level > params.retardationLevel) {
    const point = progressionQuadratic({
      ...params,
      level: params.retardationLevel,
      retardationLevel: undefined,
    });

    return progressionLinear({
      ...params,
      defaultValue: point,
      level: params.level - params.retardationLevel + 1,
    });
  }

  const level = params.maxLevel ? Math.min(params.maxLevel, params.level) : params.level;
  const value = params.defaultValue * (params.scale + 1) ** (level - 1);

  return roundToScale(value, params.roundTo);
}
