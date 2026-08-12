import React, { ReactNode } from 'react';
import { LabelFormat, LanguageMeta } from '../types';

/**
 * Renders a formatted label according to a template string or render function.
 * Supported variables:
 * - %n: English name (e.g., "Spanish")
 * - %N: Native name (e.g., "Español")
 * - %f: Country flag icon
 * - %c: Uppercase language code (e.g., "ES")
 * - %C: Lowercase language code (e.g., "es")
 */
export function formatLanguageLabel(
  format: LabelFormat | undefined,
  meta: LanguageMeta,
  flagElement: ReactNode,
  useNative = true
): ReactNode {
  if (typeof format === 'function') {
    return format(meta, flagElement);
  }

  if (typeof format === 'string' && format.trim().length > 0) {
    // Split template into parts preserving %n, %N, %f, %c, %C
    const parts = format.split(/(%[nNfcC])/g);

    return (
      <span
        className="rgt-formatted-label"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
      >
        {parts.map((part, index) => {
          switch (part) {
            case '%n':
              return <span key={index}>{meta.name}</span>;
            case '%N':
              return <span key={index}>{meta.nativeName}</span>;
            case '%f':
              return (
                <span
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    verticalAlign: 'middle',
                  }}
                >
                  {flagElement}
                </span>
              );
            case '%c':
              return <span key={index}>{meta.code.toUpperCase()}</span>;
            case '%C':
              return <span key={index}>{meta.code.toLowerCase()}</span>;
            default:
              return part ? <span key={index}>{part}</span> : null;
          }
        })}
      </span>
    );
  }

  // Default fallback layout
  return (
    <span
      className="rgt-label-default"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
    >
      {flagElement}
      <span>{useNative ? meta.nativeName : meta.name}</span>
    </span>
  );
}
