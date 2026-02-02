import { processStatisticsResponse } from '@cards/components/graph/utils/process-statistics-response';
import type { StatisticsResponse } from '@cards/components/graph/utils/types';
import * as updateChartModule from '@cards/components/graph/utils/update-chart';
import type { PiHoleDevice } from '@type/types';
import { expect } from 'chai';
import type { Chart } from 'chart.js';
import { restore, stub } from 'sinon';

describe('process-statistics-response', () => {
  describe('processStatisticsResponse', () => {
    let mockDevice: PiHoleDevice;
    let mockChart: Chart;
    let updateChartStub: sinon.SinonStub;

    beforeEach(() => {
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

      updateChartStub = stub(updateChartModule, 'updateChart');
      mockChart = {
        data: {
          labels: [],
          datasets: [],
        },
        update: stub(),
      } as unknown as Chart;
    });

    afterEach(() => {
      restore();
    });

    it('should not update chart when CPU sensor is missing', () => {
      mockDevice = {
        ...mockDevice,
        cpu_use: undefined,
      } as PiHoleDevice;

      const response: StatisticsResponse = {
        'sensor.pi_hole_cpu_use': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 45.5,
          },
        ],
        'sensor.pi_hole_memory_use': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 60.2,
          },
        ],
      };

      processStatisticsResponse({
        response,
        device: mockDevice,
        chart: mockChart,
      });

      expect(updateChartStub.called).to.be.false;
    });

    it('should not update chart when memory sensor is missing', () => {
      mockDevice = {
        ...mockDevice,
        memory_use: undefined,
      } as PiHoleDevice;

      const response: StatisticsResponse = {
        'sensor.pi_hole_cpu_use': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 45.5,
          },
        ],
        'sensor.pi_hole_memory_use': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 60.2,
          },
        ],
      };

      processStatisticsResponse({
        response,
        device: mockDevice,
        chart: mockChart,
      });

      expect(updateChartStub.called).to.be.false;
    });

    it('should handle empty statistics response', () => {
      const response: StatisticsResponse = {
        'sensor.pi_hole_cpu_use': [],
        'sensor.pi_hole_memory_use': [],
      };

      processStatisticsResponse({
        response,
        device: mockDevice,
        chart: mockChart,
      });

      expect(updateChartStub.calledOnce).to.be.true;
      const callArgs = updateChartStub.firstCall.args[0];
      expect(callArgs.cpuData).to.have.length(0);
      expect(callArgs.memoryData).to.have.length(0);
    });

    it('should handle missing entity statistics', () => {
      const response: StatisticsResponse = {
        'sensor.pi_hole_cpu_use': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 45.5,
          },
        ],
        // Missing memory sensor data
      };

      processStatisticsResponse({
        response,
        device: mockDevice,
        chart: mockChart,
      });

      expect(updateChartStub.calledOnce).to.be.true;
      const callArgs = updateChartStub.firstCall.args[0];
      expect(callArgs.cpuData).to.have.length(1);
      expect(callArgs.memoryData).to.have.length(0);
    });

    it('should process statistics with state values', () => {
      const response: StatisticsResponse = {
        'sensor.pi_hole_cpu_use': [
          {
            start: 946684800000,
            end: 946684860000,
            state: 50,
          },
        ],
        'sensor.pi_hole_memory_use': [
          {
            start: 946684800000,
            end: 946684860000,
            state: 65,
          },
        ],
      };

      processStatisticsResponse({
        response,
        device: mockDevice,
        chart: mockChart,
      });

      expect(updateChartStub.calledOnce).to.be.true;
      const callArgs = updateChartStub.firstCall.args[0];
      expect(callArgs.cpuData[0]!.value).to.equal(50);
      expect(callArgs.memoryData[0]!.value).to.equal(65);
    });

    it('should use correct entity IDs from device', () => {
      const response: StatisticsResponse = {
        'sensor.pi_hole_cpu_use': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 45.5,
          },
        ],
        'sensor.pi_hole_memory_use': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 60.2,
          },
        ],
      };

      processStatisticsResponse({
        response,
        device: mockDevice,
        chart: mockChart,
      });

      expect(updateChartStub.calledOnce).to.be.true;
      const callArgs = updateChartStub.firstCall.args[0];
      // Verify data is correctly mapped to CPU and memory
      expect(callArgs.cpuData[0]!.value).to.equal(45.5);
      expect(callArgs.memoryData[0]!.value).to.equal(60.2);
    });

    it('should pass lineType to updateChart', () => {
      const response: StatisticsResponse = {
        'sensor.pi_hole_cpu_use': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 45.5,
          },
        ],
        'sensor.pi_hole_memory_use': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 60.2,
          },
        ],
      };

      processStatisticsResponse({
        response,
        device: mockDevice,
        chart: mockChart,
        lineType: 'gradient',
      });

      expect(updateChartStub.calledOnce).to.be.true;
      const callArgs = updateChartStub.firstCall.args[0];
      expect(callArgs.lineType).to.equal('gradient');
    });

    it('should handle null chart gracefully', () => {
      const response: StatisticsResponse = {
        'sensor.pi_hole_cpu_use': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 45.5,
          },
        ],
        'sensor.pi_hole_memory_use': [
          {
            start: 946684800000,
            end: 946684860000,
            mean: 60.2,
          },
        ],
      };

      // Should not throw when chart is null
      expect(() => {
        processStatisticsResponse({
          response,
          device: mockDevice,
          chart: null,
        });
      }).to.not.throw();

      // updateChart should still be called (it handles null internally)
      expect(updateChartStub.calledOnce).to.be.true;
    });
  });
});
