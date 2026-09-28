import * as actionHandlerModule from '@delegates/action-handler-delegate';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { refreshTime } from '@html/components/refresh-time';
import * as stateDisplayModule from '@html/components/state-display';
import { fixture } from '@open-wc/testing-helpers';
import type { SectionConfig } from '@type/config';
import type { EntityInformation, PiHoleDevice } from '@type/types';
import { expect } from 'chai';
import { html, type TemplateResult } from 'lit';
import { restore, stub } from 'sinon';

describe('refresh-time.ts', () => {
  let mockHass: HomeAssistant;
  let mockDevice: PiHoleDevice;
  let mockElement: HTMLElement;
  let actionHandlerStub: sinon.SinonStub;
  let handleClickActionStub: sinon.SinonStub;
  let stateDisplayStub: sinon.SinonStub;

  beforeEach(() => {
    // Create a mock element
    mockElement = document.createElement('div');

    // Create mock HomeAssistant instance
    mockHass = {
      states: {
        'sensor.pi_hole_latest_data_refresh': {
          state: '2023-05-09 10:15:30',
          entity_id: 'sensor.pi_hole_latest_data_refresh',
          attributes: {
            friendly_name: 'Pi-hole Last Refresh',
          },
        },
      },
    } as unknown as HomeAssistant;

    // Create mock device with refresh entities
    const refreshDataEntity: EntityInformation = {
      entity_id: 'button.pi_hole_refresh_data',
      state: 'off',
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      translation_key: 'action_refresh_data',
      attributes: {
        friendly_name: 'Refresh Data',
        icon: 'mdi:refresh',
      },
    };

    const latestRefreshEntity: EntityInformation = {
      entity_id: 'sensor.pi_hole_latest_data_refresh',
      state: '2023-05-09 10:15:30',
      last_changed: '2024-01-01T00:00:00.000Z',
      last_updated: '2024-01-01T00:00:00.000Z',
      translation_key: 'latest_data_refresh',
      attributes: {
        friendly_name: 'Last Refreshed',
      },
    };

    mockDevice = {
      device_id: 'pi_hole_device',
      action_refresh_data: refreshDataEntity,
      latest_data_refresh: latestRefreshEntity,
      sensors: [],
      switches: [],
      controls: [],
      updates: [],
    } as PiHoleDevice;

    // Stub the action handler functions
    actionHandlerStub = stub(actionHandlerModule, 'actionHandler').returns({});
    handleClickActionStub = stub(
      actionHandlerModule,
      'handleClickAction',
    ).returns({
      handleEvent: () => {},
    });

    // Stub stateDisplay
    stateDisplayStub = stub(stateDisplayModule, 'stateDisplay').returns(
      html`<span class="mock-state-display">Last Refreshed: 10:15:30</span>`,
    );
  });

  afterEach(() => {
    restore();
  });

  it('should render refresh icon and time when both entities are available', async () => {
    const result = refreshTime(mockElement, mockHass, mockDevice);
    const el = await fixture(result as TemplateResult);

    // Test container
    expect(el.tagName.toLowerCase()).to.equal('div');
    expect(el.classList.contains('refresh-time')).to.be.true;

    // Test refresh icon
    const iconEl = el.querySelector('ha-icon');
    expect(iconEl).to.exist;
    expect(iconEl?.getAttribute('icon')).to.equal('mdi:refresh');

    // Test time display
    const timeEl = el.querySelector('.mock-state-display');
    expect(timeEl).to.exist;
    expect(timeEl?.textContent).to.equal('Last Refreshed: 10:15:30');

    // Verify action handlers were properly configured
    expect(actionHandlerStub.calledOnce).to.be.true;
    const expectedConfig: SectionConfig = {
      tap_action: {
        action: 'toggle',
      },
    };
    expect(actionHandlerStub.firstCall.args[0]).to.deep.equal(expectedConfig);

    expect(handleClickActionStub.calledOnce).to.be.true;
    expect(handleClickActionStub.firstCall.args[0]).to.equal(mockElement);
    expect(handleClickActionStub.firstCall.args[1]).to.deep.equal(
      expectedConfig,
    );
    expect(handleClickActionStub.firstCall.args[2]).to.equal(
      mockDevice.action_refresh_data,
    );

    // Verify stateDisplay was called
    expect(stateDisplayStub.calledOnce).to.be.true;
    expect(stateDisplayStub.firstCall.args[0]).to.equal(mockHass);
    expect(stateDisplayStub.firstCall.args[1]).to.equal(
      mockDevice.latest_data_refresh,
    );
  });

  it('should not render refresh icon when action_refresh_data is missing', async () => {
    // Create device without refresh_data entity
    const deviceWithoutRefresh = {
      ...mockDevice,
      action_refresh_data: undefined,
    };

    const result = refreshTime(mockElement, mockHass, deviceWithoutRefresh);
    const el = await fixture(result as TemplateResult);

    // Should still render container
    expect(el.classList.contains('refresh-time')).to.be.true;

    // Should not render refresh icon
    const iconEl = el.querySelector('ha-icon');
    expect(iconEl).to.be.null;

    // Should still render time display
    const timeEl = el.querySelector('.mock-state-display');
    expect(timeEl).to.exist;

    // Verify action handlers were not called
    expect(actionHandlerStub.called).to.be.false;
    expect(handleClickActionStub.called).to.be.false;

    // Verify stateDisplay was still called
    expect(stateDisplayStub.calledOnce).to.be.true;
  });

  it('should not render time display when latest_data_refresh is missing', async () => {
    // Create device without latest_refresh entity
    const deviceWithoutTime = {
      ...mockDevice,
      latest_data_refresh: undefined,
    };

    const result = refreshTime(mockElement, mockHass, deviceWithoutTime);
    const el = await fixture(result as TemplateResult);

    // Should still render container
    expect(el.classList.contains('refresh-time')).to.be.true;

    // Should still render refresh icon
    const iconEl = el.querySelector('ha-icon');
    expect(iconEl).to.exist;

    // Should not render time display
    const timeEl = el.querySelector('.mock-state-display');
    expect(timeEl).to.be.null;

    // Verify action handlers were still called
    expect(actionHandlerStub.calledOnce).to.be.true;
    expect(handleClickActionStub.calledOnce).to.be.true;

    // Verify stateDisplay was not called
    expect(stateDisplayStub.called).to.be.false;
  });

  it('should render empty container when both entities are missing', async () => {
    // Create device without both entities
    const emptyDevice = {
      ...mockDevice,
      action_refresh_data: undefined,
      latest_data_refresh: undefined,
    };

    const result = refreshTime(mockElement, mockHass, emptyDevice);
    const el = await fixture(result as TemplateResult);

    // Should still render container
    expect(el.classList.contains('refresh-time')).to.be.true;

    // Container should be empty (strip comments and whitespace)
    expect(el.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim()).to.equal('');
    expect(el.children.length).to.equal(0);

    // Verify no function calls
    expect(actionHandlerStub.called).to.be.false;
    expect(handleClickActionStub.called).to.be.false;
    expect(stateDisplayStub.called).to.be.false;
  });
});
