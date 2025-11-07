import type { EntityInformation, PiHoleDevice } from '@type/types';

/**
 * Maps entities to the Pi-hole device object based on their translation keys.
 * @param entity - The entity information object
 * @param device - The Pi-hole device object
 * @returns True if the entity was mapped, false otherwise
 */
export const mapEntitiesByTranslationKey = (
  entity: EntityInformation,
  device: PiHoleDevice,
) => {
  const keyToPropertyMap = {
    dns_queries_today: 'dns_queries_today',
    domains_blocked: 'domains_blocked',
    ads_percentage_blocked_today: 'ads_percentage_blocked_today',
    ads_blocked_today: 'ads_blocked_today',
    dns_unique_clients: 'dns_unique_clients',
    remaining_until_blocking_mode: 'remaining_until_blocking_mode',
    action_refresh_data: 'action_refresh_data',
    latest_data_refresh: 'latest_data_refresh',
    ftl_info_message_count: 'info_message_count',
    status: 'status',
    action_ftl_purge_diagnosis_messages: 'purge_diagnosis_messages',

    // backwards compatibility for HA integration
    dns_queries: 'dns_queries_today',
    ads_blocked: 'ads_blocked_today',
    percent_ads_blocked: 'ads_percentage_blocked_today',
    ads_percentage_today: 'ads_percentage_blocked_today',
    domains_being_blocked: 'domains_blocked',
  };

  const key = entity.translation_key;
  if (key && key in keyToPropertyMap) {
    // @ts-ignore
    device[keyToPropertyMap[key]] = entity;
    return true;
  }
  return false;
};
