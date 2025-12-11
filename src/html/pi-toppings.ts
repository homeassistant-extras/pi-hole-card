import { show } from '@common/show-section';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { html, nothing, type TemplateResult } from 'lit';
import { createAdditionalStat } from './components/additional-stat';

/**
 * Creates the additional stats section for the Pi-hole card
 * @param element - The element to attach the actions to
 * @param hass - The Home Assistant instance
 * @param device - The Pi-hole device
 * @param config - The configuration for the card
 * @returns TemplateResult
 */
export const createAdditionalStats = (
  element: HTMLElement,
  hass: HomeAssistant,
  device: PiHoleDevice,
  config: Config,
): TemplateResult | typeof nothing => {
  if (!show(config, 'sensors')) return nothing;

  return html`
    <div class="additional-stats">
      ${device.sensors.map((sensor) => {
        return createAdditionalStat(hass, element, config.info, sensor);
      })}
    </div>
  `;
};
