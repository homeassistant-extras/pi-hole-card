import {
  formatTimeLabel,
  getSortedTimeSet,
  getTimeRange,
  normalizeTimestamp,
} from '@cards/components/graph/utils/time-utils';
import type { StatisticsDataPoint } from '@cards/components/graph/utils/types';
import { expect } from 'chai';

describe('time-utils', () => {
  describe('getTimeRange', () => {
    it('should return startTime 24 hours before endTime', () => {
      const { startTime, endTime } = getTimeRange();
      const diff = endTime.getTime() - startTime.getTime();
      const hoursDiff = diff / (1000 * 60 * 60);

      expect(hoursDiff).to.be.closeTo(24, 0.1);
      expect(endTime).to.be.instanceOf(Date);
      expect(startTime).to.be.instanceOf(Date);
    });

    it('should return endTime as current time', () => {
      const before = Date.now();
      const { endTime } = getTimeRange();
      const after = Date.now();

      expect(endTime.getTime()).to.be.at.least(before);
      expect(endTime.getTime()).to.be.at.most(after + 1000); // Allow 1 second tolerance
    });
  });

  describe('normalizeTimestamp', () => {
    it('should convert seconds to milliseconds', () => {
      const seconds = 946684800; // Year 2000 in seconds
      const result = normalizeTimestamp(seconds);
      expect(result).to.equal(946684800000);
    });

    it('should handle timestamps after year 2000 in seconds', () => {
      const seconds = 1000000000; // After year 2000 but in seconds
      const result = normalizeTimestamp(seconds);
      expect(result).to.equal(1000000000000);
    });

    it('should handle timestamps before year 2000 threshold', () => {
      const seconds = 946684799; // Just before threshold
      const result = normalizeTimestamp(seconds);
      expect(result).to.equal(946684799000);
    });
  });

  describe('formatTimeLabel', () => {
    it('should format timestamp as time string', () => {
      const timestamp = new Date('2024-01-15T15:30:00').getTime();
      const result = formatTimeLabel(timestamp);

      expect(result).to.match(/^\d{1,2}:\d{2}\s?(AM|PM)$/);
    });

    it('should handle different times correctly', () => {
      const morning = new Date('2024-01-15T09:15:00').getTime();
      const afternoon = new Date('2024-01-15T15:45:00').getTime();

      const morningResult = formatTimeLabel(morning);
      const afternoonResult = formatTimeLabel(afternoon);

      expect(morningResult).to.include('9');
      expect(afternoonResult).to.include('3');
    });
  });

  describe('getSortedTimeSet', () => {
    it('should return sorted unique timestamps', () => {
      const data1: StatisticsDataPoint[] = [
        { timestamp: new Date(1000), value: 10 },
        { timestamp: new Date(3000), value: 20 },
      ];
      const data2: StatisticsDataPoint[] = [
        { timestamp: new Date(2000), value: 15 },
        { timestamp: new Date(3000), value: 25 }, // Duplicate timestamp
      ];

      const result = getSortedTimeSet(data1, data2);

      expect(result).to.deep.equal([1000, 2000, 3000]);
    });

    it('should handle empty arrays', () => {
      const result = getSortedTimeSet([], []);
      expect(result).to.deep.equal([]);
    });

    it('should handle single data point array', () => {
      const data: StatisticsDataPoint[] = [
        { timestamp: new Date(5000), value: 50 },
      ];

      const result = getSortedTimeSet(data);

      expect(result).to.deep.equal([5000]);
    });

    it('should handle multiple data point arrays', () => {
      const data1: StatisticsDataPoint[] = [
        { timestamp: new Date(100), value: 1 },
        { timestamp: new Date(500), value: 5 },
      ];
      const data2: StatisticsDataPoint[] = [
        { timestamp: new Date(200), value: 2 },
      ];
      const data3: StatisticsDataPoint[] = [
        { timestamp: new Date(300), value: 3 },
        { timestamp: new Date(400), value: 4 },
      ];

      const result = getSortedTimeSet(data1, data2, data3);

      expect(result).to.deep.equal([100, 200, 300, 400, 500]);
    });
  });
});
