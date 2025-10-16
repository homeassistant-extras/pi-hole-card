import { show } from '@common/show-section';
import { stateActive } from '@hass/common/entity/state_active';
import type { HomeAssistant } from '@hass/types';
import { localize } from '@localize/localize';
import type { Config } from '@type/config';
import type { PiHoleSetup } from '@type/types';
import { html, nothing, type TemplateResult } from 'lit';
import { icon } from './components/pi-icon';
import { stateDisplay } from './components/state-display';

/**
 * Creates the card header section
 * @param element - The HTML element to render the card into
 * @param setup - The Pi-hole setup
 * @param hass - The Home Assistant instance
 * @param config - The card configuration
 * @returns TemplateResult
 */
export const createCardHeader = (
  element: HTMLElement,
  setup: PiHoleSetup,
  hass: HomeAssistant,
  config: Config,
): TemplateResult | typeof nothing => {
  if (!show(config, 'header')) return nothing;

  const primary = setup.holes[0]!;
  const activeCount = setup.holes
    .map((h) => h.status)
    .filter(
      (status) => status !== undefined && stateActive(status, status?.state),
    ).length;
  const mixedStatus = activeCount > 0 && activeCount < setup.holes.length;

  // Check if we should display the remaining time
  const hasRemainingTime =
    primary.remaining_until_blocking_mode &&
    primary.remaining_until_blocking_mode.state !== '0' &&
    primary.remaining_until_blocking_mode.state !== 'unavailable' &&
    primary.remaining_until_blocking_mode.state !== 'unknown';

  // Get status color based on active count and mixed status
  const getStatusColor = () => {
    if (mixedStatus) {
      return 'var(--warning-color, orange)';
    } else if (activeCount > 0) {
      return 'var(--success-color, green)';
    } else {
      return 'var(--error-color, red)';
    }
  };

  return html`
    <div class="card-header">
      <div class="name">
        ${icon(element, config, setup)}${config.title ?? 'Pi-hole'}
        ${setup.holes.length > 1
          ? html`<span class="multi-status"
              >(${activeCount}/${setup.holes.length})</span
            >`
          : ''}
      </div>
      <div style="color: ${getStatusColor()}">
        <ha-icon
          icon="${activeCount > 0 ? 'mdi:check-circle' : 'mdi:close-circle'}"
        ></ha-icon>
        ${mixedStatus
          ? html`${localize(hass, 'card.ui.partial')}`
          : stateDisplay(hass, primary.status!)}
        ${activeCount <= 0 && hasRemainingTime
          ? html`${stateDisplay(
              hass,
              primary.remaining_until_blocking_mode!,
              'remaining-time',
            )}`
          : ''}
      </div>
    </div>
  `;
};
