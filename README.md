# react-gtranslate 🌐

[![npm version](https://img.shields.io/npm/v/react-gtranslate.svg?style=flat-square&color=2563eb)](https://www.npmjs.com/package/react-gtranslate)
[![GitHub Stars](https://img.shields.io/github/stars/docwiser/react-gtranslate.svg?style=flat-square&color=blue)](https://github.com/docwiser/react-gtranslate)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%2F%2019-61dafb.svg?style=flat-square)](https://react.dev/)

A modern, accessible, and highly customizable React translation library powered by **GTranslate** and built with official **shadcn/ui** and **Radix UI** primitives. Includes **6+ distinct translation components**, headless hooks (`useGTranslate`), **105+ built-in offline SVG flags**, flexible template-based label formatting (`labelFormat`), automatic browser language detection, and persistent preferences.

---

## 📖 Open-Source Statement

`react-gtranslate` is an open-source project created and maintained by **DocWiser** under the **MIT License**. Our mission is to provide React and Next.js developers with a zero-friction, production-grade translation solution that works natively without costly per-character translation API keys or heavy vendor lock-in.

- **GitHub Repository**: [https://github.com/docwiser/react-gtranslate](https://github.com/docwiser/react-gtranslate)
- **NPM Package**: [https://www.npmjs.com/package/react-gtranslate](https://www.npmjs.com/package/react-gtranslate)
- **Issue Tracker**: [https://github.com/docwiser/react-gtranslate/issues](https://github.com/docwiser/react-gtranslate/issues)

---

## ✨ Key Features

- 🚀 **Zero API Keys Required**: Seamless client-side translation powered by the battle-tested GTranslate / Google Translate engine.
- 🎨 **Built with Official shadcn/ui & Radix UI**:
  - `GTranslateDropdown` — Select dropdown powered by shadcn `<DropdownMenu>`, `<Button>`, `<Input>`.
  - `GTranslateDialog` — Modal dialog powered by shadcn `<Dialog>`, `<DialogContent>`, `<Input>`.
  - `GTranslateFloat` — Corner-docked Floating Action Button (FAB) powered by shadcn `<Popover>`.
  - `GTranslatePills` — Inline segmented tabs / chips with shadcn `<Button>` variants.
  - `GTranslateGlobe` — Minimalist globe trigger powered by shadcn `<Popover>`.
  - `GTranslateCompact` — Ultra-compact select switcher powered by shadcn `<Select>`.
- 🔤 **Template-Based Label Formatting (`labelFormat`)**:
  - Format labels with template tokens: `"%n (%f, %N)"`, `"%f %n"`, `"%c - %N"`, `"%f %c"` or custom render functions!
- 🔍 **Search Filtering Toggle (`enableSearch`)**:
  - Set `enableSearch={false}` for a standard clean select without search input.
- 🎛️ **Direct UI Passdown Attributes**:
  - Direct HTML attribute and style passdowns: `triggerProps`, `menuProps`, `itemProps`, `searchProps`, `overlayProps`, `dialogContentProps`, `selectProps`.
- 🧠 **Headless Hook (`useGTranslate`)**: Build 100% custom translation UI anywhere with full access to state and actions.
- 🏳️ **105+ Built-in High-Quality SVG Flags**: Offline-ready with zero external asset dependencies or CDN latency.
- 🔄 **Smart Preference Persistence**: Remembers user choices across page reloads via `localStorage` and `googtrans` cookies (`rememberPreferences`).
- 🌍 **Automatic Browser Language Detection**: Auto-switches to the visitor's native language on first visit (`detectBrowserLanguage`).
- ⚡ **Next.js & SSR Ready**: Seamless integration with Next.js (App Router & Pages Router), Vite, Remix, Astro, and Gatsby.
- 🌗 **Dark Mode & Tailwind Compatible**: Built using standard CSS variables and shadcn-compatible design tokens.
- 🛡️ **100% TypeScript Typed**: Full autocompletion for 100+ ISO language codes and component props.

---

## 📦 Installation

```bash
# npm
npm install react-gtranslate

# pnpm
pnpm add react-gtranslate

# yarn
yarn add react-gtranslate
```

Import the CSS stylesheet in your root layout or entry file (`App.tsx`, `layout.tsx`, or `_app.tsx`):

```tsx
import 'react-gtranslate/styles.css';
```

---

## 🚀 Quick Start

### 1. Dropdown (Plug & Play)

No complex configuration required! Drop it anywhere in your app:

```tsx
import React from 'react';
import { GTranslateDropdown } from 'react-gtranslate';
import 'react-gtranslate/styles.css';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">My Website</h1>
      <GTranslateDropdown
        enableSearch={true}
        flagShape="rounded"
        labelFormat="%n (%f, %N)"
        showGoogleDisclaimer={false}
        showGenerousBranding={false}
      />
    </header>
  );
}
```

---

### 2. Using `GTranslateProvider` (Recommended for Global Config)

Wrap your app or layout with `<GTranslateProvider>` to share configuration across components:

```tsx
// app/layout.tsx (Next.js App Router) or App.tsx (Vite / CRA)
import React from 'react';
import { GTranslateProvider } from 'react-gtranslate';
import 'react-gtranslate/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GTranslateProvider
          defaultLanguage="en"
          languages={['en', 'es', 'fr', 'de', 'ja', 'zh-CN', 'ar', 'pt', 'hi', 'it']}
          rememberPreferences={true}
          detectBrowserLanguage={true}
          nativeNames={true}
          labelFormat="%f %N"
        >
          {children}
        </GTranslateProvider>
      </body>
    </html>
  );
}
```

---

## 🏷️ Custom Label Formatting (`labelFormat`)

Format the language text exactly how you want using template variables:

| Token | Description | Example for Spanish |
| :--- | :--- | :--- |
| `%n` | English name | `Spanish` |
| `%N` | Native name | `Español` |
| `%f` | Flag SVG icon | 🇪🇸 |
| `%c` | Uppercase 2-letter ISO code | `ES` |
| `%C` | Lowercase ISO code | `es` |

### Examples:
```tsx
// 1. Flag + English name + Native name in brackets
<GTranslateDropdown labelFormat="%n (%f, %N)" />
// Result: Spanish (🇪🇸, Español)

// 2. Uppercase Code + Flag + Native name
<GTranslateDropdown labelFormat="%c %f %N" />
// Result: ES 🇪🇸 Español

// 3. Custom Render Function
<GTranslateDropdown
  labelFormat={(meta, flag) => (
    <div className="flex items-center gap-2">
      {flag}
      <span className="font-semibold">{meta.name}</span>
      <span className="text-xs text-muted-foreground">[{meta.code}]</span>
    </div>
  )}
/>
```

---

## 🧩 Components Overview

### 1. `<GTranslateDropdown />`

A sleek shadcn select dropdown with search filtering, flag previews, native names, and keyboard navigation.

```tsx
import { GTranslateDropdown } from 'react-gtranslate';

<GTranslateDropdown
  enableSearch={true}      // Set false to show a clean select without search
  searchPlaceholder="Filter language..."
  flagShape="rounded"     // 'rounded' | 'circle' | 'square' | 'none'
  flagSize="md"           // 'sm' | 'md' | 'lg' | number
  labelFormat="%f %n"
  showGoogleDisclaimer={true}
  showGenerousBranding={false}
  onLanguageChange={(lang, meta) => console.log('Switched to:', lang, meta)}
/>
```

---

### 2. `<GTranslateDialog />`

A modal dialog presenting languages in an organized, searchable multi-column grid with smooth backdrop blur.

```tsx
import { GTranslateDialog } from 'react-gtranslate';

<GTranslateDialog
  title="Select Your Language"
  description="Choose your preferred language to translate the website content."
  columns={3}             // 2 | 3 | 4 | 5
  maxWidth="680px"
  enableSearch={true}
  flagShape="circle"
  labelFormat="%f %N"
  showGoogleDisclaimer={true}
  showGenerousBranding={true}
/>
```

---

### 3. `<GTranslateFloat />`

A corner-docked floating action button (FAB) that expands into a quick language selector without taking up layout space.

```tsx
import { GTranslateFloat } from 'react-gtranslate';

<GTranslateFloat
  position="bottom-right" // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  offsetX={24}
  offsetY={24}
  enableSearch={true}
  flagShape="rounded"
  showGoogleDisclaimer={false}
  showGenerousBranding={false}
/>
```

---

### 4. `<GTranslatePills />`

An inline segmented bar or chip selector, perfect for navbars, hero banners, and footers.

```tsx
import { GTranslatePills } from 'react-gtranslate';

<GTranslatePills
  variant="segmented"     // 'segmented' | 'solid' | 'outline' | 'ghost'
  displayMode="flag-name" // 'flag-name' | 'flag-code' | 'flag-only' | 'name-only'
  languages={['en', 'es', 'fr', 'de', 'zh-CN', 'ja']}
  flagShape="rounded"
  labelFormat="%f %n"
/>
```

---

### 5. `<GTranslateGlobe />`

A minimalist globe icon button with current language badge that opens a sleek flyout popover.

```tsx
import { GTranslateGlobe } from 'react-gtranslate';

<GTranslateGlobe
  iconSize={20}
  showCurrentCode={true}
  align="end"             // 'start' | 'center' | 'end'
  enableSearch={true}
  showGoogleDisclaimer={true}
/>
```

---

### 6. `<GTranslateCompact />`

An ultra-compact switcher showing the country flag and 2-letter uppercase ISO code (e.g. 🇺🇸 EN) or custom `labelFormat`.

```tsx
import { GTranslateCompact } from 'react-gtranslate';

<GTranslateCompact
  labelFormat="%f %c"
  flagShape="circle"
/>
```

---

## 🪝 Headless Hook (`useGTranslate`)

Build your own bespoke UI with the headless hook:

```tsx
import React from 'react';
import { useGTranslate, FlagIcon } from 'react-gtranslate';

export function CustomLanguageSelector() {
  const {
    currentLanguage,
    currentLanguageMeta,
    setLanguage,
    availableLanguages,
    isLoading,
    resetLanguage,
  } = useGTranslate();

  return (
    <div className="flex items-center gap-3 p-3 bg-card border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 font-semibold">
        <FlagIcon code={currentLanguageMeta.flagCode} size="md" />
        <span>{currentLanguageMeta.nativeName}</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {availableLanguages.slice(0, 8).map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            disabled={isLoading}
            className={`px-2.5 py-1 text-xs rounded border transition-colors ${
              currentLanguage === lang.code
                ? 'bg-primary text-primary-foreground font-bold'
                : 'hover:bg-accent'
            }`}
          >
            {lang.nativeName}
          </button>
        ))}
      </div>

      <button onClick={resetLanguage} className="text-xs text-muted-foreground underline ml-auto">
        Reset
      </button>
    </div>
  );
}
```

---

## ⚙️ Component Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `defaultLanguage` | `LanguageCode` | `'en'` | Default source language of your website. |
| `languages` | `LanguageCode[]` | `All 105+` | Array of language codes to include. |
| `enableSearch` | `boolean` | `true` | Enables search filtering inside dropdown/dialog. Set to `false` for standard select. |
| `labelFormat` | `string \| Function` | `undefined` | Template string (e.g. `"%n (%f, %N)"`) or render function. |
| `nativeNames` | `boolean` | `true` | Display names in native script (e.g. "Français"). |
| `flagShape` | `'rounded' \| 'circle' \| 'square' \| 'none'` | `'rounded'` | Shape styling for flag icons. |
| `flagSize` | `'sm' \| 'md' \| 'lg' \| number` | `'md'` | Size preset or exact pixel width. |
| `hideFlags` | `boolean` | `false` | Hide flag icons completely. |
| `showGoogleDisclaimer` | `boolean` | `false` | Shows "Translation provided by Google" with official logo & link below the component. |
| `showGenerousBranding` | `boolean` | `false` | Shows "Translated with React-gtranslate" link below the component. |
| `triggerProps` | `ButtonHTMLAttributes` | `undefined` | Props passed down directly to trigger button. |
| `menuProps` | `HTMLAttributes` | `undefined` | Props passed down directly to menu container. |
| `itemProps` | `ButtonHTMLAttributes` | `undefined` | Props passed down directly to item buttons. |
| `searchProps` | `InputHTMLAttributes` | `undefined` | Props passed down directly to search input. |
| `className` | `string` | `''` | Custom CSS class name for outer container. |
| `style` | `CSSProperties` | `undefined` | Inline CSS styles. |
| `onLanguageChange` | `(lang, meta) => void` | `undefined` | Callback fired on language selection. |

---

## 🌐 Supported Languages (105+)

Afrikaans (`af`), Albanian (`sq`), Amharic (`am`), Arabic (`ar`), Armenian (`hy`), Azerbaijani (`az`), Basque (`eu`), Belarusian (`be`), Bengali (`bn`), Bosnian (`bs`), Bulgarian (`bg`), Catalan (`ca`), Cebuano (`ceb`), Chichewa (`ny`), Chinese Simplified (`zh-CN`), Chinese Traditional (`zh-TW`), Corsican (`co`), Croatian (`hr`), Czech (`cs`), Danish (`da`), Dutch (`nl`), English (`en`), Esperanto (`eo`), Estonian (`et`), Filipino (`tl`), Finnish (`fi`), French (`fr`), Frisian (`fy`), Galician (`gl`), Georgian (`ka`), German (`de`), Greek (`el`), Gujarati (`gu`), Haitian Creole (`ht`), Hausa (`ha`), Hawaiian (`haw`), Hebrew (`iw`), Hindi (`hi`), Hmong (`hmn`), Hungarian (`hu`), Icelandic (`is`), Igbo (`ig`), Indonesian (`id`), Irish (`ga`), Italian (`it`), Japanese (`ja`), Javanese (`jw`), Kannada (`kn`), Kazakh (`kk`), Khmer (`km`), Korean (`ko`), Kurdish (`ku`), Kyrgyz (`ky`), Lao (`lo`), Latin (`la`), Latvian (`lv`), Lithuanian (`lt`), Luxembourgish (`lb`), Macedonian (`mk`), Malagasy (`mg`), Malay (`ms`), Malayalam (`ml`), Maltese (`mt`), Maori (`mi`), Marathi (`mr`), Mongolian (`mn`), Myanmar (`my`), Nepali (`ne`), Norwegian (`no`), Pashto (`ps`), Persian (`fa`), Polish (`pl`), Portuguese (`pt`), Punjabi (`pa`), Romanian (`ro`), Russian (`ru`), Samoan (`sm`), Scottish Gaelic (`gd`), Serbian (`sr`), Sesotho (`st`), Shona (`sn`), Sindhi (`sd`), Sinhala (`si`), Slovak (`sk`), Slovenian (`sl`), Somali (`so`), Spanish (`es`), Sundanese (`su`), Swahili (`sw`), Swedish (`sv`), Tajik (`tg`), Tamil (`ta`), Telugu (`te`), Thai (`th`), Turkish (`tr`), Ukrainian (`uk`), Urdu (`ur`), Uzbek (`uz`), Vietnamese (`vi`), Welsh (`cy`), Xhosa (`xh`), Yiddish (`yi`), Yoruba (`yo`), Zulu (`zu`).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/docwiser/react-gtranslate/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](https://github.com/docwiser/react-gtranslate/blob/main/LICENSE) for more information.

Developed with ❤️ by [DocWiser](https://github.com/docwiser).
