import type { LangPhrase } from '~lib/lang/types';

export const PARAM_VALUES: {
  value: LangPhrase
  color?: string
}[] = [
  { value: 'ON' },
  { value: 'OFF', color: 'var(--color-text-error)' },
];
