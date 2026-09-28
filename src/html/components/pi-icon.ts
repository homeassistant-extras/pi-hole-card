import {
  actionHandler,
  handleMultiPiClickAction,
} from '@delegates/action-handler-delegate';
import type { Config } from '@type/config';
import type { PiHoleSetup } from '@type/types';
import { html, type TemplateResult } from 'lit';

/**
 * Renders an icon or a warning badge based on the number of info messages in the Pi-hole setup.
 *
 * @param element - The HTML element to render the icon into
 * @param config - The configuration object containing icon information.
 * @param setup - The PiHoleSetup object containing the list of holes and their info message counts.
 * @returns A TemplateResult displaying either the configured icon (or a default) or a warning badge with the info count.
 */
export const icon = (
  element: HTMLElement,
  config: Config,
  setup: PiHoleSetup,
): TemplateResult => {
  const infoCount = setup.holes.reduce((acc, h) => {
    if (
      h.info_message_count &&
      !Number.isNaN(Number(h.info_message_count.state))
    ) {
      return acc + Number(h.info_message_count.state);
    }
    return acc;
  }, 0);

  // Create ActionConfigParams for each Pi-hole
  const actionConfigs = setup.holes.map((h) => {
    // If user has custom badge config, apply it to all Pi-holes
    if (config.badge) {
      return {
        entity:
          h.info_message_count?.entity_id ?? h.status?.entity_id ?? h.device_id,
        ...config.badge,
      };
    }

    // Use config.badge if provided, otherwise create custom actions
    const baseConfig = {
      tap_action: {
        action: 'more-info' as const,
      },
      hold_action: {
        action: 'more-info' as const,
      },
      double_tap_action: {
        action: 'more-info' as const,
      },
    };

    // Only setup default actions if the required entities exist
    if (h.purge_diagnosis_messages && h.info_message_count) {
      const purgeEntity = h.purge_diagnosis_messages;
      const infoEntity = h.info_message_count;

      return {
        entity: infoEntity.entity_id, // Use info_message_count for more-info actions
        ...baseConfig,
        // Override tap_action for default behavior when info messages exist
        tap_action:
          infoCount > 0
            ? {
                action: 'call-service' as const,
                perform_action: 'button.press',
                target: {
                  entity_id: purgeEntity.entity_id, // Use purge_diagnosis_messages for button press
                },
              }
            : {
                action: 'more-info' as const,
              },
      };
    }

    // For Pi-holes without required entities, just use the base config
    return {
      entity: h.status?.entity_id ?? h.device_id,
      ...baseConfig,
    };
  });

  return html`<div
    class="badge"
    @action=${handleMultiPiClickAction(element, actionConfigs)}
    .actionHandler=${actionHandler(actionConfigs[0])}
  >
    ${
      infoCount === 0
        ? html`<ha-icon icon="${config.icon ?? 'mdi:pi-hole'}"></ha-icon>`
        : html`<div class="warning-badge">${infoCount}</div>`
    }
  </div>`;
};
