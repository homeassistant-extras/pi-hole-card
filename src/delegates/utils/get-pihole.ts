import { mapEntitiesByTranslationKey } from '@common/map-entities';
import { shouldSkipEntity } from '@common/skip-entity';
import { sortEntitiesByOrder } from '@common/sort-entities';
import { computeDomain } from '@homeassistant-extras/hass/common/entity/compute_domain';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { getDevice } from '../retrievers/device';
import { getDeviceEntities } from './card-entities';

/**
 * Gets the Pi-hole device information from Home Assistant
 * @param hass - The Home Assistant instance
 * @param config - The configuration object
 * @param deviceId - The unique identifier for the device
 * @returns The device object or undefined if the device is not found
 */
export const getPiHole = (
  hass: HomeAssistant,
  config: Config,
  deviceId: string,
): PiHoleDevice | undefined => {
  const device: PiHoleDevice = {
    device_id: deviceId,
    controls: [],
    sensors: [],
    switches: [],
    updates: [],
  };

  const hassDevice = getDevice(hass, device.device_id);
  if (!hassDevice) {
    return undefined;
  }

  // Get all entities for the device
  const entities = getDeviceEntities(hass, hassDevice.id, hassDevice.name);

  // Map entities to the device object
  sortEntitiesByOrder(config, entities).forEach((entity) => {
    if (shouldSkipEntity(entity, config)) {
      return;
    }

    // Skip already handled entities by translation key
    if (mapEntitiesByTranslationKey(entity, device)) {
      return;
    }

    // Handle other entities by domain
    const domain = computeDomain(entity.entity_id);
    switch (domain) {
      case 'button':
        device.controls.push(entity);
        break;
      case 'sensor':
        device.sensors.push(entity);
        break;
      case 'switch':
        device.switches.push(entity);
        break;
      case 'update':
        device.updates.push(entity);
        break;
    }
  });

  // Sort updates by title (using nullish coalescing for cleaner code)
  device.updates.sort((a, b) => {
    const aTitle = a.attributes.title ?? 'z';
    const bTitle = b.attributes.title ?? 'z';
    return aTitle.localeCompare(bTitle);
  });

  return device;
};
