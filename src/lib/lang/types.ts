import type { LANGS } from '../../langs';

export type Lang = keyof typeof LANGS;

export type LangPhrase = keyof typeof LANGS.EN;
