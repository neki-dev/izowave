import type { LangPhrase } from '~core/lang/types';

export const PARAM_VALUES: {
  value: LangPhrase
  color?: string
}[] = [
  { value: 'ON' },
  { value: 'OFF', color: 'var(--color-text-error)' },
];
