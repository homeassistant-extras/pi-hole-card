/**
 * https://github.com/home-assistant/frontend/blob/dev/src/common/number/format_number.ts
 */

import { NumberFormat, type FrontendLocaleData } from '@hass/data/translations';
import { round } from './round';

export const numberFormatToLocale = (
  localeOptions: FrontendLocaleData,
): string | string[] | undefined => {
  switch (localeOptions.number_format) {
    case NumberFormat.comma_decimal:
      return ['en-US', 'en']; // Use United States with fallback to English formatting 1,234,567.89
    case NumberFormat.decimal_comma:
      return ['de', 'es', 'it']; // Use German with fallback to Spanish then Italian formatting 1.234.567,89
    case NumberFormat.space_comma:
      return ['fr', 'sv', 'cs']; // Use French with fallback to Swedish and Czech formatting 1 234 567,89
    case NumberFormat.system:
      return undefined;
    default:
      return localeOptions.language;
  }
};

/**
 * Formats a number based on the user's preference with thousands separator(s) and decimal character for better legibility.
 *
 * @param num The number to format
 * @param localeOptions The user-selected language and formatting, from `hass.locale`
 * @param options Intl.NumberFormatOptions to use
 */
export const formatNumber = (
  num: string | number,
  localeOptions?: FrontendLocaleData,
  options?: Intl.NumberFormatOptions,
): string => {
  const locale = localeOptions
    ? numberFormatToLocale(localeOptions)
    : undefined;

  // Polyfill for Number.isNaN, which is more reliable than the global isNaN()
  Number.isNaN =
    Number.isNaN ||
    function isNaN(input): boolean {
      return typeof input === 'number' && isNaN(input);
    };

  if (
    localeOptions?.number_format !== NumberFormat.none &&
    !Number.isNaN(Number(num))
  ) {
    return new Intl.NumberFormat(
      locale,
      getDefaultFormatOptions(num, options),
    ).format(Number(num));
  }

  if (
    !Number.isNaN(Number(num)) &&
    num !== '' &&
    localeOptions?.number_format === NumberFormat.none
  ) {
    // If NumberFormat is none, use en-US format without grouping.
    return new Intl.NumberFormat(
      'en-US',
      getDefaultFormatOptions(num, {
        ...options,
        useGrouping: false,
      }),
    ).format(Number(num));
  }

  if (typeof num === 'string') {
    return num;
  }
  return `${round(num, options?.maximumFractionDigits).toString()}${
    options?.style === 'currency' ? ` ${options.currency}` : ''
  }`;
};

/**
 * Generates default options for Intl.NumberFormat
 * @param num The number to be formatted
 * @param options The Intl.NumberFormatOptions that should be included in the returned options
 */
export const getDefaultFormatOptions = (
  num: string | number,
  options?: Intl.NumberFormatOptions,
): Intl.NumberFormatOptions => {
  const defaultOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
    ...options,
  };

  if (typeof num !== 'string') {
    return defaultOptions;
  }

  // Keep decimal trailing zeros if they are present in a string numeric value
  if (
    !options ||
    (options.minimumFractionDigits === undefined &&
      options.maximumFractionDigits === undefined)
  ) {
    const digits = num.indexOf('.') > -1 ? num.split('.')[1]!.length : 0;
    defaultOptions.minimumFractionDigits = digits;
    defaultOptions.maximumFractionDigits = digits;
  }

  return defaultOptions;
};
