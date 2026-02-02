import { normalizeTimestamp } from './time-utils';
import type { StatisticsDataPoint, StatisticsResponse } from './types';

/**
 * Processes Home Assistant statistics response into data point arrays
 * @param response - The statistics response from Home Assistant
 * @param cpuEntityId - The entity ID for CPU usage sensor
 * @param memoryEntityId - The entity ID for memory usage sensor
 * @returns Object containing cpuData and memoryData arrays
 */
export const processStatisticsData = (
  response: StatisticsResponse,
  cpuEntityId: string,
  memoryEntityId: string,
): { cpuData: StatisticsDataPoint[]; memoryData: StatisticsDataPoint[] } => {
  const cpuData: StatisticsDataPoint[] = [];
  const memoryData: StatisticsDataPoint[] = [];

  const entityIds = [cpuEntityId, memoryEntityId];

  entityIds.forEach((entityId) => {
    const entityStats = response[entityId];

    if (!entityStats || entityStats.length === 0) {
      return;
    }

    const isCpu = entityId === cpuEntityId;
    const dataArray = isCpu ? cpuData : memoryData;

    entityStats.forEach((stat) => {
      // Use mean if available, otherwise state, otherwise sum
      let value: number | null = null;
      if (stat.mean !== undefined) {
        value = stat.mean;
      } else if (stat.state !== undefined) {
        value = stat.state;
      } else if (stat.sum !== undefined) {
        value = stat.sum;
      }

      if (value !== null && !Number.isNaN(value)) {
        const timestampMs = normalizeTimestamp(stat.start);

        dataArray.push({
          timestamp: new Date(timestampMs),
          value,
        });
      }
    });
  });

  // Sort by time
  cpuData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  memoryData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return { cpuData, memoryData };
};
