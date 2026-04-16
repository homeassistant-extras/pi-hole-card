import { formatSecondsToHHMMSS } from '@common/convert-time';
import { handlePauseClick } from '@delegates/utils/pause-hole';
import * as fireEventModule from '@hass/common/dom/fire_event';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import type { PiHoleSetup } from '@type/types';
import { expect } from 'chai';
import { stub } from 'sinon';

describe('handle-pause-click.ts', () => {
  let mockHass: HomeAssistant;
  let mockSetup: PiHoleSetup;
  let mockConfig: Config;
  let callServiceStub: sinon.SinonStub;
  let formatTimeStub: sinon.SinonStub;
  let fireEventStub: sinon.SinonStub;

  beforeEach(() => {
    // Create mock HomeAssistant object with a callService stub
    callServiceStub = stub();
    mockHass = {
      callService: callServiceStub,
    } as unknown as HomeAssistant;

    // Create a mock device
    mockSetup = {
      holes: [
        {
          device_id: 'pi_hole_device_1',
        },
      ],
    } as PiHoleSetup;

    // Create a mock config
    mockConfig = {
      device_id: 'pi_hole_device_1',
    } as Config;

    // Create a stub for formatSecondsToHHMMSS
    formatTimeStub = stub();
    (formatSecondsToHHMMSS as unknown) = formatTimeStub;

    fireEventStub = stub(fireEventModule, 'fireEvent');
  });

  afterEach(() => {
    // Restore stubs after each test
    callServiceStub.reset();
    formatTimeStub.reset();
    fireEventStub.restore();
  });

  it('should call service immediately when invoked', () => {
    // Arrange
    const duration = 60;
    const formattedTime = '00:01:00';
    formatTimeStub.withArgs(duration).returns(formattedTime);

    // Act
    handlePauseClick(mockHass, mockSetup, duration, mockConfig);

    // Assert
    expect(formatTimeStub.calledOnceWith(duration)).to.be.true;
    expect(callServiceStub.calledOnce).to.be.true;
    expect(callServiceStub.firstCall.args[0]).to.equal('pi_hole_v6');
    expect(callServiceStub.firstCall.args[1]).to.equal('disable');
    expect(callServiceStub.firstCall.args[2]).to.deep.equal({
      device_id: 'pi_hole_device_1',
      duration: formattedTime,
    });
  });

  it('should call callService with correct parameters when invoked', () => {
    // Arrange
    const duration = 300; // 5 minutes
    const formattedTime = '00:05:00';
    formatTimeStub.withArgs(duration).returns(formattedTime);

    // Act
    handlePauseClick(mockHass, mockSetup, duration, mockConfig);

    // Assert
    expect(formatTimeStub.calledOnceWith(duration)).to.be.true;
    expect(callServiceStub.calledOnce).to.be.true;
    expect(callServiceStub.firstCall.args[0]).to.equal('pi_hole_v6');
    expect(callServiceStub.firstCall.args[1]).to.equal('disable');
    expect(callServiceStub.firstCall.args[2]).to.deep.equal({
      device_id: 'pi_hole_device_1',
      duration: formattedTime,
    });
  });

  it('should format seconds correctly for different durations', () => {
    // Arrange
    const testCases = [
      { seconds: 60, formatted: '00:01:00' },
      { seconds: 300, formatted: '00:05:00' },
      { seconds: 3600, formatted: '01:00:00' },
    ];

    testCases.forEach(({ seconds, formatted }) => {
      // Reset stubs for each test case
      callServiceStub.reset();
      formatTimeStub.reset();

      // Setup formatTimeStub to return the expected formatted time
      formatTimeStub.withArgs(seconds).returns(formatted);

      // Act
      handlePauseClick(mockHass, mockSetup, seconds, mockConfig);

      // Assert
      expect(formatTimeStub.calledOnceWith(seconds)).to.be.true;
      expect(callServiceStub.calledOnce).to.be.true;
      expect(callServiceStub.firstCall.args[2].duration).to.equal(formatted);
    });
  });

  it('should call service with entity-based parameters when entityId is provided', () => {
    // Arrange
    const duration = 300; // 5 minutes
    const formattedTime = '00:05:00';
    const entityId = 'switch.pi_hole_switch';
    formatTimeStub.withArgs(duration).returns(formattedTime);

    // Act
    handlePauseClick(mockHass, mockSetup, duration, mockConfig, entityId);

    // Assert
    expect(formatTimeStub.calledOnceWith(duration)).to.be.true;
    expect(callServiceStub.calledOnce).to.be.true;
    expect(callServiceStub.firstCall.args[0]).to.equal('pi_hole_v6');
    expect(callServiceStub.firstCall.args[1]).to.equal('disable');
    expect(callServiceStub.firstCall.args[2]).to.deep.equal({
      duration: formattedTime,
      entity_id: [entityId],
    });
  });

  it('should use pi_hole domain when ha_integration feature is enabled', () => {
    // Arrange
    const duration = 300;
    const formattedTime = '00:05:00';
    formatTimeStub.withArgs(duration).returns(formattedTime);
    mockConfig.features = ['ha_integration'];

    // Act
    handlePauseClick(mockHass, mockSetup, duration, mockConfig);

    // Assert
    expect(callServiceStub.calledOnce).to.be.true;
    expect(callServiceStub.firstCall.args[0]).to.equal('pi_hole');
    expect(callServiceStub.firstCall.args[1]).to.equal('disable');
  });

  it('should dispatch hass-action when pause.tap_action is set and node is provided', () => {
    const host = document.createElement('div');
    const action = {
      action: 'perform-action' as const,
      perform_action: 'script.turn_on',
      data: { entity_id: 'script.test' },
    };
    mockConfig.pause = { tap_action: action };

    handlePauseClick(
      mockHass,
      mockSetup,
      60,
      mockConfig,
      'switch.pihole_1',
      host,
    );

    expect(fireEventStub.calledOnce).to.be.true;
    expect(fireEventStub.firstCall.args[0]).to.equal(host);
    expect(fireEventStub.firstCall.args[1]).to.equal('hass-action');
    expect(fireEventStub.firstCall.args[2]).to.deep.equal({
      config: { tap_action: action },
      action: 'tap',
    });
    expect(callServiceStub.called).to.be.false;
    expect(formatTimeStub.called).to.be.false;
  });

  it('should substitute pause.tap_action placeholders before hass-action', () => {
    const host = document.createElement('div');
    const action = {
      action: 'perform-action' as const,
      perform_action: 'controld_manager.disable_profile',
      data: {
        minutes: '{{ pause_minutes }}',
        profile_id: ['{{ device_id }}'],
      },
    };
    mockConfig.pause = { tap_action: action };

    handlePauseClick(mockHass, mockSetup, 900, mockConfig, undefined, host);

    const payload = fireEventStub.firstCall.args[2] as {
      config: {
        tap_action: { data: { minutes: number; profile_id: string[] } };
      };
    };
    expect(payload.config.tap_action.data.minutes).to.equal(15);
    expect(payload.config.tap_action.data.profile_id).to.deep.equal([
      'pi_hole_device_1',
    ]);
  });

  it('should not call service or fire event when custom pause tap_action is set but node is missing', () => {
    mockConfig.pause = {
      tap_action: {
        action: 'perform-action',
        perform_action: 'script.turn_on',
      },
    };

    handlePauseClick(mockHass, mockSetup, 60, mockConfig);

    expect(fireEventStub.called).to.be.false;
    expect(callServiceStub.called).to.be.false;
  });

  it('should use pi_hole domain with entityId when ha_integration feature is enabled', () => {
    // Arrange
    const duration = 300;
    const formattedTime = '00:05:00';
    const entityId = 'switch.pi_hole_switch';
    formatTimeStub.withArgs(duration).returns(formattedTime);
    mockConfig.features = ['ha_integration'];

    // Act
    handlePauseClick(mockHass, mockSetup, duration, mockConfig, entityId);

    // Assert
    expect(callServiceStub.calledOnce).to.be.true;
    expect(callServiceStub.firstCall.args[0]).to.equal('pi_hole');
    expect(callServiceStub.firstCall.args[1]).to.equal('disable');
    expect(callServiceStub.firstCall.args[2]).to.deep.equal({
      duration: formattedTime,
      entity_id: [entityId],
    });
  });
});
