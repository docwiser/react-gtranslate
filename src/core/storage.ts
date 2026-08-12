import { LanguageCode } from '../types';

const STORAGE_KEY = 'react_gt_language';
const AUTOSWITCH_KEY = 'react_gt_autoswitch';

export function getSavedLanguage(): LanguageCode | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    return (localStorage.getItem(STORAGE_KEY) as LanguageCode) || null;
  } catch (e) {
    return null;
  }
}

export function saveLanguagePreference(lang: LanguageCode): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    // ignore localstorage errors (e.g. incognito)
  }
}

export function clearLanguagePreference(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

export function hasAutoSwitched(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    return localStorage.getItem(AUTOSWITCH_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function setAutoSwitched(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(AUTOSWITCH_KEY, 'true');
  } catch (e) {
    // ignore
  }
}

/**
 * Detect user's preferred language from navigator.language
 */
export function detectBrowserLanguage(availableLanguages?: LanguageCode[]): LanguageCode | null {
  if (typeof window === 'undefined' || !window.navigator) return null;

  // Bot detection
  if (/bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit/i.test(navigator.userAgent)) {
    return null;
  }

  const rawLang = (navigator.language || (navigator as any).userLanguage || '').toLowerCase();
  if (!rawLang) return null;

  let mappedLang: string;
  switch (rawLang) {
    case 'zh':
    case 'zh-cn':
    case 'zh-hans':
      mappedLang = 'zh-CN';
      break;
    case 'zh-tw':
    case 'zh-hk':
    case 'zh-hant':
      mappedLang = 'zh-TW';
      break;
    case 'he':
      mappedLang = 'iw';
      break;
    default:
      mappedLang = rawLang.split('-')[0];
      break;
  }

  if (availableLanguages && availableLanguages.length > 0) {
    if (availableLanguages.includes(mappedLang as LanguageCode)) {
      return mappedLang as LanguageCode;
    }
    return null;
  }

  return mappedLang as LanguageCode;
}
