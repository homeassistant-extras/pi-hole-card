import { PauseComponent } from '@cards/components/pause/pause';
import * as collapsedStateModule from '@common/collapsed-state';
import * as convertTimeModule from '@common/convert-time';
import * as showSectionModule from '@common/show-section';
import * as featureModule from '@config/feature';
import * as pauseHoleModule from '@delegates/utils/pause-hole';
import type { HomeAssistant } from '@hass/types';
import * as localizeModule from '@localize/localize';
import { fixture, html } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { PiHoleSetup } from '@type/types';
import { expect } from 'chai';
import { nothing } from 'lit';
import { restore, stub } from 'sinon';

describe('PauseComponent', () => {
  let component: PauseComponent;
  let mockHass: HomeAssistant;
  let mockSetup: PiHoleSetup;
  let mockConfig: Config;
  let showSectionStub: sinon.SinonStub;
  let isCollapsedStub: sinon.SinonStub;
  let handlePauseClickStub: sinon.SinonStub;
  let parseTimeToSecondsStub: sinon.SinonStub;
  let formatSecondsToHumanStub: sinon.SinonStub;
  let hasFeatureStub: sinon.SinonStub;
  let localizeStub: sinon.SinonStub;

  beforeEach(async () => {
    // Restore any existing stubs first
    restore();

    // Create mock HomeAssistant instance
    mockHass = {
      language: 'en',
    } as HomeAssistant;

    // Create mock PiHole setup with switches
    mockSetup = {
      holes: [
        {
          device_id: 'pi_hole_device',
          switches: [
            {
              entity_id: 'switch.pihole_1',
              state: 'on',
              attributes: { friendly_name: 'Pi-hole 1' },
              translation_key: undefined,
            },
            {
              entity_id: 'switch.pihole_2',
              state: 'off',
              attributes: { friendly_name: 'Pi-hole 2' },
              translation_key: undefined,
            },
          ],
          sensors: [],
          controls: [],
          updates: [],
        },
      ],
    } as PiHoleSetup;

    // Create mock config
    mockConfig = {
      device_id: 'pi_hole_device',
      pause_durations: [60, 300, 1800], // 1 min, 5 min, 30 min
    };

    // Create stubs for dependencies
    showSectionStub = stub(showSectionModule, 'show');
    showSectionStub.returns(true); // Default to showing sections

    isCollapsedStub = stub(collapsedStateModule, 'isCollapsed');
    isCollapsedStub.returns(false); // Default to expanded sections
    handlePauseClickStub = stub(pauseHoleModule, 'handlePauseClick');

    // Create stubs for convert-time functions
    parseTimeToSecondsStub = stub(convertTimeModule, 'parseTimeToSeconds');
    parseTimeToSecondsStub.callsFake((input) => {
      if (typeof input === 'number') return input;
      if (input === '60') return 60;
      if (input === '5m') return 300;
      if (input === '1h') return 3600;
      return parseInt(String(input), 10) || 0;
    });

    formatSecondsToHumanStub = stub(convertTimeModule, 'formatSecondsToHuman');
    formatSecondsToHumanStub.callsFake((seconds, hass) => {
      if (seconds === 60) return '1 minute';
      if (seconds === 300) return '5 minutes';
      if (seconds === 900) return '15 minutes';
      if (seconds === 1800) return '30 minutes';
      if (seconds === 3600) return '1 hour';
      return `${seconds} seconds`;
    });

    hasFeatureStub = stub(featureModule, 'hasFeature');
    hasFeatureStub.returns(false); // Default to group pausing enabled (disable_group_pausing feature is false)

    localizeStub = stub(localizeModule, 'localize');
    localizeStub.returns('Pause Ad-Blocking');

    // Create and setup component
    component = new PauseComponent();
    component.hass = mockHass;
    component.setup = mockSetup;
    component.config = mockConfig;

    // Force component to update
    component.requestUpdate();
  });

  afterEach(() => {
    restore();
  });

  it('should render nothing when show returns false for pause section', async () => {
    // Configure show to return false for pause section
    showSectionStub.withArgs(mockConfig, 'pause').returns(false);

    // Render component
    const result = component.render();

    // When show returns false, the component should return nothing
    expect(result).to.equal(nothing);
  });

  it('should render pause section with default durations when pause_durations is not provided', async () => {
    // Remove pause_durations from config
    delete mockConfig.pause_durations;
    component.config = mockConfig;

    // Ensure group pausing is disabled for this test
    hasFeatureStub.returns(true); // disable_group_pausing feature is true

    // Render component
    const result = component.render();
    const el = await fixture(html`${result}`);

    // Verify section structure
    expect(el.classList.contains('collapsible-section')).to.be.true;

    // Check section header
    const header = el.querySelector('.section-header');
    expect(header).to.exist;
    expect(header?.textContent?.trim()).to.include('Pause Ad-Blocking');

    // Check pause buttons - should have default values (60, 300, 900)
    const buttons = el.querySelectorAll('mwc-button');
    expect(buttons.length).to.equal(3);
    expect(buttons[0]?.textContent?.trim()).to.equal('1 minute');
    expect(buttons[1]?.textContent?.trim()).to.equal('5 minutes');
    expect(buttons[2]?.textContent?.trim()).to.equal('15 minutes');

    // Verify parsing and formatting functions were called
    expect(parseTimeToSecondsStub.callCount).to.equal(3);
    expect(formatSecondsToHumanStub.callCount).to.equal(3);
  });

  it('should render pause section with custom durations from config', async () => {
    // Render component with custom durations in config
    const result = component.render();
    const el = await fixture(html`${result}`);

    // Check pause buttons - should have custom values (60, 300, 1800)
    const buttons = el.querySelectorAll('mwc-button');
    expect(buttons.length).to.equal(3);
    expect(buttons[0]?.textContent?.trim()).to.equal('1 minute');
    expect(buttons[1]?.textContent?.trim()).to.equal('5 minutes');
    expect(buttons[2]?.textContent?.trim()).to.equal('30 minutes');
  });

  it('should handle string time formats in pause durations', async () => {
    // Update config with string formats
    mockConfig.pause_durations = ['60', '5m', '1h'];
    component.config = mockConfig;

    // Render component
    const result = component.render();
    const el = await fixture(html`${result}`);

    // Check pause buttons display human-readable format
    const buttons = el.querySelectorAll('mwc-button');
    expect(buttons.length).to.equal(3);
    expect(buttons[0]?.textContent?.trim()).to.equal('1 minute');
    expect(buttons[1]?.textContent?.trim()).to.equal('5 minutes');
    expect(buttons[2]?.textContent?.trim()).to.equal('1 hour');

    // Verify parseTimeToSeconds was called with string inputs
    expect(parseTimeToSecondsStub.callCount).to.equal(3);
    expect(parseTimeToSecondsStub.getCall(0).args[0]).to.equal('60');
    expect(parseTimeToSecondsStub.getCall(1).args[0]).to.equal('5m');
    expect(parseTimeToSecondsStub.getCall(2).args[0]).to.equal('1h');
  });

  it('should apply hidden class when section is collapsed', async () => {
    // Configure isCollapsed to return true for pause section
    isCollapsedStub.withArgs(mockConfig, 'pause').returns(true);

    // Render component
    const result = component.render();
    const el = await fixture(html`${result}`);

    // Check that the pause container has the hidden class
    const pauseContainer = el.querySelector('.pause');
    expect(pauseContainer).to.exist;
    expect(pauseContainer?.classList.contains('hidden')).to.be.true;

    // Check that the chevron icon is pointing right (collapsed state)
    const icon = el.querySelector('.caret-icon');
    expect(icon).to.exist;
    expect(icon?.getAttribute('icon')).to.equal('mdi:chevron-right');
  });

  it('should show switch selector when group pausing is enabled', async () => {
    // Enable group pausing (disable_group_pausing feature is false)
    hasFeatureStub.returns(false);

    // Render component
    const result = component.render();
    const el = await fixture(html`${result}`);

    // Check that switch selector is rendered
    const selector = el.querySelector('ha-select');
    expect(selector).to.exist;

    // Check that switch options are rendered
    const listItems = el.querySelectorAll('ha-list-item');
    expect(listItems.length).to.equal(2);
    expect(listItems[0]?.textContent?.trim()).to.equal('Pi-hole 1');
    expect(listItems[1]?.textContent?.trim()).to.equal('Pi-hole 2');
  });

  it('should not show switch selector when group pausing is disabled', async () => {
    // Disable group pausing (disable_group_pausing feature is true)
    hasFeatureStub.returns(true);

    // Render component
    const result = component.render();
    const el = await fixture(html`${result}`);

    // Check that switch selector is not rendered
    const selector = el.querySelector('ha-select');
    expect(selector).to.not.exist;

    // But pause buttons should still be rendered
    const buttons = el.querySelectorAll('mwc-button');
    expect(buttons.length).to.equal(3);
  });

  it('should not show switch selector when no switches are available', async () => {
    // Enable group pausing but provide no switches (disable_group_pausing feature is false)
    hasFeatureStub.returns(false);
    mockSetup.holes = [];
    component.setup = mockSetup;

    // Render component
    const result = component.render();
    const el = await fixture(html`${result}`);

    // Check that switch selector is not rendered
    const selector = el.querySelector('ha-select');
    expect(selector).to.not.exist;
  });

  it('should handle pause button clicks correctly', async () => {
    // Ensure group pausing is disabled (disable_group_pausing feature is true)
    hasFeatureStub.returns(true);

    // Render component
    const result = component.render();
    const el = await fixture(html`${result}`);

    // Get first pause button
    const button = el.querySelector('mwc-button') as HTMLElement;
    expect(button).to.exist;

    // Simulate click
    button.click();

    // Verify handlePauseClick was called with correct parameters
    expect(handlePauseClickStub.calledOnce).to.be.true;
    expect(handlePauseClickStub.firstCall.args[0]).to.equal(mockHass);
    expect(handlePauseClickStub.firstCall.args[1]).to.equal(mockSetup);
    expect(handlePauseClickStub.firstCall.args[2]).to.equal(60);
    expect(handlePauseClickStub.firstCall.args[3]).to.equal(mockConfig);
    expect(handlePauseClickStub.firstCall.args[4]).to.be.undefined; // No target entity when group pausing disabled
  });

  it('should handle pause button clicks with target entity when group pausing enabled', async () => {
    // Enable group pausing (disable_group_pausing feature is false)
    hasFeatureStub.returns(false);

    // Render component
    const result = component.render();
    const el = await fixture(html`${result}`);

    // Get first pause button
    const button = el.querySelector('mwc-button') as HTMLElement;
    expect(button).to.exist;

    // Simulate click
    button.click();

    // Verify handlePauseClick was called with target entity
    expect(handlePauseClickStub.calledOnce).to.be.true;
    // When group pausing is enabled and switches are available, it should auto-select the first switch
    expect(handlePauseClickStub.firstCall.args[3]).to.equal(mockConfig);
    expect(handlePauseClickStub.firstCall.args[4]).to.equal('switch.pihole_1');
  });
});
