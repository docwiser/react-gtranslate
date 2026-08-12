import { LanguageCode } from '../types';
import { clearGoogleTransLang, setGoogleTransLang } from './cookies';
import { saveLanguagePreference } from './storage';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; autoDisplay?: boolean; layout?: any },
          elementId: string
        ) => void;
      };
    };
    __reactGTranslateInit?: () => void;
    __react_gt_script_loaded?: boolean;
    __react_gt_initialized?: boolean;
    doGTranslate?: (langPair: string) => void;
  }
}

const CONTAINER_ID = 'google_translate_element2';
const STYLE_ID = 'react-gtranslate-core-css';
const SCRIPT_ID = 'react-gtranslate-script';

/**
 * Injects required core CSS to hide Google banner, top frames, and annoying highlights.
 */
export function injectCoreStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    div.skiptranslate,
    #${CONTAINER_ID},
    .goog-te-banner-frame,
    .goog-te-balloon-frame,
    #goog-gt-tt,
    .goog-tooltip,
    .goog-tooltip:hover {
      display: none !important;
      visibility: hidden !important;
    }
    body {
      top: 0 !important;
      position: static !important;
    }
    font font {
      background-color: transparent !important;
      box-shadow: none !important;
      position: initial !important;
    }
    .goog-text-highlight {
      background-color: transparent !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Injects the hidden container element required by Google Translate.
 */
export function injectContainer(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.style.display = 'none';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Loads the Google Translate script and initializes TranslateElement.
 */
export function loadGoogleTranslateScript(
  defaultLanguage: LanguageCode,
  onInitialized?: () => void
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve();
      return;
    }

    injectCoreStyles();
    injectContainer();

    if (window.google?.translate?.TranslateElement && window.__react_gt_initialized) {
      onInitialized?.();
      resolve();
      return;
    }

    window.__reactGTranslateInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: defaultLanguage,
              autoDisplay: false,
            },
            CONTAINER_ID
          );
          window.__react_gt_initialized = true;
          onInitialized?.();
          resolve();
        }
      } catch (err) {
        console.warn('[react-gtranslate] Failed to init Google Translate:', err);
        resolve();
      }
    };

    if (document.getElementById(SCRIPT_ID)) {
      if (window.__react_gt_initialized) {
        resolve();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://translate.google.com/translate_a/element.js?cb=__reactGTranslateInit`;
    script.async = true;
    script.onerror = () => {
      console.warn('[react-gtranslate] Could not load Google Translate script.');
      resolve();
    };
    document.body.appendChild(script);
  });
}

/**
 * Dispatches the change event on Google Translate combo element to trigger translation.
 */
function fireChangeEvent(element: HTMLElement): void {
  try {
    if ('createEvent' in document) {
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      element.dispatchEvent(evt);
    } else {
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
  } catch (e) {
    // fallback
  }
}

/**
 * Attempts to trigger Google Translate's built-in "Show original" button in iframes
 */
function triggerShowOriginal(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const iframes = document.querySelectorAll<HTMLIFrameElement>(
      'iframe.goog-te-banner-frame, iframe.skiptranslate, iframe[id*="goog"], iframe[id*=":1"]'
    );
    for (let i = 0; i < iframes.length; i++) {
      try {
        const iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow?.document;
        if (iframeDoc) {
          const btn = iframeDoc.querySelector<HTMLButtonElement>(
            'button[id*="restore"], .goog-te-button button, button.goog-close-link, #goog-gt-tt button'
          );
          if (btn) {
            btn.click();
            return true;
          }
          const allBtns = iframeDoc.querySelectorAll('button');
          for (let j = 0; j < allBtns.length; j++) {
            const txt = (allBtns[j].innerText || allBtns[j].textContent || '').toLowerCase();
            if (txt.includes('original') || txt.includes('restore') || txt.includes('reset')) {
              allBtns[j].click();
              return true;
            }
          }
        }
      } catch (e) {
        // cross-origin guard
      }
    }
  } catch (e) {}
  return false;
}

/**
 * Triggers client-side translation to the requested language.
 */
export function executeTranslation(
  defaultLanguage: LanguageCode,
  targetLanguage: LanguageCode,
  remember = true,
  retryCount = 0
): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }

    const isDefault = targetLanguage === defaultLanguage;

    // Save preferences & cookies
    if (remember) {
      if (isDefault) {
        clearGoogleTransLang();
        saveLanguagePreference(defaultLanguage);
      } else {
        setGoogleTransLang(defaultLanguage, targetLanguage);
        saveLanguagePreference(targetLanguage);
      }
    }

    const findCombo = (): HTMLSelectElement | null => {
      const selects = document.getElementsByTagName('select');
      for (let i = 0; i < selects.length; i++) {
        if (selects[i].className && selects[i].className.indexOf('goog-te-combo') !== -1) {
          return selects[i];
        }
      }
      return null;
    };

    const combo = findCombo();
    const container = document.getElementById(CONTAINER_ID);

    if (!combo || !container || container.innerHTML.length === 0) {
      if (retryCount < 25) {
        setTimeout(() => {
          executeTranslation(defaultLanguage, targetLanguage, remember, retryCount + 1).then(resolve);
        }, 200);
      } else {
        if (remember && !isDefault) {
          window.location.reload();
        }
        resolve(false);
      }
      return;
    }

    try {
      if (isDefault) {
        // 1. Try iframe restore button
        triggerShowOriginal();

        // 2. Set combo to default language value or empty
        let hasDefaultOption = false;
        for (let i = 0; i < combo.options.length; i++) {
          if (combo.options[i].value === defaultLanguage) {
            hasDefaultOption = true;
            break;
          }
        }

        if (hasDefaultOption) {
          combo.value = defaultLanguage;
        } else {
          combo.value = '';
        }

        fireChangeEvent(combo);
        setTimeout(() => {
          fireChangeEvent(combo);
          triggerShowOriginal();
          resolve(true);
        }, 50);
      } else {
        // Translate to target foreign language
        combo.value = targetLanguage;
        fireChangeEvent(combo);
        setTimeout(() => {
          fireChangeEvent(combo);
          resolve(true);
        }, 50);
      }
    } catch (e) {
      console.warn('[react-gtranslate] Failed to trigger translation event:', e);
      resolve(false);
    }
  });
}
