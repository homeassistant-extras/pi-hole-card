import { shouldSkipEntity } from '@common/skip-entity';
import type { Config } from '@type/config';
import type { EntityInformation } from '@type/types';
import { expect } from 'chai';

describe('entity-filter.ts', () => {
  describe('shouldSkipEntity', () => {
    // Create a test entity that we'll use in multiple tests
    const testEntity: EntityInformation = {
      entity_id: 'sensor.test_entity',
      state: 'on',
      attributes: { friendly_name: 'Test Entity' },
      translation_key: undefined,
    };

    it('should return false when exclude_entities is undefined', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        // exclude_entities is undefined
      };

      // Act
      const result = shouldSkipEntity(testEntity, config);

      // Assert
      expect(result).to.be.false;
    });

    it('should return false when exclude_entities is an empty array', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        exclude_entities: [],
      };

      // Act
      const result = shouldSkipEntity(testEntity, config);

      // Assert
      expect(result).to.be.false;
    });

    it('should return false when the entity is not in exclude_entities', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        exclude_entities: ['sensor.other_entity', 'binary_sensor.some_entity'],
      };

      // Act
      const result = shouldSkipEntity(testEntity, config);

      // Assert
      expect(result).to.be.false;
    });

    it('should return true when the entity is in exclude_entities', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        exclude_entities: ['sensor.test_entity', 'binary_sensor.some_entity'],
      };

      // Act
      const result = shouldSkipEntity(testEntity, config);

      // Assert
      expect(result).to.be.true;
    });

    it('should compare entity_id with case sensitivity', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        exclude_entities: ['SENSOR.TEST_ENTITY', 'sensor.TEST_entity'],
      };

      // Act
      const result = shouldSkipEntity(testEntity, config);

      // Assert - should be false because 'sensor.test_entity' is not in the exclude list (case sensitive)
      expect(result).to.be.false;
    });

    it('should handle multiple entities in exclude_entities', () => {
      // Arrange
      const entities = [
        { ...testEntity, entity_id: 'sensor.entity1' },
        { ...testEntity, entity_id: 'sensor.entity2' },
        { ...testEntity, entity_id: 'sensor.entity3' },
      ];

      const config: Config = {
        device_id: 'test_device',
        exclude_entities: ['sensor.entity1', 'sensor.entity3'],
      };

      // Act & Assert
      expect(shouldSkipEntity(entities[0]!, config)).to.be.true; // sensor.entity1 should be skipped
      expect(shouldSkipEntity(entities[1]!, config)).to.be.false; // sensor.entity2 should not be skipped
      expect(shouldSkipEntity(entities[2]!, config)).to.be.true; // sensor.entity3 should be skipped
    });

    it('should not match partial entity IDs', () => {
      // Arrange
      const config: Config = {
        device_id: 'test_device',
        exclude_entities: ['sensor.test'],
      };

      // Act
      const result = shouldSkipEntity(testEntity, config);

      // Assert - should be false because 'sensor.test' is not exactly 'sensor.test_entity'
      expect(result).to.be.false;
    });
  });
});
