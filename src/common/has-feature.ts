import type { Config, Features } from '@type/config';

/**
 * Determines if a specified feature is enabled in the provided configuration
 *
 * @param config - The configuration object containing feature flags
 * @param feature - The specific feature to check for
 * @returns True if the feature is enabled, false otherwise
 */
export const hasFeature = (config: Config, feature: Features): boolean =>
  !config || config.features?.includes(feature) || false;
