import React, { useState, useMemo } from 'react';
import { GTranslateDropdownProps, LanguageMeta } from '../types';
import { useGTranslate } from '../context/useGTranslate';
import { FlagIcon } from './FlagIcon';
import { BrandingFooter } from './BrandingFooter';
import { getLanguageMeta } from '../constants/languages';
import { formatLanguageLabel } from '../utils/formatLabel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const GTranslateDropdown: React.FC<GTranslateDropdownProps> = ({
  className = '',
  style,
  languages: propLanguages,
  defaultLanguage,
  nativeNames: propNativeNames,
  flagShape = 'rounded',
  flagSize = 'md',
  hideFlags = false,
  labelFormat: propLabelFormat,
  enableSearch = true,
  showSearch,
  searchPlaceholder = 'Search language...',
  align = 'start',
  maxHeight = 280,
  trigger,
  showGoogleDisclaimer = false,
  showGenerousBranding = false,
  placeholder = 'Select Language',
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

  // Filter languages
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

  const currentFlagElement = !hideFlags ? (
    <FlagIcon
      code={currentMeta.flagCode}
      shape={flagShape}
      size={flagSize}
      customUrl={customFlagUrl}
    />
  ) : null;

  return (
    <div className={cn('relative inline-block', className)} style={style}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          {trigger ? (
            typeof trigger === 'function' ? (
              <div>{trigger(currentMeta)}</div>
            ) : (
              <div>{trigger}</div>
            )
          ) : (
            <Button
              variant="outline"
              {...triggerProps}
              className={cn(
                'min-w-[170px] justify-between gap-2 border-input bg-background font-medium shadow-sm hover:bg-accent hover:text-accent-foreground',
                triggerClassName,
                triggerProps?.className
              )}
              style={{ ...triggerStyle, ...triggerProps?.style }}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {formatLanguageLabel(
                  activeLabelFormat,
                  currentMeta,
                  currentFlagElement,
                  useNative
                )}
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 opacity-50 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </Button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          {...menuProps}
          className={cn(
            'z-50 min-w-[220px] max-w-[320px] p-1.5 shadow-md',
            menuClassName,
            menuProps?.className
          )}
          style={{ ...menuStyle, ...menuProps?.style }}
        >
          {/* Search Box */}
          {isSearchActive && (
            <div className="relative mb-1 flex items-center border-b border-border px-2 pb-1.5 pt-1">
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
                  className="ml-1 opacity-50 hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          {/* List of Languages */}
          <div
            className="flex flex-col gap-0.5 overflow-y-auto"
            style={{
              maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
            }}
          >
            {filteredLanguages.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground">
                No language found
              </div>
            ) : (
              filteredLanguages.map((lang) => {
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
                  <DropdownMenuItem
                    key={lang.code}
                    onSelect={() => handleSelect(lang.code)}
                    {...(itemProps as any)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-xs transition-colors',
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
                  </DropdownMenuItem>
                );
              })
            )}
          </div>

          {/* Branding & Google Disclaimer */}
          <BrandingFooter
            showGoogleDisclaimer={showGoogleDisclaimer}
            showGenerousBranding={showGenerousBranding}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
