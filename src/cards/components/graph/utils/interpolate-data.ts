import type { StatisticsDataPoint } from './types';

/**
 * Gets the value at a specific time from data points
 * Finds the closest data point within a 5-minute window
 * @param data - Array of data points to search
 * @param targetTime - Target timestamp in milliseconds
 * @returns The value at the target time, or null if no point within 5 minutes
 */
export const getValueAtTime = (
  data: StatisticsDataPoint[],
  targetTime: number,
): number | null => {
  if (data.length === 0) return null;

  // Find closest point
  let closest = data[0]!;
  let minDiff = Math.abs(data[0]!.timestamp.getTime() - targetTime);

  for (const point of data) {
    const diff = Math.abs(point.timestamp.getTime() - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closest = point;
    }
  }

  // Only use if within 5 minutes
  if (minDiff < 5 * 60 * 1000) {
    return closest.value;
  }
  return null;
};

/**
 * Interpolates data points at specific timestamps
 * @param data - Array of data points to interpolate from
 * @param timestamps - Array of target timestamps in milliseconds
 * @returns Array of values (or null) corresponding to each timestamp
 */
export const interpolateDataPoints = (
  data: StatisticsDataPoint[],
  timestamps: number[],
): Array<number | null> => {
  return timestamps.map((time) => getValueAtTime(data, time));
};
