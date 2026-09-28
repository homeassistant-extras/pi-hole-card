import type { DeviceRegistryEntry } from '@homeassistant-extras/hass/data/device/device_registry';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';

/**
 * Retrieves device information
 *
 * @param {HomeAssistant} hass - The Home Assistant instance
 * @param {string} deviceId - The ID of the device
 * @returns {Device} The device information, or undefined if not found
 */
export const getDevice = (
  hass: HomeAssistant,
  deviceId: string,
): DeviceRegistryEntry | undefined => hass.devices[deviceId];
