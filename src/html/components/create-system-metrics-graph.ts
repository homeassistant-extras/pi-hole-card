import { show } from '@common/show-section';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { html, nothing, type TemplateResult } from 'lit';
import { isGraphSensor } from './is-graph-sensor';

/**
 * Creates a history graph card for CPU and memory usage sensors
 * @param hass - The Home Assistant instance
 * @param device - The Pi-hole device
 * @param config - The card configuration
 * @returns TemplateResult
 */
export const createSystemMetricsGraph = (
  hass: HomeAssistant,
  device: PiHoleDevice,
  config: Config,
): TemplateResult | typeof nothing => {
  // Return nothing if chart section is excluded
  if (!show(config, 'chart')) {
    return nothing;
  }

  // Find CPU and memory sensors
  const graphSensors = device.sensors.filter((sensor) =>
    isGraphSensor(sensor.entity_id),
  );

  if (graphSensors.length === 0) {
    return nothing;
  }

  return html`
    <system-metrics-graph
      .hass=${hass}
      .device=${device}
      .config=${config}
    ></system-metrics-graph>
  `;
};
