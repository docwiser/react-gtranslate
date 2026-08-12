import { LanguageCode, LanguageMeta } from '../types';

/**
 * Map of all supported languages in Google Translate / GTranslate
 * with English names, Native script names, flag codes, and direction.
 */
export const LANGUAGES_MAP: Record<string, LanguageMeta> = {
  af: { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flagCode: 'af' },
  sq: { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flagCode: 'sq' },
  am: { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flagCode: 'am' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flagCode: 'ar', rtl: true },
  hy: { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flagCode: 'hy' },
  az: { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan dili', flagCode: 'az' },
  eu: { code: 'eu', name: 'Basque', nativeName: 'Euskara', flagCode: 'eu' },
  be: { code: 'be', name: 'Belarusian', nativeName: 'Беларуская мова', flagCode: 'be' },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flagCode: 'bn' },
  bs: { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flagCode: 'bs' },
  bg: { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flagCode: 'bg' },
  ca: { code: 'ca', name: 'Catalan', nativeName: 'Català', flagCode: 'ca' },
  ceb: { code: 'ceb', name: 'Cebuano', nativeName: 'Cebuano', flagCode: 'ceb' },
  ny: { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa', flagCode: 'ny' },
  'zh-CN': { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flagCode: 'zh-CN' },
  'zh-TW': { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flagCode: 'zh-TW' },
  co: { code: 'co', name: 'Corsican', nativeName: 'Corsu', flagCode: 'co' },
  hr: { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flagCode: 'hr' },
  cs: { code: 'cs', name: 'Czech', nativeName: 'Čeština', flagCode: 'cs' },
  da: { code: 'da', name: 'Danish', nativeName: 'Dansk', flagCode: 'da' },
  nl: { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flagCode: 'nl' },
  en: { code: 'en', name: 'English', nativeName: 'English', flagCode: 'en' },
  eo: { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', flagCode: 'eo' },
  et: { code: 'et', name: 'Estonian', nativeName: 'Eesti', flagCode: 'et' },
  tl: { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flagCode: 'tl' },
  fi: { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flagCode: 'fi' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flagCode: 'fr' },
  fy: { code: 'fy', name: 'Frisian', nativeName: 'Frysk', flagCode: 'fy' },
  gl: { code: 'gl', name: 'Galician', nativeName: 'Galego', flagCode: 'gl' },
  ka: { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flagCode: 'ka' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flagCode: 'de' },
  el: { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flagCode: 'el' },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flagCode: 'gu' },
  ht: { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl ayisyen', flagCode: 'ht' },
  ha: { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', flagCode: 'ha' },
  haw: { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', flagCode: 'haw' },
  iw: { code: 'iw', name: 'Hebrew', nativeName: 'עִבְרִית', flagCode: 'iw', rtl: true },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flagCode: 'hi' },
  hmn: { code: 'hmn', name: 'Hmong', nativeName: 'Hmoob', flagCode: 'hmn' },
  hu: { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flagCode: 'hu' },
  is: { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flagCode: 'is' },
  ig: { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flagCode: 'ig' },
  id: { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flagCode: 'id' },
  ga: { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flagCode: 'ga' },
  it: { code: 'it', name: 'Italian', nativeName: 'Italiano', flagCode: 'it' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flagCode: 'ja' },
  jw: { code: 'jw', name: 'Javanese', nativeName: 'Basa Jawa', flagCode: 'jw' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flagCode: 'kn' },
  kk: { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ тілі', flagCode: 'kk' },
  km: { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', flagCode: 'km' },
  ko: { code: 'ko', name: 'Korean', nativeName: '한국어', flagCode: 'ko' },
  ku: { code: 'ku', name: 'Kurdish (Kurmanji)', nativeName: 'Kurdî', flagCode: 'ku', rtl: true },
  ky: { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flagCode: 'ky' },
  lo: { code: 'lo', name: 'Lao', nativeName: 'ພາສາລາວ', flagCode: 'lo' },
  la: { code: 'la', name: 'Latin', nativeName: 'Latina', flagCode: 'la' },
  lv: { code: 'lv', name: 'Latvian', nativeName: 'Latviešu valoda', flagCode: 'lv' },
  lt: { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių kalba', flagCode: 'lt' },
  lb: { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', flagCode: 'lb' },
  mk: { code: 'mk', name: 'Macedonian', nativeName: 'Македонски јазик', flagCode: 'mk' },
  mg: { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', flagCode: 'mg' },
  ms: { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flagCode: 'ms' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flagCode: 'ml' },
  mt: { code: 'mt', name: 'Maltese', nativeName: 'Maltese', flagCode: 'mt' },
  mi: { code: 'mi', name: 'Maori', nativeName: 'Te Reo Māori', flagCode: 'mi' },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flagCode: 'mr' },
  mn: { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', flagCode: 'mn' },
  my: { code: 'my', name: 'Myanmar (Burmese)', nativeName: 'ဗမာစာ', flagCode: 'my' },
  ne: { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flagCode: 'ne' },
  no: { code: 'no', name: 'Norwegian', nativeName: 'Norsk bokmål', flagCode: 'no' },
  ps: { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flagCode: 'ps', rtl: true },
  fa: { code: 'fa', name: 'Persian', nativeName: 'فارسی', flagCode: 'fa', rtl: true },
  pl: { code: 'pl', name: 'Polish', nativeName: 'Polski', flagCode: 'pl' },
  pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', flagCode: 'pt' },
  pa: { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flagCode: 'pa' },
  ro: { code: 'ro', name: 'Romanian', nativeName: 'Română', flagCode: 'ro' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', flagCode: 'ru' },
  sm: { code: 'sm', name: 'Samoan', nativeName: 'Samoan', flagCode: 'sm' },
  gd: { code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig', flagCode: 'gd' },
  sr: { code: 'sr', name: 'Serbian', nativeName: 'Српски језик', flagCode: 'sr' },
  st: { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', flagCode: 'st' },
  sn: { code: 'sn', name: 'Shona', nativeName: 'Shona', flagCode: 'sn' },
  sd: { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flagCode: 'sd', rtl: true },
  si: { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flagCode: 'si' },
  sk: { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flagCode: 'sk' },
  sl: { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flagCode: 'sl' },
  so: { code: 'so', name: 'Somali', nativeName: 'Afsoomaali', flagCode: 'so' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', flagCode: 'es' },
  su: { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', flagCode: 'su' },
  sw: { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flagCode: 'sw' },
  sv: { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flagCode: 'sv' },
  tg: { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flagCode: 'tg' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flagCode: 'ta' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flagCode: 'te' },
  th: { code: 'th', name: 'Thai', nativeName: 'ไทย', flagCode: 'th' },
  tr: { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flagCode: 'tr' },
  uk: { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flagCode: 'uk' },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', flagCode: 'ur', rtl: true },
  uz: { code: 'uz', name: 'Uzbek', nativeName: 'O‘zbekcha', flagCode: 'uz' },
  vi: { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flagCode: 'vi' },
  cy: { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flagCode: 'cy' },
  xh: { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flagCode: 'xh' },
  yi: { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', flagCode: 'yi', rtl: true },
  yo: { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flagCode: 'yo' },
  zu: { code: 'zu', name: 'Zulu', nativeName: 'Zulu', flagCode: 'zu' },
};

/**
 * Array of all supported language codes in default alphabetical order
 */
export const DEFAULT_LANGUAGES: LanguageCode[] = Object.keys(LANGUAGES_MAP) as LanguageCode[];

/**
 * Popular / Top languages preset
 */
export const POPULAR_LANGUAGES: LanguageCode[] = [
  'en', 'es', 'fr', 'de', 'zh-CN', 'ja', 'ar', 'pt', 'ru', 'it', 'hi', 'ko', 'nl', 'tr', 'pl'
];

/**
 * Helper to get LanguageMeta safely with fallback
 */
export function getLanguageMeta(code: string): LanguageMeta {
  if (LANGUAGES_MAP[code]) {
    return LANGUAGES_MAP[code];
  }
  // Try lowercase or prefix fallback (e.g. 'en-US' -> 'en')
  const baseCode = code.split('-')[0].toLowerCase();
  if (LANGUAGES_MAP[baseCode]) {
    return LANGUAGES_MAP[baseCode];
  }
  return {
    code,
    name: code.toUpperCase(),
    nativeName: code.toUpperCase(),
    flagCode: baseCode,
  };
}
