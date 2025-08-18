import { formatSecondsToHHMMSS } from '@common/convert-time';
import type { HomeAssistant } from '@hass/types';
import type { PiHoleSetup } from '@type/types';

/**
 * Returns a function that, when invoked, pauses the specified Pi-hole device for a given duration.
 *
 * @param hass - The Home Assistant instance used to call services.
 * @param setup - The Pi-hole setup to be paused.
 * @param seconds - The duration to pause the device, in seconds.
 * @param entityId - Optional entity ID to target a specific switch instead of the device.
 * @returns A function that triggers the pause action when called.
 */
export const handlePauseClick = (
  hass: HomeAssistant,
  setup: PiHoleSetup,
  seconds: number,
  entityId?: string,
) => {
  return () => {
    const domain = 'pi_hole_v6';
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
};
