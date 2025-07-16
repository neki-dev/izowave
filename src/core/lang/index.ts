import { LANGS } from '../../langs';

import type { Lang, LangPhrase } from './types';

function getLang() {
  try {
    let value = (
      new URLSearchParams(window.location.search).get('lang')
      || Intl.DateTimeFormat().resolvedOptions().locale
      || navigator.language.split('-')[0]
    );

    value = value?.toUpperCase();

    return (value && value in LANGS)
      ? LANGS[value as Lang]
      : LANGS.EN;
  } catch {
    return LANGS.EN;
  }
}

const LANG = getLang();

/**
 * Get text by phrase key.
 * @param key - Phrase key
 * @param format - Values for format
 */
export function phrase(key: LangPhrase, format?: any[]) {
  let text = LANG[key];
  if (!text) {
    return key;
  }

  if (format) {
    text = text.replace(/%\d+/g, (match) => format[Number(match.slice(1)) - 1]);
  }

  return text;
}
