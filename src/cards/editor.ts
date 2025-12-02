import { fireEvent } from '@hass/common/dom/fire_event';
import type { HaFormSchema } from '@hass/components/ha-form/types';
import type { SelectOption } from '@hass/data/selector';
import type { HomeAssistant } from '@hass/types';
import { localize } from '@localize/localize';
import type { Config, SectionConfig } from '@type/config';
import type { TranslationKey } from '@type/locale';
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

const getSwitchSpacingOptions = (hass: HomeAssistant): SelectOption[] => {
  const l = (label: TranslationKey) => localize(hass, label);
  return [
    {
      label: l('editor.flex_default'),
      value: 'flex',
    },
    {
      label: l('editor.space_around'),
      value: 'space-around',
    },
    {
      label: l('editor.space_between'),
      value: 'space-between',
    },
  ];
};

const getSectionExcludeOptions = (hass: HomeAssistant): SelectOption[] => {
  const l = (label: TranslationKey) => localize(hass, label);
  return [
    {
      label: l('editor.actions'),
      value: 'actions',
    },
    {
      label: l('editor.chart'),
      value: 'chart',
    },
    {
      label: l('editor.footer'),
      value: 'footer',
    },
    {
      label: l('editor.header'),
      value: 'header',
    },
    {
      label: l('editor.pause_buttons'),
      value: 'pause',
    },
    {
      label: l('editor.statistics'),
      value: 'statistics',
    },
    {
      label: l('editor.sensors'),
      value: 'sensors',
    },
    {
      label: l('editor.switches'),
      value: 'switches',
    },
  ];
};

const getCollapsedSectionOptions = (hass: HomeAssistant): SelectOption[] => {
  const l = (label: TranslationKey) => localize(hass, label);
  return [
    {
      label: l('editor.pause_buttons'),
      value: 'pause',
    },
    {
      label: l('editor.switches'),
      value: 'switches',
    },
    {
      label: l('editor.actions'),
      value: 'actions',
    },
  ];
};

const getPauseDurationOptions = (hass: HomeAssistant): SelectOption[] => {
  const l = (label: TranslationKey) => localize(hass, label);
  return [
    {
      label: l('editor.pause_60_seconds'),
      value: '60s',
    },
    {
      label: l('editor.pause_5_minutes'),
      value: '5m',
    },
    {
      label: l('editor.pause_15_minutes'),
      value: '15m',
    },
  ];
};

const ACTION_SCHEMA = [
  {
    name: 'tap_action',
    label: 'editor.tap_action',
    selector: {
      ui_action: {},
    },
  },
  {
    name: 'hold_action',
    label: 'editor.hold_action',
    selector: {
      ui_action: {},
    },
  },
  {
    name: 'double_tap_action',
    label: 'editor.double_tap_action',
    selector: {
      ui_action: {},
    },
  },
];

const getSchema = (hass: HomeAssistant): HaFormSchema[] => {
  const l = (label: TranslationKey) => localize(hass, label);
  return [
    {
      name: 'device_id',
      selector: {
        device: {
          filter: PI_HOLE_INTEGRATION_FILTER,
          //multiple: true, breaks the drop down?
        },
      },
      required: true,
      label: 'editor.pi_hole_device',
    },
    {
      name: 'content',
      label: 'editor.content',
      type: 'expandable',
      flatten: true,
      icon: 'mdi:text-short',
      schema: [
        {
          name: 'title',
          required: false,
          label: 'editor.card_title',
          selector: {
            text: {},
          },
        },
        {
          name: 'icon',
          required: false,
          label: 'editor.card_icon',
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
      label: 'editor.layout',
      type: 'expandable',
      flatten: true,
      icon: 'mdi:view-grid-plus',
      schema: [
        {
          name: 'exclude_sections',
          label: 'editor.sections_to_exclude',
          required: false,
          selector: {
            select: {
              multiple: true,
              mode: 'list' as const,
              options: getSectionExcludeOptions(hass),
            },
          },
        },
        {
          name: 'collapsed_sections',
          label: 'editor.sections_collapsed_by_default',
          required: false,
          selector: {
            select: {
              multiple: true,
              mode: 'list' as const,
              options: getCollapsedSectionOptions(hass),
            },
          },
        },
        {
          name: 'switch_style',
          label: 'editor.style_for_switches',
          required: false,
          selector: {
            select: {
              multiple: false,
              mode: 'dropdown' as const,
              options: getSwitchSpacingOptions(hass),
            },
          },
        },
        {
          name: 'exclude_entities',
          label: 'editor.entities_to_exclude',
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
          label: 'editor.entity_display_order',
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
      label: 'editor.styles',
      type: 'expandable',
      flatten: true,
      icon: 'mdi:brush-variant',
      schema: [
        {
          name: 'switch_spacing',
          label: 'editor.switch_spacing',
          required: false,
          selector: {
            select: {
              multiple: false,
              mode: 'dropdown' as const,
              options: getSwitchSpacingOptions(hass),
            },
          },
        },
      ],
    },
    {
      name: 'interactions',
      label: 'editor.interactions',
      type: 'expandable',
      flatten: true,
      icon: 'mdi:gesture-tap',
      schema: [
        {
          name: 'pause_durations',
          label: 'editor.pause_durations',
          required: false,
          selector: {
            select: {
              multiple: true,
              custom_value: true,
              mode: 'list' as const,
              options: getPauseDurationOptions(hass),
            },
          },
        },
        {
          name: 'badge',
          label: 'editor.badge',
          type: 'expandable',
          icon: 'mdi:badge-account-horizontal',
          schema: ACTION_SCHEMA,
        },
        {
          name: 'stats',
          label: 'editor.statistics',
          type: 'expandable',
          icon: 'mdi:counter',
          schema: ACTION_SCHEMA,
        },
        {
          name: 'info',
          label: 'editor.information',
          type: 'expandable',
          icon: 'mdi:information-outline',
          schema: ACTION_SCHEMA,
        },
        {
          name: 'controls',
          label: 'editor.controls',
          type: 'expandable',
          icon: 'mdi:remote',
          schema: ACTION_SCHEMA,
        },
      ],
    },
    {
      name: 'chart',
      label: 'editor.chart',
      type: 'expandable' as const,
      icon: 'mdi:chart-line',
      schema: [
        {
          name: 'line_type',
          label: 'editor.chart_line_type',
          required: false,
          selector: {
            select: {
              multiple: false,
              mode: 'dropdown' as const,
              options: [
                {
                  label: l('editor.chart_line_type_normal'),
                  value: 'normal',
                },
                {
                  label: l('editor.chart_line_type_gradient'),
                  value: 'gradient',
                },
                {
                  label: l('editor.chart_line_type_gradient_no_fill'),
                  value: 'gradient_no_fill',
                },
                {
                  label: l('editor.chart_line_type_no_fill'),
                  value: 'no_fill',
                },
              ],
            },
          },
        },
      ],
    },
    {
      name: 'features',
      label: 'editor.features',
      type: 'expandable' as const,
      flatten: true,
      icon: 'mdi:list-box',
      schema: [
        {
          name: 'features',
          label: 'editor.features',
          required: false,
          selector: {
            select: {
              multiple: true,
              mode: 'list' as const,
              options: [
                {
                  label: l('editor.disable_group_pausing'),
                  value: 'disable_group_pausing',
                },
                {
                  label: l('editor.ha_integration'),
                  value: 'ha_integration',
                },
              ],
            },
          },
        },
      ],
    },
  ];
};

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
        .schema=${getSchema(this.hass)}
        .computeLabel=${(s: HaFormSchema) =>
          localize(this.hass, s.label as any)}
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
