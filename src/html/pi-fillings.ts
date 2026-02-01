import { combineStats, getDashboardStats } from '@common/get-stats';
import { show } from '@common/show-section';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import type { EntityInformation, PiHoleSetup } from '@type/types';
import { html, nothing, type TemplateResult } from 'lit';
import { createStatBox } from './components/stat-box';

/**
 * Creates the dashboard stats section of the Pi-hole card
 * @param element - The HTML element to render the card into
 * @param hass - The Home Assistant object
 * @param setup - The Pi-hole setup containing all devices
 * @param config - The card configuration
 * @returns TemplateResult
 */
export const createDashboardStats = (
  element: HTMLElement,
  hass: HomeAssistant,
  setup: PiHoleSetup,
  config: Config,
): TemplateResult | typeof nothing => {
  if (!show(config, 'statistics')) return nothing;

  // Combine statistics from all Pi-hole devices
  const combinedDevice = combineStats(setup.holes);

  // Get the unique clients count for the configuration
  const uniqueClientsCount = combinedDevice.dns_unique_clients?.state ?? '0';

  // Get the stats configuration with the unique clients count
  const statConfigs = getDashboardStats(uniqueClientsCount);

  return html`
    <div class="dashboard-stats">
      ${statConfigs.map(
        (group) => html`
          <div class="stat-group">
            ${group.map((statConfig) =>
              createStatBox(
                element,
                hass,
                combinedDevice[statConfig.sensorKey] as
                  | EntityInformation
                  | undefined,
                config.stats,
                statConfig,
              ),
            )}
          </div>
        `,
      )}
    </div>
  `;
};
