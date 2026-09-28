import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { EntityInformation } from '@type/types';
import { html } from 'lit';

/**
 * Renders a state card content for a given entity
 * @param {HomeAssistant} hass - The Home Assistant instance
 * @param {EntityInformation} entity - The entity to render
 * @returns {TemplateResult} A lit-html template for the state card content
 */
export const stateContent = (
  hass: HomeAssistant,
  entity: EntityInformation,
  className?: string,
) =>
  html`<state-card-content
    .hass=${hass}
    .stateObj=${entity}
    class=${className}
  ></state-card-content>`;
