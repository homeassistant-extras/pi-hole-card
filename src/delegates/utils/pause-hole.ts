import { formatSecondsToHHMMSS } from '@common/convert-time';
import { substitutePauseActionVars } from '@common/pause-action-vars';
import { hasFeature } from '@config/feature';
import { fireEvent } from '@hass/common/dom/fire_event';
import type { ActionConfigParams } from '@hass/panels/lovelace/common/handle-action';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import type { PiHoleSetup } from '@type/types';

/**
 * Pauses the specified Pi-hole device for a given duration.
 *
 * @param hass - The Home Assistant instance used to call services.
 * @param setup - The Pi-hole setup to be paused.
 * @param seconds - The duration to pause the device, in seconds.
 * @param config - The card configuration to check for feature flags.
 * @param entityId - Optional entity ID to target a specific switch instead of the device.
 * @param node - Element to dispatch `hass-action` from when `pause.tap_action` is set; required for custom actions.
 */
export const handlePauseClick = (
  hass: HomeAssistant,
  setup: PiHoleSetup,
  seconds: number,
  config: Config,
  entityId?: string,
  node?: HTMLElement,
) => {
  // allow custom pause action, such as with custom integrations
  const pauseAction = config.pause?.tap_action;
  if (pauseAction?.action) {
    if (!node) {
      return;
    }
    const actionParams: ActionConfigParams = {
      tap_action: substitutePauseActionVars(pauseAction, {
        seconds,
        config,
        entityId,
      }),
    };
    // @ts-ignore
    fireEvent(node, 'hass-action', {
      config: actionParams,
      action: 'tap',
    });
    return;
  }

  const domain = hasFeature(config, 'ha_integration')
    ? 'pi_hole'
    : 'pi_hole_v6';
  const service = 'disable';

  if (entityId) {
    // Use the new entity-based service call
    hass.callService(domain, service, {
      duration: formatSecondsToHHMMSS(seconds),
      entity_id: [entityId],
    });
  } else {
    // Fall back to device-based service call for backward compatibility
    setup.holes.forEach((hole) => {
      hass.callService(domain, service, {
        device_id: hole.device_id,
        duration: formatSecondsToHHMMSS(seconds),
      });
    });
  }
};
