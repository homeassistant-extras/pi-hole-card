import type { ActionConfig } from '@hass/data/lovelace/config/action';
import type { PiHoleDevice } from '@type/types';
import type { Translation, TranslationKey } from './locale';

/**
 * Configuration settings for the pi-hole card
 */
export interface Config {
  /** Unique identifier for the device */
  device_id: string | string[];

  /** Card title */
  title?: string;

  /** Card icon */
  icon?: string;

  /** actions for badge */
  badge?: SectionConfig;

  /** actions for stats boxes */
  stats?: SectionConfig;

  /** actions for info section */
  info?: SectionConfig;

  /** actions for controls */
  controls?: SectionConfig;

  /** The entities to exclude */
  exclude_entities?: string[];

  /** The sections to exclude */
  exclude_sections?: Sections[];

  /** The order in which entities should be displayed */
  entity_order?: string[];

  /** Sections that should be collapsed by default */
  collapsed_sections?: CollapsibleSections[];

  /**
   * Pause section: button durations and optional custom action.
   * Prefer this over legacy {@link Config.pause_durations}.
   */
  pause?: PauseConfig;

  /**
   * @deprecated Use `pause.durations` instead. Still read when `pause.durations` is omitted.
   */
  pause_durations?: (number | string)[];

  /** Style for the switches */
  switch_spacing?: SwitchSpacing;

  /** Chart configuration */
  chart?: ChartConfig;

  /**
   * Aggregation configuration for multi-Pi-hole setups.
   * Controls how the four main dashboard tiles combine values across instances.
   */
  aggregation?: AggregationConfig;

  /** Options to enable disable features */
  features?: Features[];
}

/**
 * How multi-Pi-hole stats are combined on the dashboard tiles.
 *
 * - `load_balanced` *(default)*: tiles sum across Pi-holes; % Blocked is
 *   weighted by real query volume. Use this when each DNS query hits only one
 *   Pi-hole (round-robin, split-horizon, etc.).
 * - `mirrored`: same as `load_balanced` but **Domains on Lists** and
 *   **Active Clients** are averaged across instances. Use this when every
 *   Pi-hole has identical blocklists and clients query all of them, so a plain
 *   sum would double/triple-count.
 *
 * Per-metric overrides may be added in a future release.
 */
export type AggregationMode = 'load_balanced' | 'mirrored';

export interface AggregationConfig {
  /** Preset describing your multi-Pi-hole topology. Defaults to `load_balanced`. */
  mode?: AggregationMode;
}

/** Nested pause configuration (YAML `pause:`) */
export interface PauseConfig {
  /** Button durations */
  durations?: (number | string)[];

  /** Custom action dispatched as a tap (same as other sections’ `tap_action`) */
  tap_action?: ActionConfig;
}

export type SwitchSpacing = 'flex' | 'space-around' | 'space-between';
export type CollapsibleSections = 'actions' | 'pause' | 'switches';
export type Sections =
  | 'actions'
  | 'chart'
  | 'footer'
  | 'header'
  | 'pause'
  | 'statistics'
  | 'sensors'
  | 'switches';

/** Features to enable or disable functionality */
export type Features = 'disable_group_pausing' | 'ha_integration';

/** Chart configuration */
export interface ChartConfig {
  /** Line type for the chart */
  line_type?: 'normal' | 'gradient' | 'gradient_no_fill' | 'no_fill';
}

export interface SectionConfig {
  /** Action to perform on tap */
  tap_action?: ActionConfig;

  /** Action to perform on hold */
  hold_action?: ActionConfig;

  /** Action to perform on double tap */
  double_tap_action?: ActionConfig;
}

export interface DashboardStatConfig extends StatBoxConfig {
  /** Key of the sensor in the PiHoleDevice */
  sensorKey: keyof PiHoleDevice;
}

export interface StatBoxConfig {
  /** Title of the stat box */
  title: TranslationKey;

  /** The entity to display */
  footer: TranslationKey | Translation;

  /** The element to attach the action to */
  className: string;

  /** Icon name for the background (mdi icon) */
  icon: string;
}
