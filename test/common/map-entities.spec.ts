import { mapEntitiesByTranslationKey } from '@common/map-entities';
import type { EntityInformation, PiHoleDevice } from '@type/types';
import { expect } from 'chai';

describe('map-entities.ts', () => {
  describe('mapEntitiesByTranslationKey', () => {
    let device: PiHoleDevice;

    beforeEach(() => {
      // Reset the device object before each test
      device = {
        device_id: 'test_device',
        controls: [],
        sensors: [],
        switches: [],
        updates: [],
      } as PiHoleDevice;
    });

    it('should map entity with known translation key to correct device property', () => {
      // Create test entity with a known translation key
      const entity: EntityInformation = {
        entity_id: 'sensor.dns_queries_today',
        state: '1234',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: { friendly_name: 'DNS Queries Today' },
        translation_key: 'dns_queries_today',
      };

      // Map the entity to the device
      const result = mapEntitiesByTranslationKey(entity, device);

      // Check that the mapping was successful
      expect(result).to.be.true;
      expect(device.dns_queries_today).to.equal(entity);
    });

    it('should map action_ftl_purge_diagnosis_messages to purge_diagnosis_messages property', () => {
      // Create test entity with the new translation key
      const entity: EntityInformation = {
        entity_id: 'button.purge_diagnosis_messages',
        state: 'off',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: { friendly_name: 'Purge Diagnosis Messages' },
        translation_key: 'action_ftl_purge_diagnosis_messages',
      };

      // Map the entity to the device
      const result = mapEntitiesByTranslationKey(entity, device);

      // Check that the mapping was successful
      expect(result).to.be.true;
      expect(device.purge_diagnosis_messages).to.equal(entity);
    });

    it('should map all supported translation keys correctly', () => {
      // Define all supported translation keys and their corresponding property names
      const supportedKeys = [
        { key: 'dns_queries_today', prop: 'dns_queries_today' },
        { key: 'domains_blocked', prop: 'domains_blocked' },
        {
          key: 'ads_percentage_blocked_today',
          prop: 'ads_percentage_blocked_today',
        },
        { key: 'ads_blocked_today', prop: 'ads_blocked_today' },
        { key: 'dns_unique_clients', prop: 'dns_unique_clients' },
        // official HA integration key
        { key: 'unique_clients', prop: 'dns_unique_clients' },
        {
          key: 'remaining_until_blocking_mode',
          prop: 'remaining_until_blocking_mode',
        },
        { key: 'action_refresh_data', prop: 'action_refresh_data' },
        { key: 'latest_data_refresh', prop: 'latest_data_refresh' },
        { key: 'ftl_info_message_count', prop: 'info_message_count' },
        { key: 'status', prop: 'status' },
        {
          key: 'action_ftl_purge_diagnosis_messages',
          prop: 'purge_diagnosis_messages',
        },
      ];

      // Test each key
      supportedKeys.forEach((item) => {
        const testEntity: EntityInformation = {
          entity_id: `sensor.test_${item.key}`,
          state: 'test_state',
          last_changed: '2024-01-01T00:00:00.000Z',
          last_updated: '2024-01-01T00:00:00.000Z',
          attributes: { friendly_name: `Test ${item.key}` },
          translation_key: item.key,
        };

        const result = mapEntitiesByTranslationKey(testEntity, device);

        expect(result).to.be.true;
        // @ts-ignore - We know this property exists on the type
        expect(device[item.prop]).to.equal(testEntity);
      });
    });

    it('should return false for entity with unknown translation key', () => {
      // Create test entity with an unknown translation key
      const entity: EntityInformation = {
        entity_id: 'sensor.unknown_entity',
        state: 'unknown',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: { friendly_name: 'Unknown Entity' },
        translation_key: 'unknown_key',
      };

      // Map the entity to the device
      const result = mapEntitiesByTranslationKey(entity, device);

      // Check that the mapping was unsuccessful
      expect(result).to.be.false;
      // @ts-ignore - Property doesn't exist on type
      expect(device.unknown_key).to.be.undefined;
    });

    it('should return false for entity with undefined translation key', () => {
      // Create test entity with an undefined translation key
      const entity: EntityInformation = {
        entity_id: 'sensor.no_translation_key',
        state: 'value',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: { friendly_name: 'No Translation Key' },
        translation_key: undefined,
      };

      // Map the entity to the device
      const result = mapEntitiesByTranslationKey(entity, device);

      // Check that the mapping was unsuccessful
      expect(result).to.be.false;
    });

    it('should not modify other properties of the device object', () => {
      // Set up a device with some existing properties
      device.dns_queries_today = {
        entity_id: 'sensor.existing_queries',
        state: '5000',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: { friendly_name: 'Existing Queries' },
        translation_key: 'dns_queries_today',
      };

      // Create test entity with a different translation key
      const entity: EntityInformation = {
        entity_id: 'sensor.domains_blocked',
        state: '50000',
        last_changed: '2024-01-01T00:00:00.000Z',
        last_updated: '2024-01-01T00:00:00.000Z',
        attributes: { friendly_name: 'Domains Blocked' },
        translation_key: 'domains_blocked',
      };

      // Map the new entity to the device
      mapEntitiesByTranslationKey(entity, device);

      // Check that the existing property wasn't modified
      expect(device.dns_queries_today.entity_id).to.equal(
        'sensor.existing_queries',
      );
      // Check that the new property was added
      expect(device.domains_blocked).to.equal(entity);
    });
  });
});
