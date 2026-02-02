import type { HomeAssistant } from '@hass/types';
import type { PiHoleDevice } from '@type/types';
import { getTimeRange } from './time-utils';
import type { StatisticsResponse } from './types';

export interface FetchStatisticsDataParams {
  hass: HomeAssistant;
  device: PiHoleDevice;
}

export interface FetchStatisticsDataResult {
  response: StatisticsResponse;
  error: null;
}

export interface FetchStatisticsDataError {
  response: null;
  error: string;
}

/**
 * Fetches statistics data from Home Assistant for CPU and memory sensors
 * @param params - Object containing hass instance and device
 * @returns Promise resolving to statistics response or error
 */
export const fetchStatisticsData = async (
  params: FetchStatisticsDataParams,
): Promise<FetchStatisticsDataResult | FetchStatisticsDataError> => {
  const { hass, device } = params;

  // Check if CPU and memory sensors are available
  if (!device.cpu_use || !device.memory_use) {
    return {
      response: null,
      error: 'CPU or memory sensors not available',
    };
  }

  const entityIds = [device.cpu_use.entity_id, device.memory_use.entity_id];

  try {
    const { startTime, endTime } = getTimeRange();

    const response = await hass.callWS<StatisticsResponse>({
      type: 'recorder/statistics_during_period',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      statistic_ids: entityIds,
      period: '5minute',
    });

    return {
      response,
      error: null,
    };
  } catch {
    return {
      response: null,
      error: 'Failed to load statistics data',
    };
  }
};
