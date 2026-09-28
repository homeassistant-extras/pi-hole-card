import * as showSectionModule from '@common/show-section';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import * as refreshTimeModule from '@html/components/refresh-time';
import * as createVersionItemModule from '@html/components/version-item';
import { createFooter } from '@html/pi-tin';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { expect } from 'chai';
import { html, nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('pi-footer.ts', () => {
  let mockHass: HomeAssistant;
  let mockDevice: PiHoleDevice;
  let mockElement: HTMLElement;
  let mockConfig: Config;
  let showSectionStub: sinon.SinonStub;
  let createVersionItemStub: sinon.SinonStub;
  let refreshTimeStub: sinon.SinonStub;

  beforeEach(() => {
    // Create mock element and hass
    mockElement = document.createElement('div');
    mockHass = {} as HomeAssistant;

    // Create stub for show function
    showSectionStub = stub(showSectionModule, 'show');
    showSectionStub.returns(true); // Default to showing sections

    // Create stub for createVersionItem
    createVersionItemStub = stub(createVersionItemModule, 'createVersionItem');
    createVersionItemStub.callsFake((update) => {
      return html`<div
        class="mocked-version-item"
        data-entity-id="${update.entity_id}"
      >
        ${update.attributes.installed_version}
      </div>`;
    });

    // Create stub for refreshTime
    refreshTimeStub = stub(refreshTimeModule, 'refreshTime');
    refreshTimeStub.returns(
      html`<div class="mocked-refresh-time">Refreshed 5 minutes ago</div>`,
    );

    // Mock device with updates array
    mockDevice = {
      device_id: 'pi_hole_device',
      updates: [
        {
          entity_id: 'update.pi_hole_core',
          state: 'off',
          last_changed: '2024-01-01T00:00:00.000Z',
          last_updated: '2024-01-01T00:00:00.000Z',
          translation_key: undefined,
          attributes: {
            friendly_name: 'Pi-hole Core Update',
            title: 'Core',
            installed_version: 'v5.14.2',
            release_url:
              'https://github.com/pi-hole/pi-hole/releases/tag/v5.14.2',
          },
        },
        {
          entity_id: 'update.pi_hole_ftl',
          state: 'off',
          translation_key: undefined,
          attributes: {
            friendly_name: 'Pi-hole FTL Update',
            title: 'FTL',
            installed_version: 'v5.21',
            release_url: 'https://github.com/pi-hole/FTL/releases/tag/v5.21',
          },
        },
      ],
      sensors: [],
      switches: [],
      controls: [],
    } as PiHoleDevice;

    // Mock config
    mockConfig = {
      device_id: 'pi_hole_device',
    };
  });

  afterEach(() => {
    // Restore all stubs
    showSectionStub.restore();
    createVersionItemStub.restore();
    refreshTimeStub.restore();
  });

  it('should return nothing when show returns false for footer section', () => {
    // Configure show to return false for footer section
    showSectionStub.withArgs(mockConfig, 'footer').returns(false);

    // Call createFooter
    const result = createFooter(mockElement, mockHass, mockConfig, mockDevice);

    // Assert that nothing is returned
    expect(result).to.equal(nothing);

    // Verify that helper functions were not called
    expect(createVersionItemStub.called).to.be.false;
    expect(refreshTimeStub.called).to.be.false;
  });

  it('should render footer with version info and refresh time', async () => {
    // Ensure show returns true for footer section
    showSectionStub.withArgs(mockConfig, 'footer').returns(true);

    // Call createFooter
    const result = createFooter(mockElement, mockHass, mockConfig, mockDevice);
    const el = await fixture(result as TemplateResult);

    // Check that the version-info container is rendered
    expect(el.tagName.toLowerCase()).to.equal('div');
    expect(el.classList.contains('version-info')).to.be.true;

    // Check that the mocked refresh time is included
    const refreshTimeEl = el.nextElementSibling;
    expect(refreshTimeEl).to.exist;
    expect(refreshTimeEl?.classList.contains('mocked-refresh-time')).to.be.true;
  });

  it('should call createVersionItem for each update in the device', () => {
    // Call createFooter
    createFooter(mockElement, mockHass, mockConfig, mockDevice);

    // Verify createVersionItem was called for each update
    expect(createVersionItemStub.callCount).to.equal(mockDevice.updates.length);

    // Verify each call was with the correct update
    mockDevice.updates.forEach((update, index) => {
      expect(createVersionItemStub.getCall(index).args[0]).to.equal(update);
    });
  });

  it('should call refreshTime with the correct parameters', () => {
    // Call createFooter
    createFooter(mockElement, mockHass, mockConfig, mockDevice);

    // Verify refreshTime was called with the correct parameters
    expect(refreshTimeStub.calledOnce).to.be.true;
    expect(refreshTimeStub.firstCall.args[0]).to.equal(mockElement);
    expect(refreshTimeStub.firstCall.args[1]).to.equal(mockHass);
    expect(refreshTimeStub.firstCall.args[2]).to.equal(mockDevice);
  });

  it('should handle empty updates array gracefully', async () => {
    // Create a device with empty updates array
    const emptyUpdatesDevice = {
      ...mockDevice,
      updates: [],
    };

    // Call createFooter
    const result = createFooter(
      mockElement,
      mockHass,
      mockConfig,
      emptyUpdatesDevice,
    );
    const el = await fixture(result as TemplateResult);

    // Verify that version-info container still exists but is empty
    expect(el.classList.contains('version-info')).to.be.true;
    expect(el.children.length).to.equal(0);

    // Verify that createVersionItem was not called
    expect(createVersionItemStub.called).to.be.false;

    // Verify that refreshTime was still called
    expect(refreshTimeStub.calledOnce).to.be.true;
  });
});
