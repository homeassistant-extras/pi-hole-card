import { PiHoleCardEditor } from '@cards/editor';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

export default () => {
  describe('editor.ts', () => {
    let card: PiHoleCardEditor;
    let hass: HomeAssistant;
    let dispatchStub: sinon.SinonStub;

    beforeEach(async () => {
      // Create mock HomeAssistant instance
      hass = {} as HomeAssistant;
      card = new PiHoleCardEditor();
      dispatchStub = stub(card, 'dispatchEvent');

      card.hass = hass;
    });

    afterEach(() => {
      dispatchStub.restore();
    });

    describe('initialization', () => {
      it('should be defined', () => {
        expect(card).to.be.instanceOf(PiHoleCardEditor);
      });

      it('should have default properties', () => {
        expect(card.hass).to.exist;
        expect(card['_config']).to.be.undefined;
      });
    });

    describe('setConfig', () => {
      it('should set the configuration correctly', () => {
        const testConfig: Config = {
          device_id: 'device_1',
        };

        card.setConfig(testConfig);
        expect(card['_config']).to.deep.equal(testConfig);
      });
    });

    describe('render', () => {
      it('should return nothing when hass is not set', async () => {
        card.hass = undefined as any;
        const result = card.render();
        expect(result).to.equal(nothing);
      });

      it('should return nothing when config is not set', async () => {
        const result = card.render();
        expect(result).to.equal(nothing);
      });

      it('should render ha-form when both hass and config are set', async () => {
        const testConfig: Config = {
          device_id: 'device_1',
        };
        card.setConfig(testConfig);

        const el = await fixture(card.render() as TemplateResult);
        expect(el.outerHTML).to.equal('<ha-form></ha-form>');
      });

      it('should pass correct props to ha-form', async () => {
        const testConfig: Config = {
          device_id: 'device_1',
        };
        card.setConfig(testConfig);

        const el = await fixture(card.render() as TemplateResult);
        expect((el as any).hass).to.deep.equal(hass);
        expect((el as any).data).to.deep.equal(testConfig);
        expect((el as any).schema).to.deep.equal([
          {
            name: 'device_id',
            selector: {
              device: {
                filter: [
                  {
                    integration: 'pi_hole_v6',
                  },
                  {
                    integration: 'pi_hole',
                  },
                ],
                multiple: true,
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
                    options: [
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
                    ],
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
                    options: [
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
                    ],
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
                    options: [
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
                    ],
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
                    filter: [
                      {
                        integration: 'pi_hole_v6',
                      },
                      {
                        integration: 'pi_hole',
                      },
                    ],
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
                    filter: [
                      {
                        integration: 'pi_hole_v6',
                        domain: ['button', 'sensor', 'switch'],
                      },

                      {
                        integration: 'pi_hole',
                        domain: ['button', 'sensor', 'switch'],
                      },
                    ],
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
                    options: [
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
                    ],
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
                    options: [
                      {
                        label: '60 seconds',
                        value: '60',
                      },
                      {
                        label: '5 minutes',
                        value: '300',
                      },
                      {
                        label: '15 minutes',
                        value: '900',
                      },
                    ],
                  },
                },
              },
              {
                name: 'stats',
                label: 'Statistics',
                type: 'expandable',
                icon: 'mdi:counter',
                schema: [
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
                ],
              },
              {
                name: 'info',
                label: 'Information',
                type: 'expandable',
                icon: 'mdi:information-outline',
                schema: [
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
                ],
              },
              {
                name: 'controls',
                label: 'Controls',
                type: 'expandable',
                icon: 'mdi:remote',
                schema: [
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
                ],
              },
            ],
          },
        ]);
      });
    });

    describe('form behavior', () => {
      it('should compute labels correctly', async () => {
        const testConfig: Config = {
          device_id: 'device_1',
        };
        card.setConfig(testConfig);

        const el = await fixture(card.render() as TemplateResult);
        const computeLabelFn = (el as any).computeLabel;
        expect(computeLabelFn).to.be.a('function');

        // Test the compute label function
        const testSchema = { name: 'test', label: 'Test Label' };
        const result = computeLabelFn(testSchema);
        expect(result).to.equal('Test Label');
      });
    });

    describe('_valueChanged', () => {
      it('should fire config-changed event with config when features are present', () => {
        const testConfig: Config = {
          device_id: 'device_1',
        };
        card.setConfig(testConfig);

        // Simulate value-changed event
        const detail = {
          value: {
            device_id: 'device_1',
          },
        };

        const event = new CustomEvent('value-changed', { detail });
        card['_valueChanged'](event);

        // Verify event was dispatched with correct data
        expect(dispatchStub.calledOnce).to.be.true;
        expect(dispatchStub.firstCall.args[0].type).to.equal('config-changed');
        expect(dispatchStub.firstCall.args[0].detail.config).to.deep.equal({
          device_id: 'device_1',
        });
      });

      it('should handle config without features property', () => {
        const testConfig: Config = {
          device_id: 'device_1',
        };
        card.setConfig(testConfig);

        // Simulate value-changed event without features
        const detail = {
          value: {
            device_id: 'device_1',
          },
        };

        const event = new CustomEvent('value-changed', { detail });
        card['_valueChanged'](event);

        // Verify event was dispatched correctly
        expect(dispatchStub.calledOnce).to.be.true;
        expect(dispatchStub.firstCall.args[0].type).to.equal('config-changed');
        expect(dispatchStub.firstCall.args[0].detail.config).to.deep.equal({
          device_id: 'device_1',
        });
      });

      it('should remove object properties when object is empty', () => {
        const testConfig: Config = {
          device_id: 'device_1',
          stats: {},
          info: {},
          controls: {},
        };
        card.setConfig(testConfig);

        // Simulate value-changed event with empty arrays
        const detail = {
          value: {
            device_id: 'device_2',
            stats: {},
            info: {},
            controls: {},
            exclude_entities: [],
            exclude_sections: [],
            entity_order: [],
          },
        };

        const event = new CustomEvent('value-changed', { detail });
        card['_valueChanged'](event);

        // Verify event was dispatched with features property removed
        expect(dispatchStub.calledOnce).to.be.true;
        expect(dispatchStub.firstCall.args[0].type).to.equal('config-changed');
        expect(dispatchStub.firstCall.args[0].detail.config).to.deep.equal({
          device_id: 'device_2',
        });
        expect(dispatchStub.firstCall.args[0].detail.config.stats).to.be
          .undefined;
        expect(dispatchStub.firstCall.args[0].detail.config.info).to.be
          .undefined;
        expect(dispatchStub.firstCall.args[0].detail.config.controls).to.be
          .undefined;
        expect(dispatchStub.firstCall.args[0].detail.config.exclude_entities).to
          .be.undefined;
        expect(dispatchStub.firstCall.args[0].detail.config.exclude_sections).to
          .be.undefined;
        expect(dispatchStub.firstCall.args[0].detail.config.entity_order).to.be
          .undefined;
      });
    });
  });
};
