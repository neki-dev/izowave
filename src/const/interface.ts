import { ResourceType } from '~type/building';

export const INTERFACE_PRIMARY_COLOR = '#ff8930';
export const INTERFACE_ACTIVE_COLOR = '#a7cc43';
export const INTERFACE_HEADER_COLOR = '#a66cc0';
export const INTERFACE_BOX_COLOR = 0x3b1954;
export const INTERFACE_PIXEL_FONT = 'Retro';
export const INTERFACE_MONOSPACE_FONT = 'Monospace';
export const INTERFACE_PADDING = 40;

export const RESOURCE_COLOR: {
  [value in ResourceType]: number
} = {
  [ResourceType.BRONZE]: 0xfc9547,
  [ResourceType.SILVER]: 0xdadada,
  [ResourceType.GOLD]: 0xfdca52,
};
