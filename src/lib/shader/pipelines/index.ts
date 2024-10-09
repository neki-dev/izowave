import { OutlineShader } from './outline';
import { ShaderType } from '../types';

export const SHADERS: Record<ShaderType, any> = {
  [ShaderType.OUTLINE]: OutlineShader,
};
