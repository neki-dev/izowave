import { OutlineShader } from './outline';
import { ShaderType } from '../types';

export const SHADERS: Record<ShaderType, Function> = {
  [ShaderType.OUTLINE]: OutlineShader,
};
