import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { EntityState } from '@type/types';

/**
 * Retrieves the state of an entity
 *
 * @param {HomeAssistant} hass - The Home Assistant instance
 * @param {string} [entityId] - The ID of the entity
 * @param {boolean} [fakeState=false] - Whether to create a fake state if none exists
 * @returns {State | undefined} The entity's state or undefined
 */

export const getState = (
  hass: HomeAssistant,
  entityId?: string,
  fakeState: boolean = false,
): EntityState | undefined => {
  if (!entityId) return undefined;

  const state =
    hass.states[entityId] ??
    (fakeState
      ? {
          entity_id: entityId,
          state: 'off',
          attributes: {},
          last_changed: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        }
      : undefined);

  if (!state) return undefined;

  return {
    state: state.state,
    attributes: state.attributes,
    entity_id: state.entity_id,
    last_changed: state.last_changed,
    last_updated: state.last_updated,
  };
};
