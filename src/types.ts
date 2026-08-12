import { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

/**
 * Standard supported language codes in Google Translate / GTranslate
 */
export type LanguageCode =
  | 'af' | 'sq' | 'am' | 'ar' | 'hy' | 'az' | 'eu' | 'be' | 'bn' | 'bs'
  | 'bg' | 'ca' | 'ceb' | 'ny' | 'zh-CN' | 'zh-TW' | 'co' | 'hr' | 'cs' | 'da'
  | 'nl' | 'en' | 'eo' | 'et' | 'tl' | 'fi' | 'fr' | 'fy' | 'gl' | 'ka'
  | 'de' | 'el' | 'gu' | 'ht' | 'ha' | 'haw' | 'iw' | 'hi' | 'hmn' | 'hu'
  | 'is' | 'ig' | 'id' | 'ga' | 'it' | 'ja' | 'jw' | 'kn' | 'kk' | 'km'
  | 'ko' | 'ku' | 'ky' | 'lo' | 'la' | 'lv' | 'lt' | 'lb' | 'mk' | 'mg'
  | 'ms' | 'ml' | 'mt' | 'mi' | 'mr' | 'mn' | 'my' | 'ne' | 'no' | 'ps'
  | 'fa' | 'pl' | 'pt' | 'pa' | 'ro' | 'ru' | 'sm' | 'gd' | 'sr' | 'st'
  | 'sn' | 'sd' | 'si' | 'sk' | 'sl' | 'so' | 'es' | 'su' | 'sw' | 'sv'
  | 'tg' | 'ta' | 'te' | 'th' | 'tr' | 'uk' | 'ur' | 'uz' | 'vi' | 'cy'
  | 'xh' | 'yi' | 'yo' | 'zu' | (string & {});

/**
 * Metadata for an individual language
 */
export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flagCode: string;
  rtl?: boolean;
}

/**
 * Flag shape options
 */
export type FlagShape = 'rounded' | 'circle' | 'square' | 'none';

/**
 * Flag size options (in pixels or preset)
 */
export type FlagSize = 'sm' | 'md' | 'lg' | number;

/**
 * Floating widget positions
 */
export type FloatPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'bottom-center'
  | 'top-center';

/**
 * Custom Label Formatter function or template string
 * Template variables:
 * - %n: English name (e.g. "Spanish")
 * - %N: Native name (e.g. "Español")
 * - %f: Country flag icon
 * - %c: Uppercase 2-letter code (e.g. "ES")
 * - %C: Lowercase code (e.g. "es")
 * Example string: "%f %n (%N)" or "%n (%f, %N)" or "%c - %N"
 */
export type LabelFormat =
  | string
  | ((meta: LanguageMeta, flagElement: ReactNode) => ReactNode);

/**
 * Base configuration options for GTranslate
 */
export interface GTranslateConfig {
  /**
   * The original/default language of your website
   * @default 'en'
   */
  defaultLanguage?: LanguageCode;

  /**
   * List of language codes available for switching.
   * If omitted, all supported languages are enabled.
   */
  languages?: LanguageCode[];

  /**
   * Whether to display language names in their native script (e.g., "Español", "Français", "日本語")
   * instead of English names ("Spanish", "French", "Japanese").
   * @default true
   */
  nativeNames?: boolean;

  /**
   * Persist user's language choice in localStorage & cookies so they stay in their preferred language across sessions.
   * @default true
   */
  rememberPreferences?: boolean;

  /**
   * Automatically detect user's browser language on first visit.
   * @default false
   */
  detectBrowserLanguage?: boolean;

  /**
   * Custom URL or CDN pattern for flag icons.
   * Example: "https://flags.example.com/{code}.svg"
   */
  customFlagUrl?: string | ((code: string) => string);

  /**
   * Global label format template or renderer
   */
  labelFormat?: LabelFormat;

  /**
   * Callback fired whenever the user switches language.
   */
  onLanguageChange?: (language: LanguageCode, languageMeta: LanguageMeta) => void;
}

/**
 * GTranslate React Context state
 */
export interface GTranslateContextValue extends Required<Omit<GTranslateConfig, 'customFlagUrl' | 'onLanguageChange' | 'languages' | 'labelFormat'>> {
  /** Currently active translated language code */
  currentLanguage: LanguageCode;
  /** Active language metadata */
  currentLanguageMeta: LanguageMeta;
  /** Change the active language */
  setLanguage: (lang: LanguageCode) => void;
  /** Reset language back to default */
  resetLanguage: () => void;
  /** All available languages */
  languages: LanguageCode[];
  /** Full list of LanguageMeta objects for available languages */
  availableLanguages: LanguageMeta[];
  /** Is the Google Translate script initialized and ready */
  isLoaded: boolean;
  /** Is a translation switch currently in progress */
  isLoading: boolean;
  /** Global label format */
  labelFormat?: LabelFormat;
  /** Custom flag URL generator */
  customFlagUrl?: string | ((code: string) => string);
  /** Trigger callback */
  onLanguageChange?: (language: LanguageCode, languageMeta: LanguageMeta) => void;
}

/**
 * Shared props for all GTranslate UI components
 */
export interface BaseComponentProps {
  /** Additional CSS class for outer container */
  className?: string;
  /** Inline CSS style for outer container */
  style?: CSSProperties;
  /** Custom default language (overrides provider) */
  defaultLanguage?: LanguageCode;
  /** Specific languages to show in this component (subset of provider languages) */
  languages?: LanguageCode[];
  /** Show language names in native script */
  nativeNames?: boolean;
  /** Shape of the flag icon */
  flagShape?: FlagShape;
  /** Size of the flag icon */
  flagSize?: FlagSize;
  /** Hide the flag icons */
  hideFlags?: boolean;
  /**
   * Format the label shown to the user.
   * Supports placeholders:
   * - %n: English name (e.g. "Spanish")
   * - %N: Native name (e.g. "Español")
   * - %f: Flag icon
   * - %c: Uppercase language code (e.g. "ES")
   * - %C: Lowercase language code (e.g. "es")
   * Example: "%n (%f, %N)" or "%f %N" or "%c - %n"
   */
  labelFormat?: LabelFormat;
  /**
   * Enable real-time search filtering in the dropdown / dialog / popover.
   * Set to `false` to render a standard clean shadcn select without search.
   * @default true
   */
  enableSearch?: boolean;
  /**
   * Alias for `enableSearch`
   * @default true
   */
  showSearch?: boolean;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Show Google disclaimer ("Translation provided by Google") below component */
  showGoogleDisclaimer?: boolean;
  /** Show Generous branding ("Translated with React-gtranslate") below component */
  showGenerousBranding?: boolean;
  /** Custom placeholder/trigger label */
  placeholder?: string;
  /** Callback fired on selection */
  onLanguageChange?: (language: LanguageCode, languageMeta: LanguageMeta) => void;

  // Direct passdown attributes
  /** Props passed down directly to trigger button */
  triggerProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  /** Custom class for trigger button */
  triggerClassName?: string;
  /** Custom style for trigger button */
  triggerStyle?: CSSProperties;

  /** Props passed down directly to dropdown/popover menu container */
  menuProps?: HTMLAttributes<HTMLDivElement>;
  /** Custom class for menu container */
  menuClassName?: string;
  /** Custom style for menu container */
  menuStyle?: CSSProperties;

  /** Props passed down directly to individual language item buttons */
  itemProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  /** Custom class for item buttons */
  itemClassName?: string;
  /** Custom style for item buttons */
  itemStyle?: CSSProperties;

  /** Props passed down directly to search input */
  searchProps?: InputHTMLAttributes<HTMLInputElement>;
  /** Custom class for search input */
  searchClassName?: string;
  /** Custom style for search input */
  searchStyle?: CSSProperties;
}

/**
 * Props for GTranslateDropdown
 */
export interface GTranslateDropdownProps extends BaseComponentProps {
  /** Dropdown menu alignment relative to trigger */
  align?: 'start' | 'center' | 'end';
  /** Max height for dropdown list (e.g. 300 or "300px") */
  maxHeight?: number | string;
  /** Custom trigger element or render function */
  trigger?: ReactNode | ((current: LanguageMeta) => ReactNode);
}

/**
 * Props for GTranslateDialog
 */
export interface GTranslateDialogProps extends BaseComponentProps {
  /** Modal dialog title */
  title?: string;
  /** Modal dialog subtitle/description */
  description?: string;
  /** Custom trigger element or button */
  trigger?: ReactNode | ((current: LanguageMeta) => ReactNode);
  /** Dialog max width */
  maxWidth?: string | number;
  /** Number of grid columns for language cards (e.g. 2, 3, 4) */
  columns?: 2 | 3 | 4 | 5;
  /** Custom class for modal dialog content */
  dialogClassName?: string;
  /** Controlled open state */
  open?: boolean;
  /** Controlled open state setter */
  onOpenChange?: (open: boolean) => void;
  /** Props passed down directly to overlay backdrop */
  overlayProps?: HTMLAttributes<HTMLDivElement>;
  /** Props passed down directly to modal content box */
  dialogContentProps?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Props for GTranslateFloat
 */
export interface GTranslateFloatProps extends BaseComponentProps {
  /** Fixed screen corner position */
  position?: FloatPosition;
  /** Distance from horizontal viewport edge (e.g., 20 or "20px") */
  offsetX?: number | string;
  /** Distance from vertical viewport edge (e.g., 20 or "20px") */
  offsetY?: number | string;
  /** Z-index of the floating container */
  zIndex?: number;
  /** Mode: 'popup' opens a menu, 'flags' shows a neat floating row/column of flags */
  variant?: 'popup' | 'flags';
}

/**
 * Props for GTranslatePills
 */
export interface GTranslatePillsProps extends BaseComponentProps {
  /** Pill style variant */
  variant?: 'solid' | 'outline' | 'ghost' | 'segmented';
  /** Show flag only, code only, or full name */
  displayMode?: 'flag-name' | 'flag-code' | 'name-only' | 'flag-only';
  /** Layout direction */
  orientation?: 'horizontal' | 'vertical';
  /** Gap between pills */
  gap?: number | string;
}

/**
 * Props for GTranslateGlobe
 */
export interface GTranslateGlobeProps extends BaseComponentProps {
  /** Icon size */
  iconSize?: number;
  /** Show current language code next to globe icon */
  showCurrentCode?: boolean;
  /** Flyout alignment */
  align?: 'start' | 'center' | 'end';
  /** Custom class for popover menu */
  popoverClassName?: string;
  /** Props passed down directly to popover menu */
  popoverProps?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Props for GTranslateCompact
 */
export interface GTranslateCompactProps extends BaseComponentProps {
  /** Show country flag icon */
  showFlag?: boolean;
  /** Show 2-letter uppercase language code (e.g., "EN", "ES") */
  showCode?: boolean;
  /** Show full language name */
  showName?: boolean;
  /** Props passed down directly to native select element */
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
}
