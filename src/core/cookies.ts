/**
 * Helper to manage Google Translate `googtrans` cookie.
 * Google Translate reads this cookie to apply translation on page load.
 * Format: `/source_lang/target_lang` (e.g. `/en/es` or `/auto/fr`)
 */

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string, days = 365, domain?: string): void {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();

  let cookieString = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  document.cookie = cookieString;

  // Also set for top-level domain if applicable for subdomains
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length > 2) {
      const rootDomain = '.' + parts.slice(-2).join('.');
      document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; domain=${rootDomain}; SameSite=Lax`;
    }
  }
}

export function eraseCookie(name: string, domain?: string): void {
  if (typeof document === 'undefined') return;

  const expired = '; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=-99999999; path=/;';
  document.cookie = `${name}=${expired}`;

  if (domain) {
    document.cookie = `${name}=${expired} domain=${domain};`;
    document.cookie = `${name}=${expired} domain=.${domain};`;
  }

  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname;
    document.cookie = `${name}=${expired} domain=${hostname};`;
    document.cookie = `${name}=${expired} domain=.${hostname};`;

    const parts = hostname.split('.');
    if (parts.length > 1) {
      const rootDomain = parts.slice(-2).join('.');
      document.cookie = `${name}=${expired} domain=${rootDomain};`;
      document.cookie = `${name}=${expired} domain=.${rootDomain};`;
    }
  }
}

export function getGoogleTransLang(): string | null {
  const cookie = getCookie('googtrans');
  if (!cookie) return null;
  // cookie is in format /en/es or /auto/es
  const parts = cookie.split('/');
  return parts.length >= 3 && parts[2] ? parts[2] : null;
}

export function setGoogleTransLang(defaultLang: string, targetLang: string, domain?: string): void {
  const val = `/${defaultLang}/${targetLang}`;
  setCookie('googtrans', val, 365, domain);
}

export function clearGoogleTransLang(domain?: string): void {
  eraseCookie('googtrans', domain);
}
