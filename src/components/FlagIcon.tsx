import React, { useMemo } from 'react';
import { FlagShape, FlagSize } from '../types';
import { getFlagSvg } from '../constants/flags';

export interface FlagIconProps {
  /** Language or flag code (e.g. 'en', 'es', 'fr', 'zh-CN') */
  code: string;
  /** Shape of the flag */
  shape?: FlagShape;
  /** Size preset or pixel value */
  size?: FlagSize;
  /** Custom CSS class */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Custom URL or generator */
  customUrl?: string | ((code: string) => string);
  /** Alt label */
  alt?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({
  code,
  shape = 'rounded',
  size = 'md',
  className = '',
  style,
  customUrl,
  alt,
}) => {
  if (shape === 'none') return null;

  // Resolve pixel dimensions
  const dimension = useMemo(() => {
    if (typeof size === 'number') {
      return { width: size, height: Math.round(size * 0.75) };
    }
    switch (size) {
      case 'sm':
        return { width: 18, height: 13 };
      case 'lg':
        return { width: 28, height: 21 };
      case 'md':
      default:
        return { width: 22, height: 16 };
    }
  }, [size]);

  // Radius for shapes
  const borderRadius = useMemo(() => {
    switch (shape) {
      case 'circle':
        return '50%';
      case 'square':
        return '0px';
      case 'rounded':
      default:
        return '3px';
    }
  }, [shape]);

  const flagSrc = useMemo(() => {
    if (typeof customUrl === 'function') {
      return customUrl(code);
    }
    if (typeof customUrl === 'string') {
      return customUrl.replace('{code}', code);
    }
    return null;
  }, [customUrl, code]);

  const svgContent = useMemo(() => {
    if (flagSrc) return null;
    return getFlagSvg(code);
  }, [flagSrc, code]);

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: shape === 'circle' ? dimension.height : dimension.width,
    height: dimension.height,
    borderRadius,
    overflow: 'hidden',
    flexShrink: 0,
    boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
    ...style,
  };

  if (flagSrc) {
    return (
      <img
        src={flagSrc}
        alt={alt || `${code} flag`}
        className={`rgt-flag ${className}`}
        style={{
          ...containerStyle,
          objectFit: 'cover',
        }}
        loading="lazy"
      />
    );
  }

  if (svgContent) {
    return (
      <span
        className={`rgt-flag ${className}`}
        style={containerStyle}
        aria-label={alt || `${code} flag`}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }

  return (
    <span
      className={`rgt-flag rgt-flag-placeholder ${className}`}
      style={{
        ...containerStyle,
        backgroundColor: '#e2e8f0',
        fontSize: '9px',
        fontWeight: 600,
        color: '#475569',
      }}
    >
      {code.toUpperCase().slice(0, 2)}
    </span>
  );
};
