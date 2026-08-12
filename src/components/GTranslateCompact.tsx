import React, { useMemo } from 'react';
import { GTranslateCompactProps, LanguageMeta } from '../types';
import { useGTranslate } from '../context/useGTranslate';
import { FlagIcon } from './FlagIcon';
import { BrandingFooter } from './BrandingFooter';
import { getLanguageMeta } from '../constants/languages';
import { formatLanguageLabel } from '../utils/formatLabel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from './ui/select';
import { cn } from '../lib/utils';

export const GTranslateCompact: React.FC<GTranslateCompactProps> = ({
  className = '',
  style,
  languages: propLanguages,
  nativeNames: propNativeNames,
  flagShape = 'rounded',
  flagSize = 'sm',
  hideFlags = false,
  labelFormat: propLabelFormat,
  showFlag = true,
  showCode = true,
  showName = false,
  showGoogleDisclaimer = false,
  showGenerousBranding = false,
  onLanguageChange,
  triggerProps,
  triggerClassName = '',
  triggerStyle,
  menuProps,
  menuClassName = '',
  menuStyle,
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
    let list: LanguageMeta[] = contextLanguages;
    if (propLanguages && propLanguages.length > 0) {
      list = propLanguages.map((code) => getLanguageMeta(code));
    }
    return list;
  }, [contextLanguages, propLanguages]);

  const currentMeta = useMemo(() => {
    return getLanguageMeta(currentLanguage);
  }, [currentLanguage]);

  const handleValueChange = (code: string) => {
    setLanguage(code);
    const meta = getLanguageMeta(code);
    onLanguageChange?.(code, meta);
  };

  const currentFlagElement = !hideFlags && showFlag ? (
    <FlagIcon
      code={currentMeta.flagCode}
      shape={flagShape}
      size={flagSize}
      customUrl={customFlagUrl}
    />
  ) : null;

  return (
    <div
      className={cn('inline-flex flex-col items-start', className)}
      style={style}
    >
      <Select value={currentLanguage} onValueChange={handleValueChange}>
        <SelectTrigger
          {...triggerProps}
          className={cn(
            'h-8 gap-2 border-input bg-background px-2.5 py-1 text-xs font-semibold shadow-xs hover:bg-accent hover:text-accent-foreground',
            triggerClassName,
            triggerProps?.className
          )}
          style={{ ...triggerStyle, ...triggerProps?.style }}
        >
          <div className="flex items-center gap-1.5 overflow-hidden">
            {activeLabelFormat ? (
              formatLanguageLabel(
                activeLabelFormat,
                currentMeta,
                currentFlagElement,
                useNative
              )
            ) : (
              <>
                {currentFlagElement}
                <span>
                  {showName
                    ? useNative
                      ? currentMeta.nativeName
                      : currentMeta.name
                    : currentMeta.code.toUpperCase().slice(0, 2)}
                </span>
              </>
            )}
          </div>
        </SelectTrigger>

        <SelectContent
          {...menuProps}
          className={cn(
            'z-50 max-h-56 min-w-[150px]',
            menuClassName,
            menuProps?.className
          )}
          style={{ ...menuStyle, ...menuProps?.style }}
        >
          {languageList.map((lang) => {
            const flagElement = !hideFlags && showFlag ? (
              <FlagIcon
                code={lang.flagCode}
                shape={flagShape}
                size={flagSize}
                customUrl={customFlagUrl}
              />
            ) : null;

            return (
              <SelectItem
                key={lang.code}
                value={lang.code}
                {...(itemProps as any)}
                className={cn('text-xs', itemClassName, itemProps?.className)}
                style={{ ...itemStyle, ...itemProps?.style }}
              >
                <div className="flex items-center gap-2">
                  {activeLabelFormat ? (
                    formatLanguageLabel(activeLabelFormat, lang, flagElement, useNative)
                  ) : (
                    <>
                      {flagElement}
                      <span>
                        {showName
                          ? useNative
                            ? lang.nativeName
                            : lang.name
                          : `${lang.code.toUpperCase().slice(0, 2)} - ${lang.name}`}
                      </span>
                    </>
                  )}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Branding Footer */}
      <BrandingFooter
        showGoogleDisclaimer={showGoogleDisclaimer}
        showGenerousBranding={showGenerousBranding}
      />
    </div>
  );
};
