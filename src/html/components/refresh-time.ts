import {
  actionHandler,
  handleClickAction,
} from '@delegates/action-handler-delegate';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { SectionConfig } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { html, nothing, type TemplateResult } from 'lit';
import { stateDisplay } from './state-display';

/**
 * Renders the refresh time icon and last data refresh time
 * @param element - The HTML element to render the card into
 * @param hass - The Home Assistant instance
 * @param device - The Pi-hole device
 * @returns TemplateResult
 */
export const refreshTime = (
  element: HTMLElement,
  hass: HomeAssistant,
  device: PiHoleDevice,
): TemplateResult => {
  const clickConfig: SectionConfig = {
    tap_action: {
      action: 'toggle',
    },
  };
  return html`<div class="refresh-time">
    ${
      device.action_refresh_data
        ? html`<ha-icon
            icon="mdi:refresh"
            @action=${handleClickAction(
              element,
              clickConfig,
              device.action_refresh_data,
            )}
            .actionHandler=${actionHandler(clickConfig)}
          ></ha-icon>`
        : nothing
    }
    ${
      device.latest_data_refresh
        ? stateDisplay(hass, device.latest_data_refresh)
        : nothing
    }
  </div>`;
};
