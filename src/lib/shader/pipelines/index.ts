import { ShaderType } from '../types';

import { OutlineShader } from './outline';

export const SHADERS: Record<ShaderType, any> = {
  [ShaderType.OUTLINE]: OutlineShader,
};
