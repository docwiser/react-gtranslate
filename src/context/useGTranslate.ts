import { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { GTranslateContext } from './GTranslateContext';
import { GTranslateContextValue, LanguageCode, LanguageMeta } from '../types';
import { DEFAULT_LANGUAGES, getLanguageMeta } from '../constants/languages';
import { executeTranslation, loadGoogleTranslateScript } from '../core/engine';
import { getGoogleTransLang } from '../core/cookies';
import { getSavedLanguage, saveLanguagePreference } from '../core/storage';

/**
 * Headless Hook to access GTranslate translation state and actions.
 * Works inside `<GTranslateProvider>` or standalone with default configuration.
 */
export function useGTranslate(): GTranslateContextValue {
  const context = useContext(GTranslateContext);

  // Standalone fallback state if used outside GTranslateProvider
  const [standaloneLang, setStandaloneLang] = useState<LanguageCode>('en');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (context || typeof window === 'undefined') return;

    const cookieLang = getGoogleTransLang();
    const saved = getSavedLanguage();
    const initial = (cookieLang || saved || 'en') as LanguageCode;
    setStandaloneLang(initial);

    loadGoogleTranslateScript('en', () => {
      setIsLoaded(true);
      if (initial !== 'en') {
        executeTranslation('en', initial, true);
      }
    }).then(() => {
      setIsLoaded(true);
      if (initial !== 'en') {
        executeTranslation('en', initial, true);
      }
    });
  }, [context]);

  const standaloneSetLanguage = useCallback(
    async (lang: LanguageCode) => {
      setIsLoading(true);
      try {
        await loadGoogleTranslateScript('en');
        const success = await executeTranslation('en', lang, true);
        setStandaloneLang(lang);
        saveLanguagePreference(lang);
      } catch (e) {
        console.error('[react-gtranslate] Standalone translation error:', e);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const standaloneReset = useCallback(() => {
    standaloneSetLanguage('en');
  }, [standaloneSetLanguage]);

  const fallbackValue: GTranslateContextValue = useMemo(() => {
    const list = DEFAULT_LANGUAGES;
    return {
      defaultLanguage: 'en',
      languages: list,
      availableLanguages: list.map(getLanguageMeta),
      currentLanguage: standaloneLang,
      currentLanguageMeta: getLanguageMeta(standaloneLang),
      nativeNames: true,
      rememberPreferences: true,
      detectBrowserLanguage: false,
      isLoaded,
      isLoading,
      setLanguage: standaloneSetLanguage,
      resetLanguage: standaloneReset,
    };
  }, [standaloneLang, isLoaded, isLoading, standaloneSetLanguage, standaloneReset]);

  return context || fallbackValue;
}
