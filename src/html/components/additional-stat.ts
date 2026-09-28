import {
  actionHandler,
  handleClickAction,
} from '@delegates/action-handler-delegate';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { SectionConfig } from '@type/config';
import type { EntityInformation } from '@type/types';
import { type TemplateResult, html } from 'lit';
import { stateDisplay } from './state-display';

/**
 * Creates an additional stat item
 * @param hass - The Home Assistant instance
 * @param element - The element to attach the action to
 * @param config - The section configuration
 * @param entity - The entity information
 * @returns TemplateResult
 */
export const createAdditionalStat = (
  hass: HomeAssistant,
  element: HTMLElement,
  config: SectionConfig | undefined,
  entity: EntityInformation,
): TemplateResult => {
  return html`
    <div
      class="additional-stat"
      @action=${handleClickAction(element, config, entity)}
      .actionHandler=${actionHandler(config)}
    >
      <ha-state-icon .hass=${hass} .stateObj=${entity}></ha-state-icon>
      ${stateDisplay(hass, entity)}
    </div>
  `;
};
