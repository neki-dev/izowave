import { ShaderType } from '~type/shader';

import { OutlineShader } from './outline';

export const SHADERS: Record<ShaderType, Function> = {
  [ShaderType.OUTLINE]: OutlineShader,
};
