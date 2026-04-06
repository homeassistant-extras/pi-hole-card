import {
  actionHandler,
  handleClickAction,
} from '@delegates/action-handler-delegate';
import { formatNumber } from '@hass/common/number/format_number';
import type { HomeAssistant } from '@hass/types';
import { localize } from '@localize/localize';
import type { SectionConfig, StatBoxConfig } from '@type/config';
import type { EntityInformation } from '@type/types';
import { type TemplateResult, html, nothing } from 'lit';

/**
 * Creates a stat box for the Pi-hole dashboard
 * @param element - The element to attach the action to
 * @param hass - The Home Assistant object
 * @param entity - The entity information
 * @param sectionConfig - The section configuration
 * @param statBoxConfig - The configuration for the stat box
 * @returns TemplateResult
 */
export const createStatBox = (
  element: HTMLElement,
  hass: HomeAssistant,
  entity: EntityInformation | undefined,
  sectionConfig: SectionConfig | undefined,
  statBoxConfig: StatBoxConfig,
): TemplateResult | typeof nothing => {
  if (!entity) return nothing;

  const uom = entity.attributes?.unit_of_measurement === '%' ? '%' : '';
  const value = formatNumber(entity.state, hass.locale, {
    maximumFractionDigits: 1,
  });
  const footer =
    typeof statBoxConfig.footer === 'string'
      ? localize(hass, statBoxConfig.footer)
      : localize(
          hass,
          statBoxConfig.footer.key,
          statBoxConfig.footer.search,
          statBoxConfig.footer.replace,
        );

  return html`
    <div
      class="stat-box ${statBoxConfig.className}"
      @action=${handleClickAction(element, sectionConfig, entity)}
      .actionHandler=${actionHandler(sectionConfig)}
    >
      <div class="stat-icon">
        <ha-icon icon="${statBoxConfig.icon}"></ha-icon>
      </div>
      <div class="stat-content">
        <div class="stat-header">${localize(hass, statBoxConfig.title)}</div>
        <div class="stat-value">${value}${uom}</div>
      </div>
      <div class="stat-footer">
        <span>${footer}</span>
        <ha-icon icon="mdi:arrow-right-circle-outline"></ha-icon>
      </div>
    </div>
  `;
};
