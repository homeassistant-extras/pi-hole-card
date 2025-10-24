import { round } from '@hass/common/number/round';
import { expect } from 'chai';

describe('round.ts', () => {
  it('should round to 2 decimal places by default', () => {
    expect(round(3.14159)).to.equal(3.14);
    expect(round(2.71828)).to.equal(2.72);
    expect(round(1.999)).to.equal(2);
    expect(round(0.123456)).to.equal(0.12);
    expect(round(5.555)).to.equal(5.56);
  });

  it('should round to specified precision', () => {
    expect(round(3.14159, 3)).to.equal(3.142);
    expect(round(2.71828, 1)).to.equal(2.7);
    expect(round(1.999, 0)).to.equal(2);
    expect(round(0.123456, 4)).to.equal(0.1235);
    expect(round(5.555, 2)).to.equal(5.56);
  });

  it('should handle negative numbers', () => {
    expect(round(-3.14159)).to.equal(-3.14);
    expect(round(-2.71828, 3)).to.equal(-2.718);
    expect(round(-1.999, 0)).to.equal(-2);
    expect(round(-0.123456, 4)).to.equal(-0.1235);
    expect(round(-5.555, 1)).to.equal(-5.6);
  });

  it('should handle zero', () => {
    expect(round(0)).to.equal(0);
    expect(round(0, 5)).to.equal(0);
  });

  it('should handle very large numbers', () => {
    expect(round(1234567.89, 2)).to.equal(1234567.89);
    expect(round(9876543.21098, 3)).to.equal(9876543.211);
  });

  it('should handle very small numbers', () => {
    expect(round(0.000123456, 5)).to.equal(0.00012);
    expect(round(0.000987654, 7)).to.equal(0.0009877);
  });

  it('should handle edge cases with rounding', () => {
    // Testing rounding behavior for numbers exactly halfway between two possible results
    expect(round(0.5, 0)).to.equal(1); // Standard round: 0.5 rounds up to 1
    expect(round(1.5, 0)).to.equal(2);
    expect(round(2.5, 0)).to.equal(3);

    expect(round(0.05, 1)).to.equal(0.1); // 0.05 rounds up to 0.1
    expect(round(0.15, 1)).to.equal(0.2);

    expect(round(0.005, 2)).to.equal(0.01); // 0.005 rounds up to 0.01
    expect(round(0.095, 1)).to.equal(0.1);
  });

  it('should handle precision of zero correctly', () => {
    expect(round(3.14159, 0)).to.equal(3);
    expect(round(2.71828, 0)).to.equal(3);
    expect(round(1.499, 0)).to.equal(1);
    expect(round(1.5, 0)).to.equal(2);
  });

  it('should handle negative precision (although uncommon)', () => {
    expect(round(1234, -2)).to.equal(1200);
    expect(round(5678, -3)).to.equal(6000);
    expect(round(54321, -4)).to.equal(50000);
  });
});
