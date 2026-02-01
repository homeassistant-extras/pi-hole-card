import * as getPiHoleModule from '@delegates/utils/get-pihole';
import { getPiSetup } from '@delegates/utils/get-setup';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import { expect } from 'chai';
import { restore, stub } from 'sinon';

describe('get-pi-setup.ts', () => {
  let mockHass: HomeAssistant;
  let mockConfig: Config;
  let getPiHoleStub: sinon.SinonStub;

  beforeEach(() => {
    // Create mock HomeAssistant instance
    mockHass = {} as HomeAssistant;

    // Create mock config with a single device_id
    mockConfig = {
      device_id: 'pi_hole_device_1',
    };

    // Stub the getPiHole function
    getPiHoleStub = stub(getPiHoleModule, 'getPiHole');

    // Default behavior returns mock device for the first device ID
    getPiHoleStub.withArgs(mockHass, mockConfig, 'pi_hole_device_1').returns({
      device_id: 'pi_hole_device_1',
      sensors: [],
      switches: [],
      controls: [],
      updates: [],
    });

    // Default behavior returns undefined for this second device ID
    getPiHoleStub
      .withArgs(mockHass, mockConfig, 'non_existent_device')
      .returns(undefined);

    // Mock a second valid device
    getPiHoleStub.withArgs(mockHass, mockConfig, 'pi_hole_device_2').returns({
      device_id: 'pi_hole_device_2',
      sensors: [],
      switches: [],
      controls: [],
      updates: [],
    });
  });

  afterEach(() => {
    // Restore all stubs
    restore();
  });

  it('should handle a single device_id string', () => {
    // Arrange - using default mockConfig with single device_id

    // Act
    const result = getPiSetup(mockHass, mockConfig);

    // Assert
    expect(result).to.exist;
    expect(result?.holes).to.be.an('array').with.lengthOf(1);
    expect(result?.holes[0]?.device_id).to.equal('pi_hole_device_1');

    // Verify getPiHole was called exactly once with the correct parameters
    expect(getPiHoleStub.calledOnce).to.be.true;
    expect(getPiHoleStub.firstCall.args[0]).to.equal(mockHass);
    expect(getPiHoleStub.firstCall.args[1]).to.equal(mockConfig);
    expect(getPiHoleStub.firstCall.args[2]).to.equal('pi_hole_device_1');
  });

  it('should handle an array of device_ids', () => {
    // Arrange - update config to have multiple device IDs
    mockConfig.device_id = ['pi_hole_device_1', 'pi_hole_device_2'];

    // Act
    const result = getPiSetup(mockHass, mockConfig);

    // Assert
    expect(result).to.exist;
    expect(result?.holes).to.be.an('array').with.lengthOf(2);
    expect(result?.holes[0]?.device_id).to.equal('pi_hole_device_1');
    expect(result?.holes[1]?.device_id).to.equal('pi_hole_device_2');

    // Verify getPiHole was called twice with the correct parameters
    expect(getPiHoleStub.calledTwice).to.be.true;
    expect(getPiHoleStub.firstCall.args[2]).to.equal('pi_hole_device_1');
    expect(getPiHoleStub.secondCall.args[2]).to.equal('pi_hole_device_2');
  });

  it('should filter out non-existent devices', () => {
    // Arrange - config with mix of valid and invalid device IDs
    mockConfig.device_id = [
      'pi_hole_device_1',
      'non_existent_device',
      'pi_hole_device_2',
    ];

    // Act
    const result = getPiSetup(mockHass, mockConfig);

    // Assert
    expect(result).to.exist;
    expect(result?.holes).to.be.an('array').with.lengthOf(2);
    expect(result?.holes[0]?.device_id).to.equal('pi_hole_device_1');
    expect(result?.holes[1]?.device_id).to.equal('pi_hole_device_2');

    // Verify getPiHole was called three times but only two valid devices were returned
    expect(getPiHoleStub.calledThrice).to.be.true;
  });

  it('should return undefined if device_id array is empty', () => {
    // Arrange - config with empty device_id array
    const configWithEmptyDevices: Config = {
      ...mockConfig,
      device_id: [],
    };

    // Act
    const result = getPiSetup(mockHass, configWithEmptyDevices);

    // Assert
    expect(result).to.be.undefined;

    // Verify getPiHole was not called at all
    expect(getPiHoleStub.called).to.be.false;
  });

  it('should return empty holes array if all devices are invalid', () => {
    // Arrange - config with only invalid device IDs
    const configWithInvalidDevices: Config = {
      ...mockConfig,
      device_id: ['non_existent_device_1', 'non_existent_device_2'],
    };

    // Set up stub to return undefined for both device IDs
    getPiHoleStub
      .withArgs(mockHass, configWithInvalidDevices, 'non_existent_device_1')
      .returns(undefined);
    getPiHoleStub
      .withArgs(mockHass, configWithInvalidDevices, 'non_existent_device_2')
      .returns(undefined);

    // Act
    const result = getPiSetup(mockHass, configWithInvalidDevices);

    // Assert
    expect(result).to.exist;
    expect(result?.holes).to.be.an('array').with.lengthOf(0);

    // Verify getPiHole was called twice but no valid devices were found
    expect(getPiHoleStub.calledTwice).to.be.true;
  });

  it('should add switches from additional devices to the first device and limit other device fields', () => {
    // Arrange - Create first device with one switch
    const device1Switch = {
      entity_id: 'switch.pi_hole_1',
      state: 'on',
      attributes: { friendly_name: 'Pi-hole 1' },
      translation_key: undefined,
    };

    const device1Status = {
      entity_id: 'binary_sensor.pi_hole_status_1',
      state: 'on',
      attributes: { friendly_name: 'Pi-hole Status 1' },
      translation_key: undefined,
    };

    const device1 = {
      device_id: 'pi_hole_device_1',
      status: device1Status,
      switches: [device1Switch],
      sensors: [
        {
          entity_id: 'sensor.pi_hole_1_dns_queries',
          state: '1000',
          attributes: {},
          translation_key: 'dns_queries',
        },
      ],
      controls: [
        {
          entity_id: 'button.pi_hole_1_refresh',
          state: 'off',
          attributes: {},
          translation_key: 'refresh',
        },
      ],
      updates: [
        {
          entity_id: 'update.pi_hole_1_core',
          state: 'off',
          attributes: {},
          translation_key: undefined,
        },
      ],
    };

    // Create second device with two switches
    const device2Switch1 = {
      entity_id: 'switch.pi_hole_2_primary',
      state: 'on',
      attributes: { friendly_name: 'Pi-hole 2 Primary' },
      translation_key: undefined,
    };

    const device2Switch2 = {
      entity_id: 'switch.pi_hole_2_secondary',
      state: 'off',
      attributes: { friendly_name: 'Pi-hole 2 Secondary' },
      translation_key: undefined,
    };

    const device2Status = {
      entity_id: 'binary_sensor.pi_hole_status_2',
      state: 'on',
      attributes: { friendly_name: 'Pi-hole Status 2' },
      translation_key: undefined,
    };

    const device2Stats = {
      dns_queries_today: {
        entity_id: 'sensor.pi_hole_2_dns_queries_today',
        state: '2000',
        attributes: {},
        translation_key: 'dns_queries_today',
      },
      ads_blocked_today: {
        entity_id: 'sensor.pi_hole_2_ads_blocked_today',
        state: '200',
        attributes: {},
        translation_key: 'ads_blocked_today',
      },
      ads_percentage_blocked_today: {
        entity_id: 'sensor.pi_hole_2_ads_percentage_blocked_today',
        state: '10.0',
        attributes: { unit_of_measurement: '%' },
        translation_key: 'ads_percentage_blocked_today',
      },
      domains_blocked: {
        entity_id: 'sensor.pi_hole_2_domains_blocked',
        state: '50000',
        attributes: {},
        translation_key: 'domains_blocked',
      },
      dns_unique_clients: {
        entity_id: 'sensor.pi_hole_2_dns_unique_clients',
        state: '15',
        attributes: {},
        translation_key: 'dns_unique_clients',
      },
    };

    const device2 = {
      device_id: 'pi_hole_device_2',
      status: device2Status,
      info_message_count: {
        entity_id: 'sensor.pi_hole_2_info_messages',
        state: '5',
        attributes: {},
        translation_key: undefined,
      },
      purge_diagnosis_messages: {
        entity_id: 'button.pi_hole_2_purge_diagnosis',
        state: 'off',
        attributes: {},
        translation_key: undefined,
      },
      ...device2Stats,
      switches: [device2Switch1, device2Switch2],
      sensors: [
        {
          entity_id: 'sensor.pi_hole_2_dns_queries',
          state: '2000',
          attributes: {},
          translation_key: 'dns_queries',
        },
      ],
      controls: [
        {
          entity_id: 'button.pi_hole_2_refresh',
          state: 'off',
          attributes: {},
          translation_key: 'refresh',
        },
      ],
      updates: [
        {
          entity_id: 'update.pi_hole_2_core',
          state: 'off',
          attributes: {},
          translation_key: undefined,
        },
      ],
    };

    // Set up the stub responses
    getPiHoleStub
      .withArgs(mockHass, mockConfig, 'pi_hole_device_1')
      .returns(device1);
    getPiHoleStub
      .withArgs(mockHass, mockConfig, 'pi_hole_device_2')
      .returns(device2);

    // Set config with multiple device IDs
    mockConfig.device_id = ['pi_hole_device_1', 'pi_hole_device_2'];

    // Act
    const result = getPiSetup(mockHass, mockConfig);

    // Assert
    expect(result).to.exist;
    expect(result?.holes).to.be.an('array').with.lengthOf(2);

    // Check first device has its original switches plus switches from second device
    expect(result?.holes[0]?.switches).to.have.lengthOf(3);
    expect(result?.holes[0]?.switches).to.deep.include(device1Switch);
    expect(result?.holes[0]?.switches).to.deep.include(device2Switch1);
    expect(result?.holes[0]?.switches).to.deep.include(device2Switch2);

    // Check first device still has all its original properties
    expect(result?.holes[0]?.sensors).to.have.lengthOf(1);
    expect(result?.holes[0]?.controls).to.have.lengthOf(1);
    expect(result?.holes[0]?.updates).to.have.lengthOf(1);

    // Check second device has device_id, status, info_message_count, purge_diagnosis_messages, and stats sensors, with empty arrays for other properties
    expect(result?.holes[1]?.device_id).to.equal('pi_hole_device_2');
    expect(result?.holes[1]?.status).to.deep.equal(device2Status);
    expect(result?.holes[1]?.info_message_count).to.deep.equal(
      device2.info_message_count,
    );
    expect(result?.holes[1]?.purge_diagnosis_messages).to.deep.equal(
      device2.purge_diagnosis_messages,
    );
    // Verify stats sensors are preserved for combining statistics
    expect(result?.holes[1]?.dns_queries_today).to.deep.equal(
      device2Stats.dns_queries_today,
    );
    expect(result?.holes[1]?.ads_blocked_today).to.deep.equal(
      device2Stats.ads_blocked_today,
    );
    expect(result?.holes[1]?.ads_percentage_blocked_today).to.deep.equal(
      device2Stats.ads_percentage_blocked_today,
    );
    expect(result?.holes[1]?.domains_blocked).to.deep.equal(
      device2Stats.domains_blocked,
    );
    expect(result?.holes[1]?.dns_unique_clients).to.deep.equal(
      device2Stats.dns_unique_clients,
    );
    expect(result?.holes[1]?.switches).to.be.an('array').with.lengthOf(0);
    expect(result?.holes[1]?.sensors).to.be.an('array').with.lengthOf(0);
    expect(result?.holes[1]?.controls).to.be.an('array').with.lengthOf(0);
    expect(result?.holes[1]?.updates).to.be.an('array').with.lengthOf(0);
  });
});
