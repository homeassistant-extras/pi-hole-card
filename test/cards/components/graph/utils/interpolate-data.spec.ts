import {
  getValueAtTime,
  interpolateDataPoints,
} from '@cards/components/graph/utils/interpolate-data';
import type { StatisticsDataPoint } from '@cards/components/graph/utils/types';
import { expect } from 'chai';

describe('interpolate-data', () => {
  describe('getValueAtTime', () => {
    const createDataPoint = (
      timestamp: number,
      value: number,
    ): StatisticsDataPoint => ({
      timestamp: new Date(timestamp),
      value,
    });

    it('should return null for empty data', () => {
      const result = getValueAtTime([], 1000);
      expect(result).to.be.null;
    });

    it('should return value for exact match', () => {
      const data: StatisticsDataPoint[] = [
        createDataPoint(1000, 50),
        createDataPoint(2000, 60),
      ];

      const result = getValueAtTime(data, 1000);
      expect(result).to.equal(50);
    });

    it('should return closest value within 5 minutes', () => {
      const data: StatisticsDataPoint[] = [
        createDataPoint(1000, 50),
        createDataPoint(200000, 60), // 200 seconds = ~3.3 minutes
        createDataPoint(400000, 70), // 400 seconds = ~6.7 minutes
      ];

      const result = getValueAtTime(data, 205000); // 5 seconds after second point
      expect(result).to.equal(60);
    });

    it('should return null if closest point is beyond 5 minutes', () => {
      const data: StatisticsDataPoint[] = [
        createDataPoint(1000, 50),
        createDataPoint(400000, 60), // 400 seconds = ~6.7 minutes
      ];

      // Target is 1000000ms (1000 seconds), closest point is at 400000ms
      // Distance: 1000000 - 400000 = 600000ms = 600 seconds = 10 minutes (beyond 5 minutes)
      const result = getValueAtTime(data, 1000000);
      expect(result).to.be.null;
    });

    it('should find closest point among multiple points', () => {
      const data: StatisticsDataPoint[] = [
        createDataPoint(1000, 10),
        createDataPoint(5000, 50),
        createDataPoint(10000, 100),
      ];

      const result = getValueAtTime(data, 6000); // Closest to 5000
      expect(result).to.equal(50);
    });

    it('should handle single data point', () => {
      const data: StatisticsDataPoint[] = [createDataPoint(1000, 50)];

      const result = getValueAtTime(data, 1000);
      expect(result).to.equal(50);
    });

    it('should return null for point exactly 5 minutes away', () => {
      const fiveMinutes = 5 * 60 * 1000;
      const data: StatisticsDataPoint[] = [
        createDataPoint(1000, 50),
        createDataPoint(1000 + fiveMinutes, 60),
      ];

      const result = getValueAtTime(data, 1000 + fiveMinutes - 1);
      // Should be within 5 minutes (1ms less than 5 minutes)
      expect(result).to.equal(60);
    });
  });

  describe('interpolateDataPoints', () => {
    const createDataPoint = (
      timestamp: number,
      value: number,
    ): StatisticsDataPoint => ({
      timestamp: new Date(timestamp),
      value,
    });

    it('should interpolate values for multiple timestamps', () => {
      const data: StatisticsDataPoint[] = [
        createDataPoint(1000, 50),
        createDataPoint(5000, 60),
        createDataPoint(10000, 70),
      ];

      const timestamps = [1000, 5000, 10000];
      const result = interpolateDataPoints(data, timestamps);

      expect(result).to.deep.equal([50, 60, 70]);
    });

    it('should return null for timestamps without matching points', () => {
      const data: StatisticsDataPoint[] = [
        createDataPoint(1000, 50),
        createDataPoint(5000, 60),
      ];

      // 20000ms is only 15 seconds away from 5000ms, which is within 5 minutes
      // Use a timestamp that's truly beyond 5 minutes from any point
      // 5 minutes = 300000ms, so 5000 + 300000 = 305000ms would be exactly 5 minutes away
      // Use 310000ms to be beyond 5 minutes
      const timestamps = [1000, 310000]; // 310000 is beyond 5 minutes from closest point (5000)
      const result = interpolateDataPoints(data, timestamps);

      expect(result).to.deep.equal([50, null]);
    });

    it('should handle empty timestamps array', () => {
      const data: StatisticsDataPoint[] = [createDataPoint(1000, 50)];

      const result = interpolateDataPoints(data, []);

      expect(result).to.deep.equal([]);
    });

    it('should handle empty data array', () => {
      const timestamps = [1000, 2000, 3000];
      const result = interpolateDataPoints([], timestamps);

      expect(result).to.deep.equal([null, null, null]);
    });

    it('should interpolate with closest points', () => {
      const data: StatisticsDataPoint[] = [
        createDataPoint(1000, 10),
        createDataPoint(5000, 50),
        createDataPoint(10000, 100),
      ];

      const timestamps = [1500, 6000, 9500]; // Between points
      const result = interpolateDataPoints(data, timestamps);

      expect(result[0]).to.equal(10); // Closest to 1000
      expect(result[1]).to.equal(50); // Closest to 5000
      expect(result[2]).to.equal(100); // Closest to 10000
    });
  });
});
