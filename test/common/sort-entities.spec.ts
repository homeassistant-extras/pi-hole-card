import { sortEntitiesByOrder } from '@common/sort-entities';
import type { Config } from '@type/config';
import type { EntityInformation } from '@type/types';
import { expect } from 'chai';

describe('sort-entities-by-order.ts', () => {
  describe('sortEntitiesByOrder', () => {
    // Helper function to create entity objects with minimal required properties
    const createEntity = (
      entity_id: string,
      translation_key?: string,
      state: string = 'on',
      attributes: Record<string, any> = { friendly_name: 'Test Entity' },
    ): EntityInformation => ({
      entity_id,
      translation_key,
      state,
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      attributes,
    });

    it('should return entities in original order when entity_order is undefined', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        // entity_order is undefined
      };

      const entities = [
        createEntity('sensor.test_1'),
        createEntity('sensor.test_2'),
        createEntity('sensor.test_3'),
      ];

      // Act
      const result = sortEntitiesByOrder(config, entities);

      // Assert
      expect(result).to.deep.equal(entities);
      expect(result[0]?.entity_id).to.equal('sensor.test_1');
      expect(result[1]?.entity_id).to.equal('sensor.test_2');
      expect(result[2]?.entity_id).to.equal('sensor.test_3');
    });

    it('should return entities in original order when entity_order is empty array', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        entity_order: [],
      };

      const entities = [
        createEntity('sensor.test_1'),
        createEntity('sensor.test_2'),
        createEntity('sensor.test_3'),
      ];

      // Act
      const result = sortEntitiesByOrder(config, entities);

      // Assert
      expect(result).to.deep.equal(entities);
    });

    it('should sort entities according to entity_order when specified', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        entity_order: ['sensor.test_3', 'sensor.test_1', 'sensor.test_2'],
      };

      const entities = [
        createEntity('sensor.test_1'),
        createEntity('sensor.test_2'),
        createEntity('sensor.test_3'),
      ];

      // Act
      const result = sortEntitiesByOrder(config, entities);

      // Assert
      expect(result[0]?.entity_id).to.equal('sensor.test_3');
      expect(result[1]?.entity_id).to.equal('sensor.test_1');
      expect(result[2]?.entity_id).to.equal('sensor.test_2');
    });

    it('should place entities not in entity_order at the end', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        entity_order: ['sensor.test_2', 'sensor.test_4'], // test_4 doesn't exist, test_1 and test_3 not in order
      };

      const entities = [
        createEntity('sensor.test_1'), // Not in order - should be at end
        createEntity('sensor.test_2'), // First in order
        createEntity('sensor.test_3'), // Not in order - should be at end
      ];

      // Act
      const result = sortEntitiesByOrder(config, entities);

      // Assert
      expect(result[0]?.entity_id).to.equal('sensor.test_2'); // First in entity_order
      expect(result[1]?.entity_id).to.equal('sensor.test_1'); // Not in order, original position preserved
      expect(result[2]?.entity_id).to.equal('sensor.test_3'); // Not in order, original position preserved
    });

    it('should handle entity_order with non-existent entities', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        entity_order: [
          'sensor.non_existent_1',
          'sensor.test_2',
          'sensor.non_existent_2',
          'sensor.test_1',
        ],
      };

      const entities = [
        createEntity('sensor.test_1'),
        createEntity('sensor.test_2'),
        createEntity('sensor.test_3'), // Not in entity_order
      ];

      // Act
      const result = sortEntitiesByOrder(config, entities);

      // Assert
      expect(result[0]?.entity_id).to.equal('sensor.test_2'); // Position 1 in entity_order
      expect(result[1]?.entity_id).to.equal('sensor.test_1'); // Position 3 in entity_order
      expect(result[2]?.entity_id).to.equal('sensor.test_3'); // Not in entity_order, goes to end
    });

    it('should preserve original order for entities not in entity_order', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        entity_order: ['sensor.test_ordered'],
      };

      const entities = [
        createEntity('sensor.test_z'), // Not in order
        createEntity('sensor.test_a'), // Not in order
        createEntity('sensor.test_ordered'), // In order - should be first
        createEntity('sensor.test_b'), // Not in order
      ];

      // Act
      const result = sortEntitiesByOrder(config, entities);

      // Assert
      expect(result[0]?.entity_id).to.equal('sensor.test_ordered'); // From entity_order
      expect(result[1]?.entity_id).to.equal('sensor.test_z'); // Original order preserved
      expect(result[2]?.entity_id).to.equal('sensor.test_a'); // Original order preserved
      expect(result[3]?.entity_id).to.equal('sensor.test_b'); // Original order preserved
    });

    it('should handle empty entities array', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        entity_order: ['sensor.test_1', 'sensor.test_2'],
      };

      const entities: EntityInformation[] = [];

      // Act
      const result = sortEntitiesByOrder(config, entities);

      // Assert
      expect(result).to.be.an('array').with.lengthOf(0);
    });

    it('should handle complex sorting with mixed entity types', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        entity_order: [
          'button.test_refresh',
          'sensor.test_queries',
          'switch.test_toggle',
          'binary_sensor.test_status',
        ],
      };

      const entities = [
        createEntity('switch.test_toggle', 'toggle'),
        createEntity('sensor.test_blocked', 'blocked'), // Not in order
        createEntity('binary_sensor.test_status', 'status'),
        createEntity('button.test_refresh', 'refresh'),
        createEntity('sensor.test_queries', 'queries'),
        createEntity('update.test_core', undefined), // Not in order
      ];

      // Act
      const result = sortEntitiesByOrder(config, entities);

      // Assert
      expect(result[0]?.entity_id).to.equal('button.test_refresh'); // Position 0 in entity_order
      expect(result[1]?.entity_id).to.equal('sensor.test_queries'); // Position 1 in entity_order
      expect(result[2]?.entity_id).to.equal('switch.test_toggle'); // Position 2 in entity_order
      expect(result[3]?.entity_id).to.equal('binary_sensor.test_status'); // Position 3 in entity_order
      expect(result[4]?.entity_id).to.equal('sensor.test_blocked'); // Not in order, original position preserved
      expect(result[5]?.entity_id).to.equal('update.test_core'); // Not in order, original position preserved
    });

    it('should maintain stable sort for entities with same priority', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        entity_order: ['sensor.first'], // Only one entity in order
      };

      const entities = [
        createEntity('sensor.unordered_1'),
        createEntity('sensor.unordered_2'),
        createEntity('sensor.first'), // This should be first
        createEntity('sensor.unordered_3'),
        createEntity('sensor.unordered_4'),
      ];

      // Act
      const result = sortEntitiesByOrder(config, entities);

      // Assert
      expect(result[0]?.entity_id).to.equal('sensor.first');
      // The rest should maintain their relative order
      expect(result[1]?.entity_id).to.equal('sensor.unordered_1');
      expect(result[2]?.entity_id).to.equal('sensor.unordered_2');
      expect(result[3]?.entity_id).to.equal('sensor.unordered_3');
      expect(result[4]?.entity_id).to.equal('sensor.unordered_4');
    });
  });
});
