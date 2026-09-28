import * as collapsedStateModule from '@common/collapsed-state';
import * as showSectionModule from '@common/show-section';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import * as actionControlModule from '@html/components/action-control';
import * as stateContentModule from '@html/components/state-content';
import { createCardActions } from '@html/pi-flavors';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { EntityInformation, PiHoleDevice, PiHoleSetup } from '@type/types';
import { expect } from 'chai';
import { html, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('pi-flavors.ts', () => {
  let mockHass: HomeAssistant;
  let mockSetup: PiHoleSetup;
  let mockDevice: PiHoleDevice;
  let mockElement: HTMLElement;
  let mockConfig: Config;
  let createActionButtonStub: sinon.SinonStub;
  let stateContentStub: sinon.SinonStub;
  let showSectionStub: sinon.SinonStub;
  let isCollapsedStub: sinon.SinonStub;

  beforeEach(() => {
    // Create mock element and hass
    mockElement = document.createElement('div');
    mockHass = {} as HomeAssistant;
    mockSetup = {} as PiHoleSetup;

    // Create stub for show function
    showSectionStub = stub(showSectionModule, 'show');
    showSectionStub.returns(true); // Default to showing sections

    // Create stub for isCollapsed function
    isCollapsedStub = stub(collapsedStateModule, 'isCollapsed');
    isCollapsedStub.returns(false); // Default to not collapsed

    // Create stubs for helper functions
    createActionButtonStub = stub(actionControlModule, 'createActionButton');
    createActionButtonStub.returns(
      html`<mwc-button class="mocked-button"> Mocked Button </mwc-button>`,
    );

    stateContentStub = stub(stateContentModule, 'stateContent');
    stateContentStub.returns(
      html`<div class="mocked-state">Mocked State</div>`,
    );

    // Mock device with switches and controls
    const mockSwitch1: EntityInformation = {
      entity_id: 'switch.pi_hole',
      state: 'on',
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      attributes: {},
      translation_key: undefined,
    };

    const mockSwitch2: EntityInformation = {
      entity_id: 'switch.pi_hole_group',
      state: 'off',
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      attributes: {},
      translation_key: undefined,
    };

    const mockControl1: EntityInformation = {
      entity_id: 'button.refresh_data',
      state: 'off',
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      attributes: {},
      translation_key: undefined,
    };

    const mockControl2: EntityInformation = {
      entity_id: 'button.restart_dns',
      state: 'off',
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      attributes: {},
      translation_key: undefined,
    };

    mockDevice = {
      device_id: 'pi_hole_device',
      switches: [mockSwitch1, mockSwitch2],
      controls: [mockControl1, mockControl2],
    } as PiHoleDevice;

    // Mock config
    mockConfig = {
      device_id: 'pi_hole_device',
      controls: {
        tap_action: {
          action: 'more-info',
        },
      },
    };
  });

  afterEach(() => {
    createActionButtonStub.restore();
    stateContentStub.restore();
    showSectionStub.restore();
    isCollapsedStub.restore();
  });

  it('should render separate divs for switches and actions', async () => {
    // Ensure show returns true for controls section
    showSectionStub.withArgs(mockConfig, 'controls').returns(true);

    const result = createCardActions(
      mockElement,
      mockHass,
      mockSetup,
      mockDevice,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Check container structure
    const switchesDiv = el.querySelector('.switches');
    const actionsDiv = el.querySelector('.actions');

    expect(switchesDiv).to.exist;
    expect(actionsDiv).to.exist;
  });

  it('should add the hidden class to switches section when it is collapsed', async () => {
    // Configure isCollapsed to return true for switches
    isCollapsedStub.withArgs(mockConfig, 'switches').returns(true);
    isCollapsedStub.withArgs(mockConfig, 'actions').returns(false);

    const result = createCardActions(
      mockElement,
      mockHass,
      mockSetup,
      mockDevice,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Check that switches div has the hidden class
    const switchesDiv = el.querySelector('.switches');
    expect(switchesDiv).to.exist;
    expect(switchesDiv!.classList.contains('hidden')).to.be.true;

    // Check that actions div does not have the hidden class
    const actionsDiv = el.querySelector('.actions');
    expect(actionsDiv).to.exist;
    expect(actionsDiv!.classList.contains('hidden')).to.be.false;
  });

  it('should add the hidden class to actions section when it is collapsed', async () => {
    // Configure isCollapsed to return true for actions
    isCollapsedStub.withArgs(mockConfig, 'switches').returns(false);
    isCollapsedStub.withArgs(mockConfig, 'actions').returns(true);

    const result = createCardActions(
      mockElement,
      mockHass,
      mockSetup,
      mockDevice,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Check that switches div does not have the hidden class
    const switchesDiv = el.querySelector('.switches');
    expect(switchesDiv).to.exist;
    expect(switchesDiv!.classList.contains('hidden')).to.be.false;

    // Check that actions div has the hidden class
    const actionsDiv = el.querySelector('.actions');
    expect(actionsDiv).to.exist;
    expect(actionsDiv!.classList.contains('hidden')).to.be.true;
  });

  it('should call stateContent for each switch entity', () => {
    createCardActions(mockElement, mockHass, mockSetup, mockDevice, mockConfig);

    // Verify that stateContent was called for each switch
    expect(stateContentStub.callCount).to.equal(2);
    expect(stateContentStub.firstCall.args[0]).to.equal(mockHass);
    expect(stateContentStub.firstCall.args[1]).to.equal(mockDevice.switches[0]);
    expect(stateContentStub.secondCall.args[0]).to.equal(mockHass);
    expect(stateContentStub.secondCall.args[1]).to.equal(
      mockDevice.switches[1],
    );
  });

  it('should call createActionButton for each control entity', () => {
    createCardActions(mockElement, mockHass, mockSetup, mockDevice, mockConfig);

    // Verify that createActionButton was called for each control
    expect(createActionButtonStub.callCount).to.equal(2);
    expect(createActionButtonStub.firstCall.args[0]).to.equal(mockElement);
    expect(createActionButtonStub.firstCall.args[1]).to.equal(
      mockConfig.controls,
    );
    expect(createActionButtonStub.firstCall.args[2]).to.equal(
      mockDevice.controls[0],
    );

    expect(createActionButtonStub.secondCall.args[0]).to.equal(mockElement);
    expect(createActionButtonStub.secondCall.args[1]).to.equal(
      mockConfig.controls,
    );
    expect(createActionButtonStub.secondCall.args[2]).to.equal(
      mockDevice.controls[1],
    );
  });

  it('should use default config when controls config is missing', () => {
    // Remove controls config
    delete mockConfig.controls;

    createCardActions(mockElement, mockHass, mockSetup, mockDevice, mockConfig);

    // Verify that createActionButton was called with default config
    expect(createActionButtonStub.firstCall.args[1]).to.deep.equal({
      tap_action: {
        action: 'toggle',
      },
      hold_action: {
        action: 'more-info',
      },
      double_tap_action: {
        action: 'more-info',
      },
    });
  });

  it('should handle empty arrays gracefully', async () => {
    // Create a device with empty switches and controls arrays
    const emptyDevice = {
      device_id: 'pi_hole_device',
      switches: [],
      controls: [],
    } as any as PiHoleDevice;

    const result = createCardActions(
      mockElement,
      mockHass,
      mockSetup,
      emptyDevice,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Should still render containers but with no content
    const switchesDiv = el.querySelector('.switches');
    const actionsDiv = el.querySelector('.actions');

    expect(switchesDiv).to.exist;
    expect(actionsDiv).to.exist;

    // Should not call the helper functions
    expect(stateContentStub.callCount).to.equal(0);
    expect(createActionButtonStub.callCount).to.equal(0);
  });

  it('should render pause-component with correct properties', async () => {
    const result = createCardActions(
      mockElement,
      mockHass,
      mockSetup,
      mockDevice,
      mockConfig,
    );
    const el = await fixture(result as TemplateResult);

    // Check that pause-component is rendered
    const pauseComponent: any = el.querySelector('pause-component');
    expect(pauseComponent).to.exist;

    // Check that pause-component has the correct properties set
    expect(pauseComponent!.hass).to.not.be.null;
    expect(pauseComponent!.setup).to.not.be.null;
    expect(pauseComponent!.config).to.not.be.null;
  });
});
