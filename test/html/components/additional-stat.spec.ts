import * as actionHandlerModule from '@delegates/action-handler-delegate';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { createAdditionalStat } from '@html/components/additional-stat';
import * as stateDisplayModule from '@html/components/state-display';
import { fixture } from '@open-wc/testing-helpers';
import type { SectionConfig } from '@type/config';
import type { EntityInformation } from '@type/types';
import { expect } from 'chai';
import { html, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('additional-stat.ts', () => {
  let actionHandlerStub: sinon.SinonStub;
  let handleClickActionStub: sinon.SinonStub;
  let stateDisplayStub: sinon.SinonStub;
  let mockHass: HomeAssistant;
  let mockElement: HTMLElement;
  let mockEntity: EntityInformation;
  let mockConfig: SectionConfig;

  beforeEach(() => {
    // Create stubs for action handler functions
    actionHandlerStub = stub(actionHandlerModule, 'actionHandler').returns({
      bind: () => {},
      handleAction: () => {},
    });

    handleClickActionStub = stub(
      actionHandlerModule,
      'handleClickAction',
    ).returns({
      handleEvent: () => {},
    });

    // Stub stateDisplay to return a simple mock
    stateDisplayStub = stub(stateDisplayModule, 'stateDisplay').returns(
      html`<span class="mocked-state-display">42</span>`,
    );

    // Mock HTML element
    mockElement = document.createElement('div');

    // Mock HomeAssistant instance
    mockHass = {
      states: {
        'sensor.test_sensor': {
          entity_id: 'sensor.test_sensor',
          state: '42',
          last_changed: '2024-01-01T00:00:00.000Z',
          last_updated: '2024-01-01T00:00:00.000Z',
          attributes: {
            friendly_name: 'Test Sensor',
            device_class: 'measurement',
            icon: 'mdi:test-icon',
            unit_of_measurement: 'clients',
          },
        },
      },
    } as unknown as HomeAssistant;

    mockConfig = {
      tap_action: {
        action: 'more-info',
      },
    };

    // Create a mock entity for testing
    mockEntity = {
      entity_id: 'sensor.test_sensor',
      state: '42',
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      translation_key: 'test_sensor',
      attributes: {
        friendly_name: 'Test Sensor',
        device_class: 'measurement',
        icon: 'mdi:test-icon',
        unit_of_measurement: 'clients',
      },
    };
  });

  afterEach(() => {
    // Restore all stubs
    actionHandlerStub.restore();
    handleClickActionStub.restore();
    stateDisplayStub.restore();
  });

  it('should render an additional stat with ha-state-icon and state display', async () => {
    // Call createAdditionalStat function
    const result = createAdditionalStat(
      mockHass,
      mockElement,
      mockConfig,
      mockEntity,
    );
    const el = await fixture(result as TemplateResult);

    // Test assertions for the container
    expect(el.tagName.toLowerCase()).to.equal('div');
    expect(el.classList.contains('additional-stat')).to.be.true;

    // Test assertions for ha-state-icon
    const iconEl = el.querySelector('ha-state-icon');
    expect(iconEl).to.exist;
    expect((iconEl as any).hass).to.equal(mockHass);
    expect((iconEl as any).stateObj).to.equal(mockEntity);

    // Test assertions for state display
    const stateDisplayEl = el.querySelector('.mocked-state-display');
    expect(stateDisplayEl).to.exist;
    expect(stateDisplayEl?.textContent).to.equal('42');

    // Verify stateDisplay was called with correct parameters
    expect(stateDisplayStub.calledOnce).to.be.true;
    expect(stateDisplayStub.firstCall.args[0]).to.equal(mockHass);
    expect(stateDisplayStub.firstCall.args[1]).to.equal(mockEntity);
  });

  it('should attach action handlers to the element', async () => {
    const result = createAdditionalStat(
      mockHass,
      mockElement,
      mockConfig,
      mockEntity,
    );
    await fixture(result as TemplateResult);

    // Check that actionHandler was called
    expect(actionHandlerStub.calledOnce).to.be.true;
    expect(actionHandlerStub.firstCall.args[0]).to.equal(mockConfig);

    // Check that handleClickAction was called with the correct arguments
    expect(handleClickActionStub.calledOnce).to.be.true;
    expect(handleClickActionStub.firstCall.args[0]).to.equal(mockElement);
    expect(handleClickActionStub.firstCall.args[1]).to.equal(mockConfig);
    expect(handleClickActionStub.firstCall.args[2]).to.equal(mockEntity);
  });

  it('should work with undefined config', async () => {
    const result = createAdditionalStat(
      mockHass,
      mockElement,
      undefined,
      mockEntity,
    );
    const el = await fixture(result as TemplateResult);

    // Should still render
    expect(el.tagName.toLowerCase()).to.equal('div');
    expect(el.classList.contains('additional-stat')).to.be.true;

    // Action handlers should be called with undefined config
    expect(actionHandlerStub.calledWith(undefined)).to.be.true;
    expect(handleClickActionStub.calledWith(mockElement, undefined, mockEntity))
      .to.be.true;
  });

  it('should handle different entity states correctly', async () => {
    // Test with different entity configurations
    const testCases = [
      {
        entity: {
          ...mockEntity,
          state: 'unavailable',
          last_changed: '2024-01-01T00:00:00.000Z',
          last_updated: '2024-01-01T00:00:00.000Z',
          attributes: { friendly_name: 'Unavailable Sensor' },
        },
        expectedIcon: 'mdi:alert',
        expectedState: 'Unavailable',
      },
      {
        entity: {
          ...mockEntity,
          state: '100',
          last_changed: '2024-01-01T00:00:00.000Z',
          last_updated: '2024-01-01T00:00:00.000Z',
          attributes: {
            friendly_name: 'Percentage Sensor',
            unit_of_measurement: '%',
            icon: 'mdi:percent',
          },
        },
        expectedState: '100%',
      },
    ];

    for (const testCase of testCases) {
      // Reset stubs for each test case
      stateDisplayStub.resetHistory();
      stateDisplayStub.returns(
        html`<span class="mocked-state-display"
          >${testCase.expectedState || 'mock'}</span
        >`,
      );

      const result = createAdditionalStat(
        mockHass,
        mockElement,
        mockConfig,
        testCase.entity,
      );
      const el = await fixture(result as TemplateResult);

      // Check that stateDisplay was called with the test entity
      expect(stateDisplayStub.calledWith(mockHass, testCase.entity)).to.be.true;

      // Check that ha-state-icon was properly configured
      const iconEl = el.querySelector('ha-state-icon');
      expect((iconEl as any).stateObj).to.equal(testCase.entity);
    }
  });
});
