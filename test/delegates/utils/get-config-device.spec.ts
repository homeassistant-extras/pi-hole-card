import { getConfigDevice } from '@delegates/utils/get-config-device';
import type { DeviceRegistryEntry } from '@homeassistant-extras/hass/data/device/device_registry';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { expect } from 'chai';
import { stub } from 'sinon';

describe('get-config-device.ts', () => {
  let mockHass: HomeAssistant;
  let callWSStub: sinon.SinonStub;

  beforeEach(() => {
    // Create mock callWS function
    callWSStub = stub();

    // Mock Home Assistant instance
    mockHass = {
      callWS: callWSStub,
      devices: {
        pi_hole_device_1: {
          id: 'pi_hole_device_1',
          name: 'Pi-hole',
          config_entries: ['pi_hole_config_entry_1'],
          area_id: 'network',
        },
        other_device: {
          id: 'other_device',
          name: 'Other Device',
          config_entries: ['other_config_entry'],
          area_id: 'living_room',
        },
      } as unknown as Record<string, DeviceRegistryEntry>,
    } as unknown as HomeAssistant;
  });

  it('should return the Pi-hole device when config entry exists', async () => {
    // Mock the callWS response for config entries
    callWSStub
      .withArgs({
        type: 'config_entries/get',
        domain: 'pi_hole_v6',
      })
      .resolves([{ entry_id: 'pi_hole_config_entry_1' }]);

    const result = await getConfigDevice(mockHass);

    // Should return the Pi-hole device
    expect(result).to.exist;
    expect(result?.id).to.equal('pi_hole_device_1');
  });

  it('should return undefined when no Pi-hole config entries exist', async () => {
    // Mock empty config entries response
    callWSStub
      .withArgs({
        type: 'config_entries/get',
        domain: 'pi_hole_v6',
      })
      .resolves([]);

    const result = await getConfigDevice(mockHass);

    // Should return undefined
    expect(result).to.be.undefined;
  });

  it('should return undefined when no matching devices are found', async () => {
    // Mock config entry that doesn't match any device
    callWSStub
      .withArgs({
        type: 'config_entries/get',
        domain: 'pi_hole_v6',
      })
      .resolves([{ entry_id: 'non_existent_config_entry' }]);

    const result = await getConfigDevice(mockHass);

    // Should return undefined
    expect(result).to.be.undefined;
  });

  it('should return the first matching device when multiple devices exist', async () => {
    // Create a second Pi-hole device
    (mockHass.devices as Record<string, DeviceRegistryEntry>)[
      'pi_hole_device_2'
    ] = {
      id: 'pi_hole_device_2',
      config_entries: ['pi_hole_config_entry_1'],
      name: 'Pi-hole 2',
    } as unknown as DeviceRegistryEntry;

    // Mock config entry
    callWSStub
      .withArgs({
        type: 'config_entries/get',
        domain: 'pi_hole_v6',
      })
      .resolves([{ entry_id: 'pi_hole_config_entry_1' }]);

    const result = await getConfigDevice(mockHass);

    // Should return the first matching device
    expect(result).to.exist;
    expect(result?.id).to.equal('pi_hole_device_1');
  });

  it('should handle callWS errors gracefully', async () => {
    // Mock callWS to throw an error
    callWSStub
      .withArgs({
        type: 'config_entries/get',
        domain: 'pi_hole_v6',
      })
      .rejects(new Error('WebSocket error'));

    try {
      await getConfigDevice(mockHass);
      // If we get here, the test failed
      expect.fail('Should have thrown an error');
    } catch (error) {
      // Should throw the error from callWS
      expect(error).to.be.instanceOf(Error);
      expect((error as Error).message).to.equal('WebSocket error');
    }
  });
});
