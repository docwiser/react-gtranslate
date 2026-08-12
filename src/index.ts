// Core Components
export { GTranslateDropdown } from './components/GTranslateDropdown';
export { GTranslateDialog } from './components/GTranslateDialog';
export { GTranslateFloat } from './components/GTranslateFloat';
export { GTranslatePills } from './components/GTranslatePills';
export { GTranslateGlobe } from './components/GTranslateGlobe';
export { GTranslateCompact } from './components/GTranslateCompact';
export { FlagIcon } from './components/FlagIcon';
export { BrandingFooter } from './components/BrandingFooter';

// Shadcn/UI Primitives
export * from './components/ui/button';
export * from './components/ui/input';
export * from './components/ui/badge';
export * from './components/ui/dialog';
export * from './components/ui/dropdown-menu';
export * from './components/ui/popover';
export * from './components/ui/select';
export { cn } from './lib/utils';

// Context & Headless Hooks
export { GTranslateProvider, GTranslateContext } from './context/GTranslateContext';
export type { GTranslateProviderProps } from './context/GTranslateContext';
export { useGTranslate } from './context/useGTranslate';

// Constants & Metadata
export {
  LANGUAGES_MAP,
  DEFAULT_LANGUAGES,
  POPULAR_LANGUAGES,
  getLanguageMeta,
} from './constants/languages';
export { SVG_FLAGS, getFlagSvg } from './constants/flags';

// Utilities
export { formatLanguageLabel } from './utils/formatLabel';

// Engine & Utilities
export {
  loadGoogleTranslateScript,
  executeTranslation,
  injectCoreStyles,
  injectContainer,
} from './core/engine';
export {
  getGoogleTransLang,
  setGoogleTransLang,
  clearGoogleTransLang,
} from './core/cookies';
export {
  detectBrowserLanguage,
  getSavedLanguage,
  saveLanguagePreference,
  clearLanguagePreference,
} from './core/storage';

// Types
export * from './types';
