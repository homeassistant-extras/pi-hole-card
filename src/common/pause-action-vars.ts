import type { ActionConfig } from '@hass/data/lovelace/config/action';
import type { Config } from '@type/config';

/** Context for `{{ … }}` placeholders inside `pause.tap_action`. */
export interface PauseActionVarsContext {
  seconds: number;
  config: Config;
  entityId?: string;
}

const WHOLE_PLACEHOLDER = /^\{\{\s*(\w+)\s*\}\}$/;
const EACH_PLACEHOLDER = /\{\{\s*(\w+)\s*\}\}/g;

type PlaceholderLookup = (key: string) => string | number | undefined;

function deviceIdScalar(device_id: string | string[]): string {
  return Array.isArray(device_id) ? (device_id[0] ?? '') : device_id;
}

function substituteString(s: string, lookup: PlaceholderLookup): unknown {
  const t = s.trim();
  const whole = WHOLE_PLACEHOLDER.exec(t);
  if (whole?.[1]) {
    const val = lookup(whole[1]);
    if (val !== undefined) {
      return val;
    }
  }
  return s.replaceAll(EACH_PLACEHOLDER, (match, key: string) => {
    const val = lookup(key);
    if (val === undefined) {
      return match;
    }
    return String(val);
  });
}

function walk(value: unknown, lookup: PlaceholderLookup): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === 'string') {
    return substituteString(value, lookup);
  }
  if (Array.isArray(value)) {
    return value.map((v) => walk(v, lookup));
  }
  if (typeof value === 'object') {
    const o = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(o)) {
      out[k] = walk(o[k], lookup);
    }
    return out;
  }
  return value;
}

/**
 * Deep-clones the pause tap action and replaces whitelisted `{{ name }}` placeholders.
 *
 * Supported names: `pause_seconds`, `pause_minutes` (`seconds / 60`), `device_id`
 * (card config; if `device_id` is an array, the first entry is used), `entity_id`
 * (selected switch when group pause is on; otherwise empty string).
 */
export function substitutePauseActionVars(
  action: ActionConfig,
  context: PauseActionVarsContext,
): ActionConfig {
  const deviceId = deviceIdScalar(context.config.device_id);
  const lookup: PlaceholderLookup = (key) => {
    switch (key) {
      case 'pause_seconds':
        return context.seconds;
      case 'pause_minutes':
        return context.seconds / 60;
      case 'device_id':
        return deviceId;
      case 'entity_id':
        return context.entityId ?? '';
      default:
        return undefined;
    }
  };
  return walk(structuredClone(action), lookup) as ActionConfig;
}
