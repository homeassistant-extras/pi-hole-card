import { show } from '@common/show-section';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { html, nothing } from 'lit';
import { refreshTime } from './components/refresh-time';
import { createVersionItem } from './components/version-item';

/**
 * Renders the footer of the Pi-hole card
 * @param element - The HTML element to render the card into
 * @param device - The Pi-hole device
 * @param hass - The Home Assistant instance
 * @param config - The card configuration
 * @returns TemplateResult
 */
export const createFooter = (
  element: HTMLElement,
  hass: HomeAssistant,
  config: Config,
  device: PiHoleDevice,
) => {
  if (!show(config, 'footer')) return nothing;
  return html`<div class="version-info">
      ${device.updates.map((update) => {
        return createVersionItem(update);
      })}
    </div>

    <!-- Refesh Time -->
    ${refreshTime(element, hass, device)}`;
};
