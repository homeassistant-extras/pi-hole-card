/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/entity.ts
 */

import { arrayLiteralIncludes } from '@hass/common/array/literal-includes';

export const UNAVAILABLE = 'unavailable';
export const UNKNOWN = 'unknown';
export const ON = 'on';
export const OFF = 'off';

export const UNAVAILABLE_STATES = [UNAVAILABLE, UNKNOWN] as const;
export const OFF_STATES = [UNAVAILABLE, UNKNOWN, OFF] as const;

export const isUnavailableState = arrayLiteralIncludes(UNAVAILABLE_STATES);
export const isOffState = arrayLiteralIncludes(OFF_STATES);
