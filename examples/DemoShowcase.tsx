import React, { useState, useMemo } from 'react';
import {
  GTranslateProvider,
  GTranslateDropdown,
  GTranslateDialog,
  GTranslateFloat,
  GTranslatePills,
  GTranslateGlobe,
  GTranslateCompact,
  useGTranslate,
  FlagIcon,
  DEFAULT_LANGUAGES,
  POPULAR_LANGUAGES,
  LanguageCode,
} from '../src';
import {
  Check,
  Copy,
  Globe,
  Code2,
  Sliders,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Terminal,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import '../src/styles/gtranslate.css';

type ComponentType =
  | 'GTranslateDropdown'
  | 'GTranslateDialog'
  | 'GTranslateFloat'
  | 'GTranslatePills'
  | 'GTranslateGlobe'
  | 'GTranslateCompact';

export function DemoShowcase() {
  const [activeTab, setActiveTab] = useState<'builder' | 'hook-builder' | 'gallery'>('builder');
  const [isDark, setIsDark] = useState(false);

  // Language subset mode
  const [languageMode, setLanguageMode] = useState<'all' | 'popular' | 'custom'>('all');
  const [customLanguages, setCustomLanguages] = useState<LanguageCode[]>([
    'en', 'es', 'fr', 'de', 'ja', 'zh-CN', 'ar', 'pt', 'hi', 'it', 'ko', 'ru'
  ]);

  // Selected Component in Tag Builder
  const [selectedComp, setSelectedComp] = useState<ComponentType>('GTranslateDropdown');

  // Shared Config Props
  const [enableSearch, setEnableSearch] = useState(true);
  const [labelFormat, setLabelFormat] = useState<string>('%n (%f, %N)');
  const [customLabelFormat, setCustomLabelFormat] = useState<string>('');
  const [flagShape, setFlagShape] = useState<'rounded' | 'circle' | 'square' | 'none'>('rounded');
  const [flagSize, setFlagSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [nativeNames, setNativeNames] = useState(true);
  const [showGoogleDisclaimer, setShowGoogleDisclaimer] = useState(false);
  const [showGenerousBranding, setShowGenerousBranding] = useState(false);
  const [rememberPreferences, setRememberPreferences] = useState(true);
  const [detectBrowserLanguage, setDetectBrowserLanguage] = useState(false);

  // Component Specific Props
  const [dialogColumns, setDialogColumns] = useState<2 | 3 | 4 | 5>(3);
  const [floatPosition, setFloatPosition] = useState<
    'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  >('bottom-right');
  const [pillsVariant, setPillsVariant] = useState<'segmented' | 'solid' | 'outline' | 'ghost'>('segmented');
  const [pillsDisplayMode, setPillsDisplayMode] = useState<'flag-name' | 'flag-code' | 'flag-only' | 'name-only'>('flag-name');
  const [globeShowCode, setGlobeShowCode] = useState(true);

  // Copy code state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeFormat = customLabelFormat.trim() || labelFormat;

  const currentLanguagesList = useMemo(() => {
    if (languageMode === 'popular') return POPULAR_LANGUAGES;
    if (languageMode === 'custom') return customLanguages;
    return undefined; // All 105+
  }, [languageMode, customLanguages]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate JSX string for the Tag Builder
  const generatedTagCode = useMemo(() => {
    const props: string[] = [];

    if (!enableSearch && selectedComp !== 'GTranslatePills' && selectedComp !== 'GTranslateCompact') {
      props.push('enableSearch={false}');
    }
    if (activeFormat) {
      props.push(`labelFormat="${activeFormat}"`);
    }
    if (flagShape !== 'rounded') {
      props.push(`flagShape="${flagShape}"`);
    }
    if (flagSize !== 'md') {
      props.push(`flagSize="${flagSize}"`);
    }
    if (!nativeNames) {
      props.push('nativeNames={false}');
    }
    if (showGoogleDisclaimer) {
      props.push('showGoogleDisclaimer={true}');
    }
    if (showGenerousBranding) {
      props.push('showGenerousBranding={true}');
    }

    if (languageMode === 'popular') {
      props.push(`languages={['en', 'es', 'fr', 'de', 'zh-CN', 'ja', 'ar', 'pt', 'ru', 'it']}`);
    }

    // Specific props
    if (selectedComp === 'GTranslateDialog' && dialogColumns !== 3) {
      props.push(`columns={${dialogColumns}}`);
    }
    if (selectedComp === 'GTranslateFloat') {
      if (floatPosition !== 'bottom-right') {
        props.push(`position="${floatPosition}"`);
      }
    }
    if (selectedComp === 'GTranslatePills') {
      if (pillsVariant !== 'segmented') {
        props.push(`variant="${pillsVariant}"`);
      }
      if (pillsDisplayMode !== 'flag-name') {
        props.push(`displayMode="${pillsDisplayMode}"`);
      }
    }
    if (selectedComp === 'GTranslateGlobe' && !globeShowCode) {
      props.push('showCurrentCode={false}');
    }

    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : ' ';
    return `import { ${selectedComp} } from 'react-gtranslate';
import 'react-gtranslate/styles.css';

export default function LanguageSwitcher() {
  return (
    <${selectedComp}${propsString}/>
  );
}`;
  }, [
    selectedComp,
    enableSearch,
    activeFormat,
    flagShape,
    flagSize,
    nativeNames,
    showGoogleDisclaimer,
    showGenerousBranding,
    languageMode,
    dialogColumns,
    floatPosition,
    pillsVariant,
    pillsDisplayMode,
    globeShowCode,
  ]);

  // Generate Hooks Code
  const generatedHooksCode = useMemo(() => {
    return `// 1. In your root layout/app:
import { GTranslateProvider } from 'react-gtranslate';
import 'react-gtranslate/styles.css';

export default function App({ children }) {
  return (
    <GTranslateProvider
      defaultLanguage="en"
      rememberPreferences={${rememberPreferences}}
      detectBrowserLanguage={${detectBrowserLanguage}}
      nativeNames={${nativeNames}}
      labelFormat="${activeFormat}"
    >
      {children}
    </GTranslateProvider>
  );
}

// 2. In any custom component (Headless hook):
import { useGTranslate, FlagIcon } from 'react-gtranslate';

export function CustomSwitcher() {
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
            className={\`px-2.5 py-1 text-xs rounded border transition-colors \${
              currentLanguage === lang.code
                ? 'bg-primary text-primary-foreground font-bold'
                : 'hover:bg-accent'
            }\`}
          >
            {lang.nativeName}
          </button>
        ))}
      </div>

      <button
        onClick={resetLanguage}
        className="text-xs text-muted-foreground underline ml-auto"
      >
        Reset
      </button>
    </div>
  );
}`;
  }, [
    rememberPreferences,
    detectBrowserLanguage,
    nativeNames,
    activeFormat,
  ]);

  return (
    <GTranslateProvider
      defaultLanguage="en"
      languages={currentLanguagesList}
      rememberPreferences={rememberPreferences}
      detectBrowserLanguage={detectBrowserLanguage}
      nativeNames={nativeNames}
      labelFormat={activeFormat}
    >
      <div
        className={isDark ? 'dark' : ''}
        style={{
          minHeight: '100vh',
          backgroundColor: isDark ? '#090d16' : '#f8fafc',
          color: isDark ? '#f8fafc' : '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Navigation Bar */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            backdropFilter: 'blur(12px)',
            backgroundColor: isDark ? 'rgba(9, 13, 22, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
            padding: '14px 24px',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                }}
              >
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    react-gtranslate
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      backgroundColor: isDark ? '#1e293b' : '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 700,
                    }}
                  >
                    shadcn/ui
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  105+ Languages • Zero API Keys • Real-time Translation
                </p>
              </div>
            </div>

            {/* Right Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Tab Selector */}
              <div
                style={{
                  display: 'inline-flex',
                  padding: '3px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                }}
              >
                <button
                  onClick={() => setActiveTab('builder')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'builder' ? (isDark ? '#0f172a' : '#ffffff') : 'transparent',
                    color: activeTab === 'builder' ? '#2563eb' : (isDark ? '#94a3b8' : '#64748b'),
                    boxShadow: activeTab === 'builder' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <Code2 className="h-4 w-4" />
                  Tag Builder
                </button>

                <button
                  onClick={() => setActiveTab('hook-builder')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'hook-builder' ? (isDark ? '#0f172a' : '#ffffff') : 'transparent',
                    color: activeTab === 'hook-builder' ? '#2563eb' : (isDark ? '#94a3b8' : '#64748b'),
                    boxShadow: activeTab === 'hook-builder' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  Hooks Builder
                </button>

                <button
                  onClick={() => setActiveTab('gallery')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'gallery' ? (isDark ? '#0f172a' : '#ffffff') : 'transparent',
                    color: activeTab === 'gallery' ? '#2563eb' : (isDark ? '#94a3b8' : '#64748b'),
                    boxShadow: activeTab === 'gallery' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <Layers className="h-4 w-4" />
                  All 6 Components
                </button>
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  cursor: 'pointer',
                }}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }}>
          {/* TAB 1: TAG BUILDER */}
          {activeTab === 'builder' && (
            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '32px', alignItems: 'start' }}>
              {/* Left Controls Column */}
              <div
                style={{
                  backgroundColor: isDark ? '#111827' : '#ffffff',
                  borderRadius: '16px',
                  border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <Sliders className="h-4 w-4 text-blue-500" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Tag Builder Controls</h3>
                </div>

                {/* 1. Choose Component */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    1. Choose Component
                  </label>
                  <select
                    value={selectedComp}
                    onChange={(e) => setSelectedComp(e.target.value as ComponentType)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <option value="GTranslateDropdown">GTranslateDropdown (Select Menu)</option>
                    <option value="GTranslateDialog">GTranslateDialog (Modal Dialog)</option>
                    <option value="GTranslateFloat">GTranslateFloat (Floating FAB)</option>
                    <option value="GTranslatePills">GTranslatePills (Segmented Tabs)</option>
                    <option value="GTranslateGlobe">GTranslateGlobe (Globe Popover)</option>
                    <option value="GTranslateCompact">GTranslateCompact (Compact Select)</option>
                  </select>
                </div>

                {/* 2. Languages Pool */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    2. Languages Pool ({languageMode === 'all' ? 'All 105+ Available' : languageMode === 'popular' ? '15 Popular' : `${customLanguages.length} Selected`})
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(['all', 'popular', 'custom'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setLanguageMode(m)}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: languageMode === m ? '1px solid #2563eb' : (isDark ? '1px solid #334155' : '1px solid #cbd5e1'),
                          backgroundColor: languageMode === m ? (isDark ? '#1e293b' : '#eff6ff') : 'transparent',
                          color: languageMode === m ? '#2563eb' : (isDark ? '#94a3b8' : '#475569'),
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                        }}
                      >
                        {m === 'all' ? 'All (105+)' : m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Label Format Template */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    3. Label Format (<code>labelFormat</code>)
                  </label>
                  <select
                    value={labelFormat}
                    onChange={(e) => {
                      setLabelFormat(e.target.value);
                      setCustomLabelFormat('');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '13px',
                      marginBottom: '6px',
                    }}
                  >
                    <option value="%n (%f, %N)">%n (%f, %N) — Spanish (🇪🇸, Español)</option>
                    <option value="%f %n">%f %n — 🇪🇸 Spanish</option>
                    <option value="%f %N">%f %N — 🇪🇸 Español</option>
                    <option value="%c - %N">%c - %N — ES - Español</option>
                    <option value="%f %c">%f %c — 🇪🇸 ES</option>
                    <option value="%c %f %n (%N)">%c %f %n (%N) — ES 🇪🇸 Spanish (Español)</option>
                  </select>

                  <input
                    type="text"
                    value={customLabelFormat}
                    onChange={(e) => setCustomLabelFormat(e.target.value)}
                    placeholder="Or type custom template: e.g. %f %N [%c]"
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '12px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Tokens: <code>%n</code>=English, <code>%N</code>=Native, <code>%f</code>=Flag, <code>%c</code>=Code
                  </span>
                </div>

                {/* 4. Flag Customizations */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>
                      Flag Shape
                    </label>
                    <select
                      value={flagShape}
                      onChange={(e) => setFlagShape(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        color: isDark ? '#f8fafc' : '#0f172a',
                        fontSize: '13px',
                      }}
                    >
                      <option value="rounded">Rounded</option>
                      <option value="circle">Circle</option>
                      <option value="square">Square</option>
                      <option value="none">None (Hide)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>
                      Flag Size
                    </label>
                    <select
                      value={flagSize}
                      onChange={(e) => setFlagSize(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        color: isDark ? '#f8fafc' : '#0f172a',
                        fontSize: '13px',
                      }}
                    >
                      <option value="sm">Small (18px)</option>
                      <option value="md">Medium (22px)</option>
                      <option value="lg">Large (28px)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Toggles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px', borderTop: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={enableSearch}
                      onChange={(e) => setEnableSearch(e.target.checked)}
                    />
                    <span>
                      <strong>enableSearch</strong> (Search filter)
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={nativeNames}
                      onChange={(e) => setNativeNames(e.target.checked)}
                    />
                    <span>
                      <strong>nativeNames</strong> (Native script)
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={showGoogleDisclaimer}
                      onChange={(e) => setShowGoogleDisclaimer(e.target.checked)}
                    />
                    <span>
                      <strong>showGoogleDisclaimer</strong> (Google Logo)
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={showGenerousBranding}
                      onChange={(e) => setShowGenerousBranding(e.target.checked)}
                    />
                    <span>
                      <strong>showGenerousBranding</strong> (NPM link)
                    </span>
                  </label>
                </div>

                {/* Component specific extras */}
                {selectedComp === 'GTranslateDialog' && (
                  <div style={{ paddingTop: '8px', borderTop: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>
                      Dialog Columns
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[2, 3, 4, 5].map((col) => (
                        <button
                          key={col}
                          onClick={() => setDialogColumns(col as any)}
                          style={{
                            flex: 1,
                            padding: '4px',
                            borderRadius: '6px',
                            border: dialogColumns === col ? '1px solid #2563eb' : (isDark ? '1px solid #334155' : '1px solid #cbd5e1'),
                            backgroundColor: dialogColumns === col ? '#2563eb' : 'transparent',
                            color: dialogColumns === col ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {col} cols
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedComp === 'GTranslateFloat' && (
                  <div style={{ paddingTop: '8px', borderTop: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>
                      Float Position
                    </label>
                    <select
                      value={floatPosition}
                      onChange={(e) => setFloatPosition(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        color: isDark ? '#f8fafc' : '#0f172a',
                        fontSize: '13px',
                      }}
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>
                )}

                {selectedComp === 'GTranslatePills' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px', borderTop: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>
                        Pill Variant
                      </label>
                      <select
                        value={pillsVariant}
                        onChange={(e) => setPillsVariant(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                          backgroundColor: isDark ? '#0f172a' : '#ffffff',
                          color: isDark ? '#f8fafc' : '#0f172a',
                          fontSize: '13px',
                        }}
                      >
                        <option value="segmented">Segmented Tabs</option>
                        <option value="solid">Solid Buttons</option>
                        <option value="outline">Outline Buttons</option>
                        <option value="ghost">Ghost Buttons</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>
                        Display Mode
                      </label>
                      <select
                        value={pillsDisplayMode}
                        onChange={(e) => setPillsDisplayMode(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                          backgroundColor: isDark ? '#0f172a' : '#ffffff',
                          color: isDark ? '#f8fafc' : '#0f172a',
                          fontSize: '13px',
                        }}
                      >
                        <option value="flag-name">Flag + Name</option>
                        <option value="flag-code">Flag + ISO Code</option>
                        <option value="flag-only">Flag Only</option>
                        <option value="name-only">Name Only</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Output Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 1. Live Interactive Preview */}
                <div
                  style={{
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    padding: '28px',
                    boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Live Component Preview</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                        Interact with your customized component below:
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: isDark ? '#1e293b' : '#eff6ff',
                        color: '#2563eb',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {selectedComp}
                    </span>
                  </div>

                  <div
                    style={{
                      minHeight: '140px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px',
                      borderRadius: '12px',
                      backgroundColor: isDark ? '#090d16' : '#f8fafc',
                      border: isDark ? '1px dashed #334155' : '1px dashed #cbd5e1',
                    }}
                  >
                    {selectedComp === 'GTranslateDropdown' && (
                      <GTranslateDropdown
                        enableSearch={enableSearch}
                        labelFormat={activeFormat}
                        flagShape={flagShape}
                        flagSize={flagSize}
                        nativeNames={nativeNames}
                        showGoogleDisclaimer={showGoogleDisclaimer}
                        showGenerousBranding={showGenerousBranding}
                      />
                    )}

                    {selectedComp === 'GTranslateDialog' && (
                      <GTranslateDialog
                        enableSearch={enableSearch}
                        labelFormat={activeFormat}
                        flagShape={flagShape}
                        flagSize={flagSize}
                        columns={dialogColumns}
                        nativeNames={nativeNames}
                        showGoogleDisclaimer={showGoogleDisclaimer}
                        showGenerousBranding={showGenerousBranding}
                      />
                    )}

                    {selectedComp === 'GTranslateFloat' && (
                      <div>
                        <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                          (Docked at {floatPosition} of your screen)
                        </span>
                        <GTranslateFloat
                          position={floatPosition}
                          enableSearch={enableSearch}
                          labelFormat={activeFormat}
                          flagShape={flagShape}
                          flagSize={flagSize}
                          nativeNames={nativeNames}
                          showGoogleDisclaimer={showGoogleDisclaimer}
                          showGenerousBranding={showGenerousBranding}
                        />
                      </div>
                    )}

                    {selectedComp === 'GTranslatePills' && (
                      <GTranslatePills
                        variant={pillsVariant}
                        displayMode={pillsDisplayMode}
                        labelFormat={activeFormat}
                        flagShape={flagShape}
                        flagSize={flagSize}
                        nativeNames={nativeNames}
                        showGoogleDisclaimer={showGoogleDisclaimer}
                        showGenerousBranding={showGenerousBranding}
                      />
                    )}

                    {selectedComp === 'GTranslateGlobe' && (
                      <GTranslateGlobe
                        enableSearch={enableSearch}
                        labelFormat={activeFormat}
                        flagShape={flagShape}
                        flagSize={flagSize}
                        showCurrentCode={globeShowCode}
                        nativeNames={nativeNames}
                        showGoogleDisclaimer={showGoogleDisclaimer}
                        showGenerousBranding={showGenerousBranding}
                      />
                    )}

                    {selectedComp === 'GTranslateCompact' && (
                      <GTranslateCompact
                        labelFormat={activeFormat}
                        flagShape={flagShape}
                        flagSize={flagSize}
                        nativeNames={nativeNames}
                        showGoogleDisclaimer={showGoogleDisclaimer}
                        showGenerousBranding={showGenerousBranding}
                      />
                    )}
                  </div>
                </div>

                {/* 2. Generated Code Output with 1-Click Copy */}
                <div
                  style={{
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 20px',
                      backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                      borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Terminal className="h-4 w-4 text-emerald-500" />
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>Ready-to-Use React Component</span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(generatedTagCode, 'tag-code')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: copiedKey === 'tag-code' ? '#10b981' : '#2563eb',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      {copiedKey === 'tag-code' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedKey === 'tag-code' ? 'Copied to Clipboard!' : 'Copy Code'}
                    </button>
                  </div>

                  <pre
                    style={{
                      margin: 0,
                      padding: '20px',
                      backgroundColor: isDark ? '#030712' : '#0f172a',
                      color: '#38bdf8',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      overflowX: 'auto',
                      fontFamily: 'Consolas, Monaco, monospace',
                    }}
                  >
                    <code>{generatedTagCode}</code>
                  </pre>
                </div>

                {/* 3. Quick Installation Guide */}
                <div
                  style={{
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Installation Command
                    </span>
                    <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 600, color: '#2563eb', marginTop: '2px' }}>
                      npm install react-gtranslate
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard('npm install react-gtranslate', 'npm-install')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedKey === 'npm-install' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedKey === 'npm-install' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOOKS & PROVIDER BUILDER */}
          {activeTab === 'hook-builder' && (
            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '32px', alignItems: 'start' }}>
              {/* Left Controls Column */}
              <div
                style={{
                  backgroundColor: isDark ? '#111827' : '#ffffff',
                  borderRadius: '16px',
                  border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Hooks & Provider Builder</h3>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    Provider Settings
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={rememberPreferences}
                        onChange={(e) => setRememberPreferences(e.target.checked)}
                      />
                      <span>
                        <strong>rememberPreferences</strong> (Save in localStorage)
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={detectBrowserLanguage}
                        onChange={(e) => setDetectBrowserLanguage(e.target.checked)}
                      />
                      <span>
                        <strong>detectBrowserLanguage</strong> (Auto-detect visitor)
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={nativeNames}
                        onChange={(e) => setNativeNames(e.target.checked)}
                      />
                      <span>
                        <strong>nativeNames</strong> (Native script names)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Info Box */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    backgroundColor: isDark ? '#1e293b' : '#eff6ff',
                    border: isDark ? '1px solid #334155' : '1px solid #bfdbfe',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 600, color: '#2563eb' }}>
                    💡 What does <code>useGTranslate()</code> return?
                  </p>
                  <ul style={{ margin: '8px 0 0', paddingLeft: '20px', color: isDark ? '#94a3b8' : '#334155' }}>
                    <li><code>currentLanguage</code>: active code (e.g. 'es')</li>
                    <li><code>currentLanguageMeta</code>: name, flagCode</li>
                    <li><code>setLanguage(code)</code>: change language</li>
                    <li><code>resetLanguage()</code>: reset to default</li>
                    <li><code>availableLanguages</code>: all languages</li>
                    <li><code>isLoading</code>: translation progress</li>
                  </ul>
                </div>
              </div>

              {/* Right Output Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Live Custom Component Demo using useGTranslate */}
                <div
                  style={{
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    padding: '28px',
                    boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                  }}
                >
                  <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700 }}>
                    Live Custom Component (Built with <code>useGTranslate()</code>)
                  </h4>
                  <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748b' }}>
                    This entire custom widget is powered purely by the headless hook:
                  </p>

                  <CustomHookDemonstrator />
                </div>

                {/* Generated Hook Code Box */}
                <div
                  style={{
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 20px',
                      backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                      borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Code2 className="h-4 w-4 text-purple-500" />
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>Provider Setup & Hook Usage Code</span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(generatedHooksCode, 'hook-code')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: copiedKey === 'hook-code' ? '#10b981' : '#2563eb',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {copiedKey === 'hook-code' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedKey === 'hook-code' ? 'Copied to Clipboard!' : 'Copy Hook Code'}
                    </button>
                  </div>

                  <pre
                    style={{
                      margin: 0,
                      padding: '20px',
                      backgroundColor: isDark ? '#030712' : '#0f172a',
                      color: '#a78bfa',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      overflowX: 'auto',
                      fontFamily: 'Consolas, Monaco, monospace',
                    }}
                  >
                    <code>{generatedHooksCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ALL 6 COMPONENTS GALLERY */}
          {activeTab === 'gallery' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px' }}>
                  All 6 shadcn/ui Components Gallery
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                  Showing all 105+ supported languages and live real-time translation across all variations:
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                  gap: '24px',
                }}
              >
                {/* 1. Dropdown */}
                <div
                  style={{
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    padding: '24px',
                  }}
                >
                  <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>1. GTranslateDropdown</h4>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                    Select dropdown with search, native names, and flags.
                  </p>
                  <GTranslateDropdown
                    enableSearch={enableSearch}
                    labelFormat={activeFormat}
                    flagShape={flagShape}
                    flagSize={flagSize}
                    showGoogleDisclaimer={showGoogleDisclaimer}
                    showGenerousBranding={showGenerousBranding}
                  />
                </div>

                {/* 2. Dialog */}
                <div
                  style={{
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    padding: '24px',
                  }}
                >
                  <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>2. GTranslateDialog</h4>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                    Accessible modal dialog with searchable grid of cards.
                  </p>
                  <GTranslateDialog
                    enableSearch={enableSearch}
                    labelFormat={activeFormat}
                    flagShape={flagShape}
                    flagSize={flagSize}
                    columns={3}
                    showGoogleDisclaimer={showGoogleDisclaimer}
                    showGenerousBranding={showGenerousBranding}
                  />
                </div>

                {/* 3. Pills */}
                <div
                  style={{
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    padding: '24px',
                  }}
                >
                  <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>3. GTranslatePills</h4>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                    Inline segmented tabs for navbars and headers.
                  </p>
                  <GTranslatePills
                    variant="segmented"
                    displayMode="flag-name"
                    languages={['en', 'es', 'fr', 'de', 'zh-CN', 'ja']}
                    labelFormat={activeFormat}
                    showGoogleDisclaimer={showGoogleDisclaimer}
                    showGenerousBranding={showGenerousBranding}
                  />
                </div>

                {/* 4. Globe */}
                <div
                  style={{
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    padding: '24px',
                  }}
                >
                  <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>4. GTranslateGlobe</h4>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                    Minimalist globe icon trigger + flyout popover menu.
                  </p>
                  <GTranslateGlobe
                    enableSearch={enableSearch}
                    labelFormat={activeFormat}
                    flagShape={flagShape}
                    flagSize={flagSize}
                    showGoogleDisclaimer={showGoogleDisclaimer}
                    showGenerousBranding={showGenerousBranding}
                  />
                </div>

                {/* 5. Compact */}
                <div
                  style={{
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    padding: '24px',
                  }}
                >
                  <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>5. GTranslateCompact</h4>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                    Ultra-compact select switcher with customizable label.
                  </p>
                  <GTranslateCompact
                    labelFormat={activeFormat}
                    flagShape={flagShape}
                    flagSize={flagSize}
                    showGoogleDisclaimer={showGoogleDisclaimer}
                    showGenerousBranding={showGenerousBranding}
                  />
                </div>

                {/* 6. Float */}
                <div
                  style={{
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    padding: '24px',
                  }}
                >
                  <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>6. GTranslateFloat</h4>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                    Floating Action Button (docked at screen corner).
                  </p>
                  <GTranslateFloat
                    position="bottom-right"
                    enableSearch={enableSearch}
                    labelFormat={activeFormat}
                    flagShape={flagShape}
                    flagSize={flagSize}
                    showGoogleDisclaimer={showGoogleDisclaimer}
                    showGenerousBranding={showGenerousBranding}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </GTranslateProvider>
  );
}

/**
 * Custom Demonstrator for useGTranslate hook
 */
function CustomHookDemonstrator() {
  const {
    currentLanguage,
    currentLanguageMeta,
    setLanguage,
    availableLanguages,
    isLoading,
    resetLanguage,
  } = useGTranslate();

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: 'rgba(37, 99, 235, 0.04)',
        border: '1px solid rgba(37, 99, 235, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FlagIcon code={currentLanguageMeta.flagCode} size="lg" shape="circle" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              {currentLanguageMeta.nativeName} ({currentLanguageMeta.name})
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              ISO Code: <code>{currentLanguage}</code>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isLoading && (
            <span style={{ fontSize: '12px', color: '#eab308', fontWeight: 600 }}>
              Translating...
            </span>
          )}
          <button
            onClick={resetLanguage}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reset to Default
          </button>
        </div>
      </div>

      {/* Quick Language Switcher Grid */}
      <div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' }}>
          Switch Language Instantly:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {availableLanguages.slice(0, 12).map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: lang.code === currentLanguage ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: lang.code === currentLanguage ? '#2563eb' : '#ffffff',
                color: lang.code === currentLanguage ? '#ffffff' : '#0f172a',
                fontSize: '12px',
                fontWeight: lang.code === currentLanguage ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <FlagIcon code={lang.flagCode} size="sm" />
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
