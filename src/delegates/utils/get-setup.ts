import { sortEntitiesByOrder } from '@common/sort-entities';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import type { EntityInformation, PiHoleSetup } from '@type/types';
import { getPiHole } from './get-pihole';

/**
 * Gets the Pi-hole setup information from Home Assistant
 * @param hass - The Home Assistant instance
 * @param config - The configuration object
 * @returns The Pi-hole setup object or undefined if no devices are found
 */
export const getPiSetup = (
  hass: HomeAssistant,
  config: Config,
): PiHoleSetup | undefined => {
  // Handle both string and array device IDs
  const deviceIds = Array.isArray(config.device_id)
    ? config.device_id
    : [config.device_id];

  if (deviceIds.length === 0) {
    return undefined;
  }

  // keep track of switches that are not in the first device
  const spareSwitches: EntityInformation[] = [];

  const holes = deviceIds
    .map((deviceId, i) => getPiHole(hass, config, deviceId))
    .filter((hole) => hole !== undefined)
    .map((hole, i) => {
      if (i > 0) {
        spareSwitches.push(...hole.switches);
        // don't track entites that are not in the first device
        // but preserve stats sensors for combining statistics
        return {
          device_id: hole.device_id,
          // required for the setup state to work
          status: hole.status,
          // required for the badge actions to work
          info_message_count: hole.info_message_count,
          purge_diagnosis_messages: hole.purge_diagnosis_messages,
          // preserve stats sensors for combining statistics across devices
          dns_queries_today: hole.dns_queries_today,
          ads_blocked_today: hole.ads_blocked_today,
          ads_percentage_blocked_today: hole.ads_percentage_blocked_today,
          domains_blocked: hole.domains_blocked,
          dns_unique_clients: hole.dns_unique_clients,
          controls: [],
          sensors: [],
          switches: [],
          updates: [],
        };
      }
      return hole;
    });

  if (holes.length > 1) {
    const primary = holes[0]!;
    // resort the combined switches
    primary.switches = sortEntitiesByOrder(config, [
      ...primary.switches,
      ...spareSwitches,
    ]);
  }

  return {
    holes,
  };
};
