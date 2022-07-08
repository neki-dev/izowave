import { ResourceType } from '~type/building';

export const INTERFACE_TEXT_COLOR_PRIMARY = '#ff9600';
export const INTERFACE_TEXT_COLOR_BLUE = '#0076ad';
export const INTERFACE_TEXT_COLOR_BLUE_DARK = '#18324f';
export const INTERFACE_TEXT_COLOR_ERROR = '#ff6d6d';
export const INTERFACE_TEXT_COLOR_ERROR_DARK = '#db2323';
export const INTERFACE_TEXT_COLOR_ACTIVE = '#a7cc43';

export const INTERFACE_BOX_COLOR_BLUE = 0x0076ad;
export const INTERFACE_BOX_COLOR_BLUE_DARK = 0x18324f;
export const INTERFACE_BOX_COLOR_INFO = 0x83a81c;
export const INTERFACE_BOX_COLOR_ERROR = 0xdb2323;
export const INTERFACE_BOX_COLOR_WARN = 0xff9000;

export const INTERFACE_FONT_PIXEL = 'Retro';
export const INTERFACE_FONT_MONOSPACE = 'Monospace';

export const INTERFACE_PADDING = 40;

export const RESOURCE_COLOR: {
  [value in ResourceType]: number
} = {
  [ResourceType.BRONZE]: 0xfc9547,
  [ResourceType.SILVER]: 0xdadada,
  [ResourceType.GOLD]: 0xfdca52,
};
