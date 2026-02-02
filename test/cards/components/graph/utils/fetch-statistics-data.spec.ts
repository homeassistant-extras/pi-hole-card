import { fetchStatisticsData } from '@cards/components/graph/utils/fetch-statistics-data';
import type { HomeAssistant } from '@hass/types';
import type { PiHoleDevice } from '@type/types';
import { expect } from 'chai';
import { restore, stub } from 'sinon';

describe('fetch-statistics-data', () => {
  describe('fetchStatisticsData', () => {
    let mockHass: HomeAssistant;
    let mockDevice: PiHoleDevice;
    let callWSStub: sinon.SinonStub;

    beforeEach(() => {
      callWSStub = stub();
      mockHass = {
        callWS: callWSStub,
      } as unknown as HomeAssistant;

      const createSensor = (entity_id: string) => ({
        entity_id,
        state: '42',
        attributes: {},
        translation_key: 'test_key',
      });

      const cpuSensor = createSensor('sensor.pi_hole_cpu_use');
      const memorySensor = createSensor('sensor.pi_hole_memory_use');

      mockDevice = {
        device_id: 'pi_hole_device',
        cpu_use: cpuSensor,
        memory_use: memorySensor,
        sensors: [cpuSensor, memorySensor],
      } as PiHoleDevice;
    });

    afterEach(() => {
      restore();
    });

    it('should fetch statistics data successfully', async () => {
      const now = Date.now();
      const fiveMinutesAgo = now - 5 * 60 * 1000;

      callWSStub.resolves({
        'sensor.pi_hole_cpu_use': [
          {
            start: fiveMinutesAgo,
            end: now,
            mean: 45.5,
          },
        ],
        'sensor.pi_hole_memory_use': [
          {
            start: fiveMinutesAgo,
            end: now,
            mean: 60.2,
          },
        ],
      });

      const result = await fetchStatisticsData({
        hass: mockHass,
        device: mockDevice,
      });

      expect(result.error).to.be.null;
      expect(result.response).to.exist;
      expect(result.response!['sensor.pi_hole_cpu_use']).to.have.length(1);
      expect(result.response!['sensor.pi_hole_memory_use']).to.have.length(1);
      expect(callWSStub.calledOnce).to.be.true;
    });

    it('should return error when CPU sensor is missing', async () => {
      mockDevice = {
        ...mockDevice,
        cpu_use: undefined,
      } as PiHoleDevice;

      const result = await fetchStatisticsData({
        hass: mockHass,
        device: mockDevice,
      });

      expect(result.error).to.equal('CPU or memory sensors not available');
      expect(result.response).to.be.null;
      expect(callWSStub.called).to.be.false;
    });

    it('should return error when memory sensor is missing', async () => {
      mockDevice = {
        ...mockDevice,
        memory_use: undefined,
      } as PiHoleDevice;

      const result = await fetchStatisticsData({
        hass: mockHass,
        device: mockDevice,
      });

      expect(result.error).to.equal('CPU or memory sensors not available');
      expect(result.response).to.be.null;
      expect(callWSStub.called).to.be.false;
    });

    it('should return error when API call fails', async () => {
      callWSStub.rejects(new Error('Network error'));

      const result = await fetchStatisticsData({
        hass: mockHass,
        device: mockDevice,
      });

      expect(result.error).to.equal('Failed to load statistics data');
      expect(result.response).to.be.null;
    });

    it('should call API with correct parameters', async () => {
      callWSStub.resolves({
        'sensor.pi_hole_cpu_use': [],
        'sensor.pi_hole_memory_use': [],
      });

      await fetchStatisticsData({
        hass: mockHass,
        device: mockDevice,
      });

      expect(callWSStub.calledOnce).to.be.true;
      const callArgs = callWSStub.firstCall.args[0];
      expect(callArgs.type).to.equal('recorder/statistics_during_period');
      expect(callArgs.statistic_ids).to.deep.equal([
        'sensor.pi_hole_cpu_use',
        'sensor.pi_hole_memory_use',
      ]);
      expect(callArgs.period).to.equal('5minute');
      expect(callArgs.start_time).to.be.a('string');
      expect(callArgs.end_time).to.be.a('string');
    });

    it('should request 24 hours of data', async () => {
      callWSStub.resolves({
        'sensor.pi_hole_cpu_use': [],
        'sensor.pi_hole_memory_use': [],
      });

      const beforeCall = Date.now();
      await fetchStatisticsData({
        hass: mockHass,
        device: mockDevice,
      });
      const afterCall = Date.now();

      const callArgs = callWSStub.firstCall.args[0];
      const startTime = new Date(callArgs.start_time).getTime();
      const endTime = new Date(callArgs.end_time).getTime();
      const timeRange = endTime - startTime;

      // Should be approximately 24 hours (within 1 second tolerance)
      expect(timeRange).to.be.closeTo(24 * 60 * 60 * 1000, 1000);
      expect(endTime).to.be.closeTo(afterCall, 1000);
      expect(startTime).to.be.closeTo(beforeCall - 24 * 60 * 60 * 1000, 1000);
    });

    it('should handle empty statistics response', async () => {
      callWSStub.resolves({
        'sensor.pi_hole_cpu_use': [],
        'sensor.pi_hole_memory_use': [],
      });

      const result = await fetchStatisticsData({
        hass: mockHass,
        device: mockDevice,
      });

      expect(result.error).to.be.null;
      expect(result.response).to.exist;
      expect(result.response!['sensor.pi_hole_cpu_use']).to.have.length(0);
      expect(result.response!['sensor.pi_hole_memory_use']).to.have.length(0);
    });
  });
});
