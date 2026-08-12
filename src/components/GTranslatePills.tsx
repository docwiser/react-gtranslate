import React, { useMemo } from 'react';
import { GTranslatePillsProps, LanguageMeta } from '../types';
import { useGTranslate } from '../context/useGTranslate';
import { FlagIcon } from './FlagIcon';
import { BrandingFooter } from './BrandingFooter';
import { getLanguageMeta, POPULAR_LANGUAGES } from '../constants/languages';
import { formatLanguageLabel } from '../utils/formatLabel';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export const GTranslatePills: React.FC<GTranslatePillsProps> = ({
  className = '',
  style,
  languages: propLanguages,
  nativeNames: propNativeNames,
  flagShape = 'rounded',
  flagSize = 'sm',
  hideFlags = false,
  labelFormat: propLabelFormat,
  variant = 'segmented',
  displayMode = 'flag-name',
  orientation = 'horizontal',
  gap = 4,
  showGoogleDisclaimer = false,
  showGenerousBranding = false,
  onLanguageChange,
  itemProps,
  itemClassName = '',
  itemStyle,
}) => {
  const {
    currentLanguage,
    setLanguage,
    availableLanguages: contextLanguages,
    nativeNames: contextNativeNames,
    labelFormat: contextLabelFormat,
    customFlagUrl,
  } = useGTranslate();

  const useNative = propNativeNames !== undefined ? propNativeNames : contextNativeNames;
  const activeLabelFormat = propLabelFormat !== undefined ? propLabelFormat : contextLabelFormat;

  const languageList = useMemo(() => {
    let list: LanguageMeta[];
    if (propLanguages && propLanguages.length > 0) {
      list = propLanguages.map((code) => getLanguageMeta(code));
    } else if (contextLanguages.length <= 10) {
      list = contextLanguages;
    } else {
      list = POPULAR_LANGUAGES.slice(0, 6).map((code) => getLanguageMeta(code));
    }
    return list;
  }, [contextLanguages, propLanguages]);

  const handleSelect = (code: string) => {
    setLanguage(code);
    const meta = getLanguageMeta(code);
    onLanguageChange?.(code, meta);
  };

  const isSegmented = variant === 'segmented';

  return (
    <div
      className={cn('inline-flex flex-col items-start', className)}
      style={style}
    >
      <div
        className={cn(
          'inline-flex items-center',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          isSegmented
            ? 'rounded-lg border border-border bg-muted p-1 text-muted-foreground'
            : 'gap-1.5'
        )}
        style={{
          gap: !isSegmented ? (typeof gap === 'number' ? `${gap}px` : gap) : undefined,
        }}
      >
        {languageList.map((lang) => {
          const isSelected = lang.code === currentLanguage;
          const showFlag = !hideFlags && displayMode !== 'name-only';
          const flagElement = showFlag ? (
            <FlagIcon
              code={lang.flagCode}
              shape={flagShape}
              size={flagSize}
              customUrl={customFlagUrl}
            />
          ) : null;

          if (isSegmented) {
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                aria-pressed={isSelected}
                {...itemProps}
                className={cn(
                  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                  isSelected
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'hover:bg-background/50 hover:text-foreground',
                  itemClassName,
                  itemProps?.className
                )}
                style={{ ...itemStyle, ...itemProps?.style }}
              >
                {activeLabelFormat ? (
                  formatLanguageLabel(activeLabelFormat, lang, flagElement, useNative)
                ) : (
                  <>
                    {flagElement}
                    {displayMode === 'flag-code' && (
                      <span>{lang.code.toUpperCase().slice(0, 2)}</span>
                    )}
                    {(displayMode === 'flag-name' || displayMode === 'name-only') && (
                      <span>{useNative ? lang.nativeName : lang.name}</span>
                    )}
                  </>
                )}
              </button>
            );
          }

          // Non-segmented button variants using shadcn Button
          const buttonVariant =
            variant === 'solid'
              ? isSelected
                ? 'default'
                : 'ghost'
              : variant === 'outline'
              ? isSelected
                ? 'default'
                : 'outline'
              : isSelected
              ? 'secondary'
              : 'ghost';

          return (
            <Button
              key={lang.code}
              variant={buttonVariant}
              size="sm"
              onClick={() => handleSelect(lang.code)}
              {...itemProps}
              className={cn(
                'h-8 gap-1.5 px-3 text-xs',
                itemClassName,
                itemProps?.className
              )}
              style={{ ...itemStyle, ...itemProps?.style }}
            >
              {activeLabelFormat ? (
                formatLanguageLabel(activeLabelFormat, lang, flagElement, useNative)
              ) : (
                <>
                  {flagElement}
                  {displayMode === 'flag-code' && (
                    <span>{lang.code.toUpperCase().slice(0, 2)}</span>
                  )}
                  {(displayMode === 'flag-name' || displayMode === 'name-only') && (
                    <span>{useNative ? lang.nativeName : lang.name}</span>
                  )}
                </>
              )}
            </Button>
          );
        })}
      </div>

      {/* Branding Footer */}
      <BrandingFooter
        showGoogleDisclaimer={showGoogleDisclaimer}
        showGenerousBranding={showGenerousBranding}
      />
    </div>
  );
};
