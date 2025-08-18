import { isCollapsed } from '@common/collapsed-state';
import { formatSecondsToHuman, parseTimeToSeconds } from '@common/convert-time';
import { hasFeature } from '@common/has-feature';
import { show } from '@common/show-section';
import { toggleSection } from '@common/toggle-section';
import { handlePauseClick } from '@delegates/utils/pause-hole';
import type { HomeAssistant } from '@hass/types';
import { localize } from '@localize/localize';
import type { Config } from '@type/config';
import type { EntityInformation, PiHoleSetup } from '@type/types';
import { html, nothing } from 'lit';

/**
 * Gets the selected entity ID from the dropdown element
 * @param element - The dropdown element
 * @returns The selected entity ID or undefined
 */
const getSelectedEntityId = (element: HTMLElement): string | undefined => {
  const dropdown = element.closest('.pause')?.querySelector('ha-select') as any;
  return dropdown?.value;
};

/**
 * Gets all available switches from the setup
 * @param setup - The Pi-hole setup
 * @returns Array of all switches across all holes
 */
const getAllSwitches = (setup: PiHoleSetup): EntityInformation[] => {
  return setup.holes.flatMap((hole) => hole.switches);
};

/**
 * Renders a collapsible UI section for pausing Pi-hole ad-blocking for a specified duration.
 *
 * @param hass - The Home Assistant instance.
 * @param setup - The Pi-hole setup to be paused.
 * @param config - The configuration object containing UI and pause duration settings.
 * @returns A lit-html template for the pause section, or `nothing` if the section should not be shown.
 *
 * The section displays a dropdown to select a switch and a list of buttons for each pause duration,
 * allowing the user to pause ad-blocking for the selected amount of time on the selected switch.
 * The section can be collapsed or expanded based on the configuration.
 */
export const pause = (
  hass: HomeAssistant,
  setup: PiHoleSetup,
  config: Config,
) => {
  if (!show(config, 'pause')) return nothing;

  const pauseCollapsed = isCollapsed(config, 'pause');
  const pauseDuration = config.pause_durations ?? [60, 300, 900];
  const allSwitches = getAllSwitches(setup);

  // Check if group pausing is enabled
  const isGroupPausingEnabled = hasFeature(config, 'group_pausing');

  return html`<div class="collapsible-section">
    <div
      class="section-header"
      @click=${(e: Event) => toggleSection(e, '.pause')}
    >
      <span>${localize(hass, 'card.sections.pause')}</span>
      <ha-icon
        class="caret-icon"
        icon="mdi:chevron-${pauseCollapsed ? 'right' : 'down'}"
      ></ha-icon>
    </div>
    <div class="pause ${pauseCollapsed ? 'hidden' : ''}">
      ${isGroupPausingEnabled && allSwitches.length > 0
        ? html`
            <div class="pause-controls">
              <ha-select
                .label=${'Select Switch'}
                .value=${allSwitches[0]?.entity_id || ''}
                .required=${false}
              >
                ${allSwitches.map(
                  (switchEntity) => html`
                    <ha-list-item .value=${switchEntity.entity_id}>
                      ${switchEntity.attributes.friendly_name ||
                      switchEntity.entity_id}
                    </ha-list-item>
                  `,
                )}
              </ha-select>
            </div>
            <div class="pause-buttons">
              ${pauseDuration.map((duration) => {
                const seconds = parseTimeToSeconds(duration);
                const displayText = formatSecondsToHuman(seconds, hass);
                return html`<mwc-button
                  @click=${(e: Event) => {
                    const selectedEntityId = getSelectedEntityId(
                      e.target as HTMLElement,
                    );
                    handlePauseClick(hass, setup, seconds, selectedEntityId)();
                  }}
                  >${displayText}</mwc-button
                >`;
              })}
            </div>
          `
        : html`
            <div class="pause-buttons">
              ${pauseDuration.map((duration) => {
                const seconds = parseTimeToSeconds(duration);
                const displayText = formatSecondsToHuman(seconds, hass);
                return html`<mwc-button
                  @click=${handlePauseClick(hass, setup, seconds)}
                  >${displayText}</mwc-button
                >`;
              })}
            </div>
          `}
    </div>
  </div>`;
};
