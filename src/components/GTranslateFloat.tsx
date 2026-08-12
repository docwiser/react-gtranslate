import React, { useState, useMemo } from 'react';
import { FloatPosition, GTranslateFloatProps, LanguageMeta } from '../types';
import { useGTranslate } from '../context/useGTranslate';
import { FlagIcon } from './FlagIcon';
import { BrandingFooter } from './BrandingFooter';
import { getLanguageMeta } from '../constants/languages';
import { formatLanguageLabel } from '../utils/formatLabel';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChevronUp, Check, Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const GTranslateFloat: React.FC<GTranslateFloatProps> = ({
  className = '',
  style,
  languages: propLanguages,
  nativeNames: propNativeNames,
  flagShape = 'rounded',
  flagSize = 'md',
  hideFlags = false,
  labelFormat: propLabelFormat,
  enableSearch = true,
  showSearch,
  searchPlaceholder = 'Search language...',
  position = 'bottom-right',
  offsetX = 20,
  offsetY = 20,
  zIndex = 999999,
  variant = 'popup',
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
  searchProps,
  searchClassName = '',
  searchStyle,
}) => {
  const {
    currentLanguage,
    setLanguage,
    availableLanguages: contextLanguages,
    nativeNames: contextNativeNames,
    labelFormat: contextLabelFormat,
    customFlagUrl,
  } = useGTranslate();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const useNative = propNativeNames !== undefined ? propNativeNames : contextNativeNames;
  const activeLabelFormat = propLabelFormat !== undefined ? propLabelFormat : contextLabelFormat;
  const isSearchActive = showSearch !== undefined ? showSearch : enableSearch;

  const languageList = useMemo(() => {
    let list: LanguageMeta[] = contextLanguages;
    if (propLanguages && propLanguages.length > 0) {
      list = propLanguages.map((code) => getLanguageMeta(code));
    }
    return list;
  }, [contextLanguages, propLanguages]);

  const filteredLanguages = useMemo(() => {
    if (!isSearchActive || !searchQuery.trim()) return languageList;
    const query = searchQuery.toLowerCase().trim();
    return languageList.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
    );
  }, [languageList, searchQuery, isSearchActive]);

  const currentMeta = useMemo(() => {
    return getLanguageMeta(currentLanguage);
  }, [currentLanguage]);

  const handleSelect = (code: string) => {
    setLanguage(code);
    const meta = getLanguageMeta(code);
    onLanguageChange?.(code, meta);
    setIsOpen(false);
    setSearchQuery('');
  };

  const positionStyles: React.CSSProperties = useMemo(() => {
    const s: React.CSSProperties = {
      position: 'fixed',
      zIndex,
    };
    const xVal = typeof offsetX === 'number' ? `${offsetX}px` : offsetX;
    const yVal = typeof offsetY === 'number' ? `${offsetY}px` : offsetY;

    switch (position) {
      case 'bottom-right':
        s.bottom = yVal;
        s.right = xVal;
        break;
      case 'bottom-left':
        s.bottom = yVal;
        s.left = xVal;
        break;
      case 'top-right':
        s.top = yVal;
        s.right = xVal;
        break;
      case 'top-left':
        s.top = yVal;
        s.left = xVal;
        break;
      case 'bottom-center':
        s.bottom = yVal;
        s.left = '50%';
        s.transform = 'translateX(-50%)';
        break;
      case 'top-center':
        s.top = yVal;
        s.left = '50%';
        s.transform = 'translateX(-50%)';
        break;
    }
    return s;
  }, [position, offsetX, offsetY, zIndex]);

  const currentFlagElement = !hideFlags ? (
    <FlagIcon
      code={currentMeta.flagCode}
      shape={flagShape}
      size={flagSize}
      customUrl={customFlagUrl}
    />
  ) : null;

  return (
    <div style={{ ...positionStyles, ...style }} className={cn('z-50', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            {...triggerProps}
            className={cn(
              'h-11 rounded-full border-input bg-background px-4 py-2 text-sm font-semibold shadow-lg hover:bg-accent hover:text-accent-foreground',
              triggerClassName,
              triggerProps?.className
            )}
            style={{ ...triggerStyle, ...triggerProps?.style }}
          >
            <div className="flex items-center gap-2">
              {formatLanguageLabel(
                activeLabelFormat,
                currentMeta,
                currentFlagElement,
                useNative
              )}
            </div>
            <ChevronUp
              className={cn(
                'ml-1 h-4 w-4 opacity-60 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side={position.startsWith('top') ? 'bottom' : 'top'}
          align={position.includes('left') ? 'start' : 'end'}
          {...menuProps}
          className={cn(
            'z-50 w-64 p-2 shadow-xl',
            menuClassName,
            menuProps?.className
          )}
          style={{ ...menuStyle, ...menuProps?.style }}
        >
          {isSearchActive && (
            <div className="relative mb-1 flex items-center border-b border-border px-2 pb-1.5 pt-0.5">
              <Search className="mr-2 h-3.5 w-3.5 shrink-0 opacity-50" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
                {...searchProps}
                className={cn(
                  'h-7 border-none bg-transparent p-0 text-xs shadow-none focus-visible:ring-0',
                  searchClassName,
                  searchProps?.className
                )}
                style={{ ...searchStyle, ...searchProps?.style }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="opacity-50 hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          <div className="flex max-h-56 flex-col gap-0.5 overflow-y-auto pr-0.5">
            {filteredLanguages.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              const flagElement = !hideFlags ? (
                <FlagIcon
                  code={lang.flagCode}
                  shape={flagShape}
                  size={flagSize}
                  customUrl={customFlagUrl}
                />
              ) : null;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  {...itemProps}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-xs text-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                    isSelected && 'bg-accent font-semibold text-accent-foreground',
                    itemClassName,
                    itemProps?.className
                  )}
                  style={{ ...itemStyle, ...itemProps?.style }}
                >
                  <div className="flex items-center gap-2">
                    {formatLanguageLabel(activeLabelFormat, lang, flagElement, useNative)}
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              );
            })}
          </div>

          {/* Branding Footer */}
          <BrandingFooter
            showGoogleDisclaimer={showGoogleDisclaimer}
            showGenerousBranding={showGenerousBranding}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
