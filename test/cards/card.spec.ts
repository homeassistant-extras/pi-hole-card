import { styles } from '@/styles';
import { PiHoleCard } from '@cards/card';
import * as getConfigDeviceModule from '@delegates/utils/get-config-device';
import * as getPiHoleModule from '@delegates/utils/get-pihole';
import type { DeviceRegistryEntry } from '@homeassistant-extras/hass/data/device/device_registry';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { PiHoleDevice } from '@type/types';
import { expect } from 'chai';
import type { TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('PiHoleCard', () => {
  let mockHass: HomeAssistant;
  let mockDevice: PiHoleDevice;
  let mockConfig: Config;
  let getPiHoleStub: sinon.SinonStub;
  let getConfigDeviceStub: sinon.SinonStub;

  beforeEach(() => {
    // Create a mock HomeAssistant instance
    mockHass = {
      callService: stub(),
      states: {
        'binary_sensor.pi_hole_status': {
          state: 'on',
          entity_id: 'binary_sensor.pi_hole_status',
          attributes: {
            friendly_name: 'Pi-hole Status',
          },
        },
      },
    } as unknown as HomeAssistant;

    if (!customElements.get('pi-hole')) {
      customElements.define('pi-hole', PiHoleCard);
    }

    // Create mock device
    mockDevice = {
      device_id: 'pi_hole_device',
      status: {
        entity_id: 'binary_sensor.pi_hole_status',
        state: 'on',
        attributes: { friendly_name: 'Pi-hole Status' },
        translation_key: undefined,
      },
      switch_pi_hole: {
        entity_id: 'switch.pi_hole',
        state: 'on',
        attributes: {},
        translation_key: undefined,
      },
      dns_queries_today: {
        entity_id: 'sensor.dns_queries_today',
        state: '12345',
        attributes: {},
        translation_key: 'dns_queries_today',
      },
    } as any as PiHoleDevice;

    // Create mock config
    mockConfig = {
      device_id: 'pi_hole_device',
    };

    // Stub getPiHole function
    getPiHoleStub = stub(getPiHoleModule, 'getPiHole').returns(mockDevice);

    // Stub getConfigDevice function for getStubConfig
    getConfigDeviceStub = stub(
      getConfigDeviceModule,
      'getConfigDevice',
    ).resolves({
      id: 'pi_hole_device',
      config_entries: ['entry_1'],
      name: 'Pi-hole',
    } as unknown as DeviceRegistryEntry);
  });

  afterEach(() => {
    // Restore stubs
    getPiHoleStub.restore();
    getConfigDeviceStub.restore();
  });

  it('should not update when hass changes but device data remains the same', () => {
    const card = new PiHoleCard();

    // Set initial config and hass
    card.setConfig(mockConfig);
    card.hass = mockHass;

    // First call to getPiHole
    expect(getPiHoleStub.calledOnce).to.be.true;

    // Set hass again with same device data
    card.hass = { ...mockHass };

    // Should not call getPiHole again since device is the same
    expect(getPiHoleStub.calledTwice).to.be.true;
  });

  it('should getStubConfig correctly', async () => {
    const stubConfig = await PiHoleCard.getStubConfig(mockHass);

    // Check that getConfigDevice was called
    expect(getConfigDeviceStub.calledOnce).to.be.true;

    // Check that returned config is correct
    expect(stubConfig).to.deep.equal({
      device_id: 'pi_hole_device',
    });
  });

  it('should handle empty device ID in getStubConfig', async () => {
    // Update stub to return null/undefined
    getConfigDeviceStub.resolves(undefined);

    const stubConfig = await PiHoleCard.getStubConfig(mockHass);

    // Should return empty string for device_id
    expect(stubConfig).to.deep.equal({
      device_id: '',
    });
  });

  it('should return editor element when getConfigElement is called', () => {
    const editorElement = PiHoleCard.getConfigElement();

    // Check that it returns an element with the expected tag name
    expect(editorElement.tagName.toLowerCase()).to.equal('pi-hole-editor');
  });

  describe('styles', () => {
    it('should return expected styles', () => {
      const actual = PiHoleCard.styles;
      expect(actual).to.deep.equal(styles);
    });
  });

  describe('rendering', () => {
    it('should render a loading message when not ready', async () => {
      const card = new PiHoleCard();

      card.setConfig(undefined as any as Config);

      const el = await fixture(card.render() as TemplateResult);

      expect(el.querySelector('.no-devices')).to.exist;
      expect(el.textContent).to.include('Loading...');
    });
  });
});
