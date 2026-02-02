import { processStatisticsData } from '@cards/components/graph/utils/process-statistics-data';
import type { StatisticsResponse } from '@cards/components/graph/utils/types';
import { expect } from 'chai';

describe('process-statistics-data', () => {
  describe('processStatisticsData', () => {
    it('should process statistics with mean values', () => {
      const response: StatisticsResponse = {
        'sensor.cpu': [
          {
            start: 946684800000, // milliseconds
            end: 946684860000,
            mean: 45.5,
          },
          {
            start: 946684860000,
            end: 946684920000,
            mean: 42.3,
          },
        ],
        'sensor.memory': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 60.2,
          },
        ],
      };

      const result = processStatisticsData(
        response,
        'sensor.cpu',
        'sensor.memory',
      );

      expect(result.cpuData).to.have.length(2);
      expect(result.memoryData).to.have.length(1);
      // Check that both values are present (order is tested separately)
      const cpuValues = result.cpuData.map((d) => d.value);
      expect(cpuValues).to.include(45.5);
      expect(cpuValues).to.include(42.3);
      expect(result.memoryData[0]!.value).to.equal(60.2);
    });

    it('should use state when mean is not available', () => {
      const response: StatisticsResponse = {
        'sensor.cpu': [
          {
            start: 946684800000,
            end: 946684860000,
            state: 50.0,
          },
        ],
        'sensor.memory': [
          {
            start: 946684800000,
            end: 946684860000,
            state: 65.0,
          },
        ],
      };

      const result = processStatisticsData(
        response,
        'sensor.cpu',
        'sensor.memory',
      );

      expect(result.cpuData[0]!.value).to.equal(50.0);
      expect(result.memoryData[0]!.value).to.equal(65.0);
    });

    it('should use sum when mean and state are not available', () => {
      const response: StatisticsResponse = {
        'sensor.cpu': [
          {
            start: 946684800000,
            end: 946684860000,
            sum: 100.0,
          },
        ],
        'sensor.memory': [
          {
            start: 946684800000,
            end: 946684860000,
            sum: 200.0,
          },
        ],
      };

      const result = processStatisticsData(
        response,
        'sensor.cpu',
        'sensor.memory',
      );

      expect(result.cpuData[0]!.value).to.equal(100.0);
      expect(result.memoryData[0]!.value).to.equal(200.0);
    });

    it('should convert seconds to milliseconds', () => {
      const response: StatisticsResponse = {
        'sensor.cpu': [
          {
            start: 946684800, // seconds
            end: 946684860,
            mean: 45.5,
          },
        ],
        'sensor.memory': [
          {
            start: 946684800,
            end: 946684860,
            mean: 60.2,
          },
        ],
      };

      const result = processStatisticsData(
        response,
        'sensor.cpu',
        'sensor.memory',
      );

      expect(result.cpuData[0]!.timestamp.getTime()).to.equal(946684800000);
      expect(result.memoryData[0]!.timestamp.getTime()).to.equal(946684800000);
    });

    it('should filter out invalid values', () => {
      const response: StatisticsResponse = {
        'sensor.cpu': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: NaN,
          },
          {
            start: 946684860000,
            end: 946684920000,
            mean: 45.5,
          },
        ],
        'sensor.memory': [
          {
            start: 946684800000,
            end: 946684860000,
            // No mean, state, or sum
          },
        ],
      };

      const result = processStatisticsData(
        response,
        'sensor.cpu',
        'sensor.memory',
      );

      expect(result.cpuData).to.have.length(1);
      expect(result.cpuData[0]!.value).to.equal(45.5);
      expect(result.memoryData).to.have.length(0);
    });

    it('should handle empty statistics', () => {
      const response: StatisticsResponse = {
        'sensor.cpu': [],
        'sensor.memory': [],
      };

      const result = processStatisticsData(
        response,
        'sensor.cpu',
        'sensor.memory',
      );

      expect(result.cpuData).to.have.length(0);
      expect(result.memoryData).to.have.length(0);
    });

    it('should handle missing entity statistics', () => {
      const response: StatisticsResponse = {
        'sensor.cpu': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 45.5,
          },
        ],
        // Missing memory sensor data
      };

      const result = processStatisticsData(
        response,
        'sensor.cpu',
        'sensor.memory',
      );

      expect(result.cpuData).to.have.length(1);
      expect(result.memoryData).to.have.length(0);
    });
  });
});
