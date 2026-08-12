import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import {
  GTranslateConfig,
  GTranslateContextValue,
  LanguageCode,
  LanguageMeta,
} from '../types';
import { DEFAULT_LANGUAGES, getLanguageMeta } from '../constants/languages';
import { getGoogleTransLang } from '../core/cookies';
import {
  detectBrowserLanguage,
  getSavedLanguage,
  hasAutoSwitched,
  saveLanguagePreference,
  setAutoSwitched,
} from '../core/storage';
import { executeTranslation, loadGoogleTranslateScript } from '../core/engine';

export const GTranslateContext = createContext<GTranslateContextValue | null>(null);

export interface GTranslateProviderProps extends GTranslateConfig {
  children: ReactNode;
}

export const GTranslateProvider: React.FC<GTranslateProviderProps> = ({
  children,
  defaultLanguage = 'en',
  languages = DEFAULT_LANGUAGES,
  nativeNames = true,
  rememberPreferences = true,
  detectBrowserLanguage: autoDetect = false,
  customFlagUrl,
  labelFormat,
  onLanguageChange,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(defaultLanguage);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initializedRef = useRef<boolean>(false);

  // Compute available languages list
  const availableLanguages = useMemo(() => {
    const list = languages && languages.length > 0 ? languages : DEFAULT_LANGUAGES;
    return list.map((code) => getLanguageMeta(code));
  }, [languages]);

  const currentLanguageMeta = useMemo(() => {
    return getLanguageMeta(currentLanguage);
  }, [currentLanguage]);

  // Set Language Action
  const setLanguage = useCallback(
    async (lang: LanguageCode) => {
      setIsLoading(true);

      try {
        await loadGoogleTranslateScript(defaultLanguage);
        const success = await executeTranslation(
          defaultLanguage,
          lang,
          rememberPreferences
        );

        setCurrentLanguage(lang);
        const meta = getLanguageMeta(lang);
        onLanguageChange?.(lang, meta);
      } catch (err) {
        console.error('[react-gtranslate] Translation failed:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [defaultLanguage, onLanguageChange, rememberPreferences]
  );

  // Reset Language Action
  const resetLanguage = useCallback(() => {
    setLanguage(defaultLanguage);
  }, [defaultLanguage, setLanguage]);

  // Initial mount: load preferences & check cookies
  useEffect(() => {
    if (initializedRef.current || typeof window === 'undefined') return;
    initializedRef.current = true;

    let initialLang: LanguageCode = defaultLanguage;

    if (rememberPreferences) {
      const cookieLang = getGoogleTransLang();
      const savedLang = getSavedLanguage();
      if (cookieLang && (languages.includes(cookieLang as LanguageCode) || !languages.length)) {
        initialLang = cookieLang as LanguageCode;
      } else if (savedLang && (languages.includes(savedLang) || !languages.length)) {
        initialLang = savedLang;
      }
    }

    if (autoDetect && !hasAutoSwitched() && initialLang === defaultLanguage) {
      const detected = detectBrowserLanguage(languages);
      if (detected && detected !== defaultLanguage) {
        initialLang = detected;
        setAutoSwitched();
      }
    }

    setCurrentLanguage(initialLang);

    loadGoogleTranslateScript(defaultLanguage, () => {
      setIsLoaded(true);
      if (initialLang !== defaultLanguage) {
        executeTranslation(defaultLanguage, initialLang, rememberPreferences);
      }
    }).then(() => {
      setIsLoaded(true);
      if (initialLang !== defaultLanguage) {
        executeTranslation(defaultLanguage, initialLang, rememberPreferences);
      }
    });
  }, [autoDetect, defaultLanguage, languages, rememberPreferences]);

  const value: GTranslateContextValue = useMemo(
    () => ({
      defaultLanguage,
      languages: languages && languages.length > 0 ? languages : DEFAULT_LANGUAGES,
      availableLanguages,
      currentLanguage,
      currentLanguageMeta,
      nativeNames,
      rememberPreferences,
      detectBrowserLanguage: autoDetect,
      isLoaded,
      isLoading,
      labelFormat,
      setLanguage,
      resetLanguage,
      customFlagUrl,
      onLanguageChange,
    }),
    [
      defaultLanguage,
      languages,
      availableLanguages,
      currentLanguage,
      currentLanguageMeta,
      nativeNames,
      rememberPreferences,
      autoDetect,
      isLoaded,
      isLoading,
      labelFormat,
      setLanguage,
      resetLanguage,
      customFlagUrl,
      onLanguageChange,
    ]
  );

  return (
    <GTranslateContext.Provider value={value}>
      {children}
    </GTranslateContext.Provider>
  );
};
