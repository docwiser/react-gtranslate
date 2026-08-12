import React, { useState, useMemo } from 'react';
import { GTranslateDialogProps, LanguageMeta } from '../types';
import { useGTranslate } from '../context/useGTranslate';
import { FlagIcon } from './FlagIcon';
import { BrandingFooter } from './BrandingFooter';
import { getLanguageMeta } from '../constants/languages';
import { formatLanguageLabel } from '../utils/formatLabel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Check, Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const GTranslateDialog: React.FC<GTranslateDialogProps> = ({
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
  title = 'Select Language',
  description = 'Choose your preferred language to translate the content.',
  searchPlaceholder = 'Search language or country...',
  trigger,
  maxWidth = '640px',
  columns = 3,
  dialogClassName = '',
  open: controlledOpen,
  onOpenChange,
  showGoogleDisclaimer = false,
  showGenerousBranding = false,
  onLanguageChange,
  triggerProps,
  triggerClassName = '',
  triggerStyle,
  overlayProps,
  dialogContentProps,
  searchProps,
  searchClassName = '',
  searchStyle,
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

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const setOpen = (val: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(val);
    }
    onOpenChange?.(val);
  };

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
    setOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
              'gap-2 border-input bg-background font-medium shadow-sm hover:bg-accent hover:text-accent-foreground',
              className,
              triggerClassName,
              triggerProps?.className
            )}
            style={{ ...style, ...triggerStyle, ...triggerProps?.style }}
          >
            {formatLanguageLabel(
              activeLabelFormat,
              currentMeta,
              currentFlagElement,
              useNative
            )}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        {...dialogContentProps}
        className={cn(
          'sm:max-w-[640px] max-h-[85vh] flex flex-col p-6',
          dialogClassName,
          dialogContentProps?.className
        )}
        style={{
          maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          ...dialogContentProps?.style,
        }}
      >
        <DialogHeader className="text-left mb-2">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Search Bar */}
        {isSearchActive && (
          <div className="relative flex items-center rounded-md border border-input bg-background px-3 py-1 shadow-sm">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              autoFocus
              {...searchProps}
              className={cn(
                'h-8 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0',
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
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Language Grid */}
        <div
          className={cn(
            'flex-1 overflow-y-auto grid gap-2 py-2 pr-1',
            columns === 2 && 'grid-cols-2',
            columns === 3 && 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
            columns === 4 && 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
            columns === 5 && 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
          )}
        >
          {filteredLanguages.length === 0 ? (
            <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
              No matching languages found
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
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  {...itemProps}
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-md border p-2.5 text-left text-xs transition-all hover:bg-accent hover:text-accent-foreground',
                    isSelected
                      ? 'border-primary bg-primary/5 font-semibold text-primary shadow-xs'
                      : 'border-border bg-card text-card-foreground',
                    itemClassName,
                    itemProps?.className
                  )}
                  style={{ ...itemStyle, ...itemProps?.style }}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {formatLanguageLabel(activeLabelFormat, lang, flagElement, useNative)}
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                </button>
              );
            })
          )}
        </div>

        {/* Branding Footer */}
        <BrandingFooter
          showGoogleDisclaimer={showGoogleDisclaimer}
          showGenerousBranding={showGenerousBranding}
        />
      </DialogContent>
    </Dialog>
  );
};
