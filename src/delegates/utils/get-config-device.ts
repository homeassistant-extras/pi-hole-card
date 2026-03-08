import type { DeviceRegistryEntry } from '@hass/data/device_registry';
import type { HomeAssistant } from '@hass/types';

/**
 * Gets the Pi-hole device information from Home Assistant
 * @param hass - The Home Assistant instance
 * @returns The device object or undefined if the device is not found
 */
export const getConfigDevice = async (
  hass: HomeAssistant,
): Promise<DeviceRegistryEntry | undefined> => {
  const registries: { entry_id: string }[] = await hass.callWS({
    type: 'config_entries/get',
    domain: 'pi_hole_v6',
  });

  const registry = registries[0];

  if (!registry) {
    return undefined;
  }

  return Object.values(hass.devices).find(
    (device: DeviceRegistryEntry) =>
      device.config_entries.includes(registry.entry_id),
  );
};
