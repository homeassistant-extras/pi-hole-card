/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/entity_registry.ts
 */

export type EntityCategory = 'config' | 'diagnostic';

export interface EntityRegistryDisplayEntry {
  entity_id: string;
  device_id: string;
  translation_key?: string;
}
