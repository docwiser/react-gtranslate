import React, { useState, useMemo } from 'react';
import { GTranslateGlobeProps, LanguageMeta } from '../types';
import { useGTranslate } from '../context/useGTranslate';
import { FlagIcon } from './FlagIcon';
import { BrandingFooter } from './BrandingFooter';
import { getLanguageMeta } from '../constants/languages';
import { formatLanguageLabel } from '../utils/formatLabel';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Globe, Check, Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const GTranslateGlobe: React.FC<GTranslateGlobeProps> = ({
  className = '',
  style,
  languages: propLanguages,
  nativeNames: propNativeNames,
  flagShape = 'rounded',
  flagSize = 'sm',
  hideFlags = false,
  labelFormat: propLabelFormat,
  enableSearch = true,
  showSearch,
  searchPlaceholder = 'Search language...',
  iconSize = 18,
  showCurrentCode = true,
  align = 'end',
  popoverClassName = '',
  showGoogleDisclaimer = false,
  showGenerousBranding = false,
  onLanguageChange,
  triggerProps,
  triggerClassName = '',
  triggerStyle,
  popoverProps,
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

  const handleSelect = (code: string) => {
    setLanguage(code);
    const meta = getLanguageMeta(code);
    onLanguageChange?.(code, meta);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          {...triggerProps}
          className={cn(
            'gap-1.5 border-input bg-background font-medium shadow-xs hover:bg-accent hover:text-accent-foreground',
            className,
            triggerClassName,
            triggerProps?.className
          )}
          style={{ ...style, ...triggerStyle, ...triggerProps?.style }}
          aria-label="Language selector"
        >
          <Globe style={{ width: iconSize, height: iconSize }} className="shrink-0 opacity-70" />
          {showCurrentCode && (
            <span className="text-xs font-semibold uppercase">{currentLanguage.slice(0, 2)}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        {...popoverProps}
        className={cn(
          'z-50 w-64 p-2 shadow-md',
          popoverClassName,
          popoverProps?.className
        )}
        style={{ ...popoverProps?.style }}
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
  );
};
