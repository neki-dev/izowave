import { InterfaceTextColor } from '~lib/interface/types';
import type { LangPhrase } from '~lib/lang/types';

export const PARAM_VALUES: {
  value: LangPhrase
  color?: InterfaceTextColor
}[] = [
  { value: 'ON' },
  { value: 'OFF', color: InterfaceTextColor.ERROR },
];
