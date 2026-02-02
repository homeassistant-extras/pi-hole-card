import type { Config } from '@type/config';
import type { EntityInformation } from '@type/types';

/**
 * Determines if an entity should be skipped based on configuration
 * @param entity - The entity to check
 * @param config - The configuration object containing exclusion rules
 * @returns True if the entity should be skipped, false otherwise
 */
export const shouldSkipEntity = (
  entity: EntityInformation,
  config: Config,
): boolean => {
  if (!config.exclude_entities?.length) {
    return false;
  }

  return config.exclude_entities.includes(entity.entity_id);
};
