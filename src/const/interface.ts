import { ResourceType, ResourceColor } from '~type/world/resources';

export const INTERFACE_TEXT_COLOR = {
  PRIMARY: '#ff9600',
  BLUE: '#0076ad',
  BLUE_LIGHT: '#a8f0ff',
  BLUE_DARK: '#18324f',
  ERROR: '#ff6d6d',
  ERROR_DARK: '#db2323',
  ACTIVE: '#a7cc43',
};

export const INTERFACE_BOX_COLOR = {
  BLUE: 0x18324f,
  INFO: 0x83a81c,
  ERROR: 0xdb2323,
  WARN: 0xff9000,
};

export const INTERFACE_FONT = {
  PIXEL: 'Retro',
  MONOSPACE: 'Monospace',
};

export const INTERFACE_PADDING = 40;

export const RESOURCE_COLOR: ResourceColor = {
  [ResourceType.BRONZE]: 0xfc9547,
  [ResourceType.SILVER]: 0xdadada,
  [ResourceType.GOLD]: 0xfdca52,
};
