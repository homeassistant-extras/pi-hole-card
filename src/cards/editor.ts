import { fireEvent } from '@hass/common/dom/fire_event';
import type { HaFormSchema } from '@hass/components/ha-form/types';
import type { HomeAssistant } from '@hass/types';
import type { Config, SectionConfig } from '@type/config';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

// Constants for repeated patterns
const PI_HOLE_INTEGRATION_FILTER = [
  {
    integration: 'pi_hole_v6',
  },
  {
    integration: 'pi_hole',
  },
];

const PI_HOLE_ENTITY_FILTER = [
  {
    integration: 'pi_hole_v6',
    domain: ['button', 'sensor', 'switch'],
  },
  {
    integration: 'pi_hole',
    domain: ['button', 'sensor', 'switch'],
  },
];

const SWITCH_SPACING_OPTIONS = [
  {
    label: 'Flex (default)',
    value: 'flex',
  },
  {
    label: 'Space Around',
    value: 'space-around',
  },
  {
    label: 'Space Between',
    value: 'space-between',
  },
];

const SECTION_EXCLUDE_OPTIONS = [
  {
    label: 'Actions',
    value: 'actions',
  },
  {
    label: 'Footer',
    value: 'footer',
  },
  {
    label: 'Header',
    value: 'header',
  },
  {
    label: 'Pause Buttons',
    value: 'pause',
  },
  {
    label: 'Statistics',
    value: 'statistics',
  },
  {
    label: 'Sensors',
    value: 'sensors',
  },
  {
    label: 'Switches',
    value: 'switches',
  },
];

const COLLAPSED_SECTION_OPTIONS = [
  {
    label: 'Pause Buttons',
    value: 'pause',
  },
  {
    label: 'Switches',
    value: 'switches',
  },
  {
    label: 'Actions',
    value: 'actions',
  },
];

const PAUSE_DURATION_OPTIONS = [
  {
    label: '60 seconds',
    value: '60s',
  },
  {
    label: '5 minutes',
    value: '5m',
  },
  {
    label: '15 minutes',
    value: '15m',
  },
];

const ACTION_SCHEMA = [
  {
    name: 'tap_action',
    label: 'Tap Action',
    selector: {
      ui_action: {},
    },
  },
  {
    name: 'hold_action',
    label: 'Hold Action',
    selector: {
      ui_action: {},
    },
  },
  {
    name: 'double_tap_action',
    label: 'Double Tap Action',
    selector: {
      ui_action: {},
    },
  },
];

const SCHEMA: HaFormSchema[] = [
  {
    name: 'device_id',
    selector: {
      device: {
        filter: PI_HOLE_INTEGRATION_FILTER,
        //multiple: true, breaks the drop down?
      },
    },
    required: true,
    label: `Pi-hole Device`,
  },
  {
    name: 'content',
    label: 'Content',
    type: 'expandable',
    flatten: true,
    icon: 'mdi:text-short',
    schema: [
      {
        name: 'title',
        required: false,
        label: 'Card Title',
        selector: {
          text: {},
        },
      },
      {
        name: 'icon',
        required: false,
        label: 'Card Icon',
        selector: {
          icon: {
            placeholder: 'mdi:pi-hole',
          },
        },
      },
    ],
  },
  {
    name: 'layout',
    label: 'Layout',
    type: 'expandable',
    flatten: true,
    icon: 'mdi:view-grid-plus',
    schema: [
      {
        name: 'exclude_sections',
        label: 'Sections to exclude',
        required: false,
        selector: {
          select: {
            multiple: true,
            mode: 'list' as const,
            options: SECTION_EXCLUDE_OPTIONS,
          },
        },
      },
      {
        name: 'collapsed_sections',
        label: 'Sections collapsed by default',
        required: false,
        selector: {
          select: {
            multiple: true,
            mode: 'list' as const,
            options: COLLAPSED_SECTION_OPTIONS,
          },
        },
      },
      {
        name: 'switch_style',
        label: 'Style for switches',
        required: false,
        selector: {
          select: {
            multiple: false,
            mode: 'dropdown' as const,
            options: SWITCH_SPACING_OPTIONS,
          },
        },
      },
      {
        name: 'exclude_entities',
        label: 'Entities to exclude',
        required: false,
        selector: {
          entity: {
            multiple: true,
            filter: PI_HOLE_INTEGRATION_FILTER,
          },
        },
      },
      {
        name: 'entity_order',
        label: 'Entity display order (click in order)',
        required: false,
        selector: {
          entity: {
            multiple: true,
            filter: PI_HOLE_ENTITY_FILTER,
          },
        },
      },
    ],
  },
  {
    name: 'styles',
    label: 'Styles',
    type: 'expandable',
    flatten: true,
    icon: 'mdi:brush-variant',
    schema: [
      {
        name: 'switch_spacing',
        label: 'Switch Spacing',
        required: false,
        selector: {
          select: {
            multiple: false,
            mode: 'dropdown' as const,
            options: SWITCH_SPACING_OPTIONS,
          },
        },
      },
    ],
  },
  {
    name: 'interactions',
    label: 'Interactions',
    type: 'expandable',
    flatten: true,
    icon: 'mdi:gesture-tap',
    schema: [
      {
        name: 'pause_durations',
        label: 'Pause durations',
        required: false,
        selector: {
          select: {
            multiple: true,
            custom_value: true,
            mode: 'list' as const,
            options: PAUSE_DURATION_OPTIONS,
          },
        },
      },
      {
        name: 'badge',
        label: 'Badge',
        type: 'expandable',
        icon: 'mdi:badge-account-horizontal',
        schema: ACTION_SCHEMA,
      },
      {
        name: 'stats',
        label: 'Statistics',
        type: 'expandable',
        icon: 'mdi:counter',
        schema: ACTION_SCHEMA,
      },
      {
        name: 'info',
        label: 'Information',
        type: 'expandable',
        icon: 'mdi:information-outline',
        schema: ACTION_SCHEMA,
      },
      {
        name: 'controls',
        label: 'Controls',
        type: 'expandable',
        icon: 'mdi:remote',
        schema: ACTION_SCHEMA,
      },
    ],
  },
  {
    name: 'features',
    label: 'Features',
    type: 'expandable' as const,
    flatten: true,
    icon: 'mdi:list-box',
    schema: [
      {
        name: 'features',
        label: 'Features',
        required: false,
        selector: {
          select: {
            multiple: true,
            mode: 'list' as const,
            options: [
              {
                label: 'Enable group pausing',
                value: 'group_pausing',
              },
            ],
          },
        },
      },
    ],
  },
];

export class PiHoleCardEditor extends LitElement {
  /**
   * Card configuration object
   */
  @state()
  private _config!: Config;

  /**
   * Home Assistant instance
   * Not marked as @state as it's handled differently
   */
  public hass!: HomeAssistant;

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${(s: HaFormSchema) => s.label}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  /**
   * Sets up the card configuration
   * @param {Config} config - The card configuration
   */
  setConfig(config: Config) {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent) {
    const config = ev.detail.value as Config;

    const shouldDelete = (obj: SectionConfig | undefined) =>
      obj &&
      (Object.keys(obj).length === 0 || Object.values(obj).some((f) => !f));

    if (shouldDelete(config.stats)) {
      delete config.stats;
    }
    if (shouldDelete(config.info)) {
      delete config.info;
    }
    if (shouldDelete(config.controls)) {
      delete config.controls;
    }
    if (shouldDelete(config.badge)) {
      delete config.badge;
    }

    if (!config.exclude_entities?.length) {
      delete config.exclude_entities;
    }

    if (!config.exclude_sections?.length) {
      delete config.exclude_sections;
    }

    if (!config.entity_order?.length) {
      delete config.entity_order;
    }

    if (!config.collapsed_sections?.length) {
      delete config.collapsed_sections;
    }

    // @ts-ignore
    fireEvent(this, 'config-changed', {
      config,
    });
  }
}
