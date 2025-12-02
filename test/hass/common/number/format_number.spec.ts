import {
  formatNumber,
  getDefaultFormatOptions,
  numberFormatToLocale,
} from '@hass/common/number/format_number';
import { NumberFormat } from '@hass/data/translations';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('format_number.ts', () => {
  describe('numberFormatToLocale', () => {
    it('should return correct locale for comma_decimal format', () => {
      const localeOptions = {
        number_format: NumberFormat.comma_decimal,
      } as any;
      const result = numberFormatToLocale(localeOptions);
      expect(result).to.deep.equal(['en-US', 'en']);
    });

    it('should return correct locale for decimal_comma format', () => {
      const localeOptions = {
        number_format: NumberFormat.decimal_comma,
      } as any;
      const result = numberFormatToLocale(localeOptions);
      expect(result).to.deep.equal(['de', 'es', 'it', 'bg']);
    });

    it('should return correct locale for space_comma format', () => {
      const localeOptions = {
        number_format: NumberFormat.space_comma,
      } as any;
      const result = numberFormatToLocale(localeOptions);
      expect(result).to.deep.equal(['fr', 'sv', 'cs']);
    });

    it('should return undefined for system format', () => {
      const localeOptions = { number_format: NumberFormat.system } as any;
      const result = numberFormatToLocale(localeOptions);
      expect(result).to.be.undefined;
    });

    it('should return language for other format values', () => {
      const localeOptions = {
        number_format: 'custom' as any,
        language: 'nl',
      } as any;
      const result = numberFormatToLocale(localeOptions);
      expect(result).to.equal('nl');
    });
  });

  describe('getDefaultFormatOptions', () => {
    it('should return default options for number input', () => {
      const options = getDefaultFormatOptions(123.45);
      expect(options).to.deep.equal({
        maximumFractionDigits: 2,
      });
    });

    it('should merge provided options for number input', () => {
      const options = getDefaultFormatOptions(123.45, {
        style: 'currency',
        currency: 'USD',
      });
      expect(options).to.deep.equal({
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'USD',
      });
    });

    it('should set fraction digits based on string input', () => {
      const options = getDefaultFormatOptions('123.4500');
      expect(options).to.deep.equal({
        maximumFractionDigits: 4,
        minimumFractionDigits: 4,
      });
    });

    it('should respect provided fraction digits for string input', () => {
      const options = getDefaultFormatOptions('123.4500', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      });
      expect(options).to.deep.equal({
        maximumFractionDigits: 6,
        minimumFractionDigits: 2,
      });
    });

    it('should handle string input without decimals', () => {
      const options = getDefaultFormatOptions('123');
      expect(options).to.deep.equal({
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      });
    });
  });

  describe('formatNumber', () => {
    // Create a mock of Intl.NumberFormat to avoid locale-dependent tests
    let originalNumberFormat: typeof Intl.NumberFormat;
    let numberFormatMock: sinon.SinonStub;

    before(() => {
      originalNumberFormat = Intl.NumberFormat;
    });

    beforeEach(() => {
      // Mock implementation that returns a predictable result
      numberFormatMock = sinon
        .stub(Intl, 'NumberFormat')
        .callsFake((locale, options) => {
          return {
            format: (num: number) =>
              `formatted:${num}:${JSON.stringify(locale)}:${JSON.stringify(options)}`,
          } as any;
        });
    });

    afterEach(() => {
      numberFormatMock.restore();
    });

    after(() => {
      Intl.NumberFormat = originalNumberFormat;
    });

    it('should format numbers with the specified locale', () => {
      const localeOptions = {
        number_format: NumberFormat.comma_decimal,
      } as any;
      const result = formatNumber(123.45, localeOptions);
      expect(result).to.include('formatted:123.45:[\"en-US\",\"en\"]');
    });

    it('should handle string numbers', () => {
      const localeOptions = {
        number_format: NumberFormat.decimal_comma,
      } as any;
      const result = formatNumber('123.45', localeOptions);
      expect(result).to.include(
        'formatted:123.45:[\"de\",\"es\",\"it\",\"bg\"]',
      );
    });

    it('should return the original string for non-numeric strings', () => {
      const result = formatNumber('not-a-number');
      expect(result).to.equal('not-a-number');
    });

    it('should format with none number format and no grouping', () => {
      const localeOptions = { number_format: NumberFormat.none } as any;
      const result = formatNumber(1234.56, localeOptions);
      expect(result).to.include('"useGrouping":false');
    });

    it('should handle formatting with currency style', () => {
      const options = { style: 'currency', currency: 'USD' } as any;
      const result = formatNumber(123.45, undefined, options);
      expect(result).to.include('"style":"currency"');
      expect(result).to.include('"currency":"USD"');
    });
  });
});
