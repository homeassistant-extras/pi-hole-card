import { getCpuGradient } from '@html/components/get-cpu-gradient';
import { getMemoryGradient } from '@html/components/get-memory-gradient';
import type { Chart } from 'chart.js';
import { createChartDatasets } from './create-chart-datasets';
import { interpolateDataPoints } from './interpolate-data';
import { formatTimeLabel, getSortedTimeSet } from './time-utils';
import type { StatisticsDataPoint } from './types';

export interface UpdateChartParams {
  chart: Chart | null;
  cpuData: StatisticsDataPoint[];
  memoryData: StatisticsDataPoint[];
  lineType?: 'normal' | 'gradient' | 'gradient_no_fill' | 'no_fill';
}

/**
 * Updates a Chart.js instance with new CPU and memory data
 * @param params - Object containing chart instance (can be null), data arrays, and optional line type
 */
export const updateChart = (params: UpdateChartParams): void => {
  const { chart, cpuData, memoryData, lineType } = params;

  if (!chart) {
    return;
  }

  // Create time labels (use the union of all times)
  const sortedTimes = getSortedTimeSet(cpuData, memoryData);

  // Format labels
  const labels = sortedTimes.map((time) => formatTimeLabel(time));

  // Interpolate data points
  const cpuValues = interpolateDataPoints(cpuData, sortedTimes);
  const memoryValues = interpolateDataPoints(memoryData, sortedTimes);

  // Create datasets
  chart.data.labels = labels;
  chart.data.datasets = createChartDatasets(
    cpuValues,
    memoryValues,
    lineType,
    getCpuGradient,
    getMemoryGradient,
  );

  chart.update('none');
};
