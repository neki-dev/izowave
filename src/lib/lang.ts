import { LANGS } from '~const/langs';
import { LangPhrase, Lang } from '~type/lang';

function getLang() {
  const query = new URLSearchParams(window.location.search);
  const value = query.get('lang')?.toUpperCase()
    ?? (navigator.language ?? navigator.languages?.[0])?.split('-')?.[0]?.toUpperCase();

  return (value && value in LANGS)
    ? LANGS[value as Lang]
    : LANGS.EN;
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
