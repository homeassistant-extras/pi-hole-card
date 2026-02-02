import type { StatisticsDataPoint } from './types';

/**
 * Gets the time range for statistics query (24 hours ago to now)
 * @returns Object with startTime and endTime as Date objects
 */
export const getTimeRange = (): { startTime: Date; endTime: Date } => {
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
  return { startTime, endTime };
};

/**
 * Normalizes a timestamp to milliseconds
 * The timestamp can be in seconds or milliseconds depending on HA version
 * @param timestamp - The timestamp to normalize (seconds or milliseconds)
 * @returns The timestamp in milliseconds
 */
export const normalizeTimestamp = (timestamp: number): number => {
  // Check if it's already in milliseconds (> year 2000 in seconds = 946684800)
  return timestamp > 946684800000 ? timestamp : timestamp * 1000;
};

/**
 * Formats a timestamp as a time label for the chart
 * @param timestamp - The timestamp in milliseconds
 * @returns Formatted time string (e.g., "3:45 PM")
 */
export const formatTimeLabel = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Gets a sorted array of unique timestamps from data points
 * @param dataPoints - Array of data point arrays (e.g., [cpuData, memoryData])
 * @returns Sorted array of unique timestamps in milliseconds
 */
export const getSortedTimeSet = (
  ...dataPoints: StatisticsDataPoint[][]
): number[] => {
  const allTimes = new Set<number>();
  dataPoints.forEach((data) => {
    data.forEach((d) => allTimes.add(d.timestamp.getTime()));
  });
  return Array.from(allTimes).sort((a, b) => a - b);
};
