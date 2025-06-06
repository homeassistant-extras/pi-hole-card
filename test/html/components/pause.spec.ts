import * as collapsedStateModule from '@common/collapsed-state';
import * as showSectionModule from '@common/show-section';
import * as toggleSectionModule from '@common/toggle-section';
import * as pauseHoleModule from '@delegates/utils/pause-hole';
import type { HomeAssistant } from '@hass/types';
import { pause } from '@html/components/pause';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { PiHoleSetup } from '@type/types';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

export default () => {
  describe('pause.ts', () => {
    let mockHass: HomeAssistant;
    let mockSetup: PiHoleSetup;
    let mockConfig: Config;
    let showSectionStub: sinon.SinonStub;
    let isCollapsedStub: sinon.SinonStub;
    let toggleSectionStub: sinon.SinonStub;
    let handlePauseClickStub: sinon.SinonStub;

    beforeEach(() => {
      // Create mock HomeAssistant instance
      mockHass = {} as HomeAssistant;

      // Create mock device
      mockSetup = {} as PiHoleSetup;

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

      toggleSectionStub = stub(toggleSectionModule, 'toggleSection');

      handlePauseClickStub = stub(pauseHoleModule, 'handlePauseClick').returns(
        () => {},
      );
    });

    afterEach(() => {
      // Restore all stubs
      showSectionStub.restore();
      isCollapsedStub.restore();
      toggleSectionStub.restore();
      handlePauseClickStub.restore();
    });

    it('should return nothing when show returns false for pause section', async () => {
      // Configure show to return false for pause section
      showSectionStub.withArgs(mockConfig, 'pause').returns(false);

      // Call pause component
      const result = pause(mockHass, mockSetup, mockConfig);

      // Assert that nothing is returned
      expect(result).to.equal(nothing);

      // Verify that other functions were not called
      expect(isCollapsedStub.called).to.be.false;
      expect(handlePauseClickStub.called).to.be.false;
    });

    it('should render pause section with default durations when pause_durations is not provided', async () => {
      // Remove pause_durations from config
      delete mockConfig.pause_durations;

      // Call pause component
      const result = pause(mockHass, mockSetup, mockConfig);
      const el = await fixture(result as TemplateResult);

      // Verify section structure
      expect(el.classList.contains('collapsible-section')).to.be.true;

      // Check section header
      const header = el.querySelector('.section-header');
      expect(header).to.exist;
      expect(header?.textContent?.trim()).to.equal('Pause Ad-Blocking');

      // Check pause buttons - should have default values (60, 300, 900)
      const buttons = el.querySelectorAll('mwc-button');
      expect(buttons.length).to.equal(3);
      expect(buttons[0]?.textContent?.trim()).to.equal('60 seconds');
      expect(buttons[1]?.textContent?.trim()).to.equal('300 seconds');
      expect(buttons[2]?.textContent?.trim()).to.equal('900 seconds');

      // Verify handlePauseClick was called for each duration with correct parameters
      expect(handlePauseClickStub.callCount).to.equal(3);
      expect(handlePauseClickStub.firstCall.args[0]).to.equal(mockHass);
      expect(handlePauseClickStub.firstCall.args[1]).to.equal(mockSetup);
      expect(handlePauseClickStub.firstCall.args[2]).to.equal(60);
      expect(handlePauseClickStub.secondCall.args[2]).to.equal(300);
      expect(handlePauseClickStub.thirdCall.args[2]).to.equal(900);
    });

    it('should render pause section with custom durations from config', async () => {
      // Call pause component with custom durations in config
      const result = pause(mockHass, mockSetup, mockConfig);
      const el = await fixture(result as TemplateResult);

      // Check pause buttons - should have custom values (60, 300, 1800)
      const buttons = el.querySelectorAll('mwc-button');
      expect(buttons.length).to.equal(3);
      expect(buttons[0]?.textContent?.trim()).to.equal('60 seconds');
      expect(buttons[1]?.textContent?.trim()).to.equal('300 seconds');
      expect(buttons[2]?.textContent?.trim()).to.equal('1800 seconds');

      // Verify handlePauseClick was called for each duration with correct parameters
      expect(handlePauseClickStub.callCount).to.equal(3);
      expect(handlePauseClickStub.firstCall.args[2]).to.equal(60);
      expect(handlePauseClickStub.secondCall.args[2]).to.equal(300);
      expect(handlePauseClickStub.thirdCall.args[2]).to.equal(1800);
    });

    it('should apply hidden class when section is collapsed', async () => {
      // Configure isCollapsed to return true for pause section
      isCollapsedStub.withArgs(mockConfig, 'pause').returns(true);

      // Call pause component
      const result = pause(mockHass, mockSetup, mockConfig);
      const el = await fixture(result as TemplateResult);

      // Check that the pause container has the hidden class
      const pauseContainer = el.querySelector('.pause');
      expect(pauseContainer).to.exist;
      expect(pauseContainer?.classList.contains('hidden')).to.be.true;

      // Check that the chevron icon is pointing right (collapsed state)
      const icon = el.querySelector('.caret-icon');
      expect(icon).to.exist;
      expect(icon?.getAttribute('icon')).to.equal('mdi:chevron-right');
    });

    it('should attach click handler to toggle section visibility', async () => {
      // Call pause component
      const result = pause(mockHass, mockSetup, mockConfig);
      const el = await fixture(result as TemplateResult);

      // Get section header
      const header = el.querySelector('.section-header');
      expect(header).to.exist;

      // Simulate click on section header
      header?.dispatchEvent(new Event('click'));

      // Verify toggleSection was called with correct arguments
      expect(toggleSectionStub.calledOnce).to.be.true;
      expect(toggleSectionStub.firstCall.args[1]).to.equal('.pause');
    });
  });
};
