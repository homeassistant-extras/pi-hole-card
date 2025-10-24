import { getState } from '@delegates/retrievers/state';
import type { HomeAssistant } from '@hass/types';
import type { EntityInformation } from '@type/types';

/**
 * Get all entities for a device
 * @param hass - Home Assistant instance
 * @param deviceId - The device ID
 * @param deviceName - The device name
 * @returns - An array of entity information objects
 */
export const getDeviceEntities = (
  hass: HomeAssistant,
  deviceId: string,
  deviceName: string | null,
): EntityInformation[] => {
  const deviceEntities = Object.values(hass.entities)
    .filter(
      (entity) =>
        entity.device_id === deviceId ||
        entity.entity_id === 'update.pi_hole_v6_integration_update', // brittle
    )
    .map((entity) => {
      const state = getState(hass, entity.entity_id);
      if (state === undefined) {
        return;
      }

      // convenience
      const name =
        state.attributes.friendly_name === deviceName
          ? deviceName
          : state.attributes.friendly_name?.replace(deviceName, '').trim();
      return {
        entity_id: entity.entity_id,
        translation_key: entity.translation_key,
        state: state.state,
        attributes: {
          ...state.attributes,
          friendly_name: name,
        },
      };
    })
    .filter((e) => e !== undefined);
  return deviceEntities;
};
