import type { Config } from '@type/config';

const defaultPauseDurations: (number | string)[] = [60, 300, 900];

/**
 * Effective pause durations: prefers `pause.durations`, then legacy `pause_durations`, then defaults.
 */
export function getPauseDurations(config: Config): (number | string)[] {
  const nested = config.pause?.durations;
  if (nested !== undefined) {
    return nested.length > 0 ? nested : defaultPauseDurations;
  }
  const legacy = config.pause_durations;
  if (legacy !== undefined) {
    return legacy.length > 0 ? legacy : defaultPauseDurations;
  }
  return defaultPauseDurations;
}
