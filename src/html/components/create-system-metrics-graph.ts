import { show } from '@common/show-section';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { html, nothing, type TemplateResult } from 'lit';

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

  // Check if CPU and memory sensors are available
  if (!device.cpu_use || !device.memory_use) {
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
