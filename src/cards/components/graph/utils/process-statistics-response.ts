import type { PiHoleDevice } from '@type/types';
import type { Chart } from 'chart.js';
import { processStatisticsData } from './process-statistics-data';
import type { StatisticsResponse } from './types';
import { updateChart } from './update-chart';

export interface ProcessStatisticsResponseParams {
  response: StatisticsResponse;
  device: PiHoleDevice;
  chart: Chart | null;
  lineType?: 'normal' | 'gradient' | 'gradient_no_fill' | 'no_fill';
}

/**
 * Processes statistics response, extracts CPU and memory data, and updates the chart
 * @param params - Object containing statistics response, device, chart, and optional line type
 */
export const processStatisticsResponse = (
  params: ProcessStatisticsResponseParams,
): void => {
  const { response, device, chart, lineType } = params;

  if (!device.cpu_use || !device.memory_use) {
    return;
  }

  const cpuEntityId = device.cpu_use.entity_id;
  const memoryEntityId = device.memory_use.entity_id;

  const { cpuData, memoryData } = processStatisticsData(
    response,
    cpuEntityId,
    memoryEntityId,
  );

  updateChart({
    chart,
    cpuData,
    memoryData,
    lineType,
  });
};
