import type { StatisticsDataPoint } from '@cards/components/graph/utils/types';
import { updateChart } from '@cards/components/graph/utils/update-chart';
import { expect } from 'chai';
import type { Chart } from 'chart.js';
import { restore, stub } from 'sinon';

describe('update-chart', () => {
  describe('updateChart', () => {
    let mockChart: Chart;
    let updateStub: sinon.SinonStub;

    beforeEach(() => {
      updateStub = stub();
      mockChart = {
        data: {
          labels: [],
          datasets: [],
        },
        update: updateStub,
      } as unknown as Chart;
    });

    afterEach(() => {
      restore();
    });

    it('should update chart with CPU and memory data', () => {
      const cpuData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000),
          value: 45.5,
        },
        {
          timestamp: new Date(946684860000),
          value: 42.3,
        },
      ];

      const memoryData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000),
          value: 60.2,
        },
        {
          timestamp: new Date(946684860000),
          value: 58.1,
        },
      ];

      updateChart({
        chart: mockChart,
        cpuData,
        memoryData,
      });

      expect(mockChart.data.labels).to.have.length(2);
      expect(mockChart.data.datasets).to.have.length(2);
      expect(updateStub.calledOnce).to.be.true;
      expect(updateStub.calledWith('none')).to.be.true;
    });

    it('should handle empty data arrays', () => {
      const cpuData: StatisticsDataPoint[] = [];
      const memoryData: StatisticsDataPoint[] = [];

      updateChart({
        chart: mockChart,
        cpuData,
        memoryData,
      });

      expect(mockChart.data.labels).to.have.length(0);
      expect(mockChart.data.datasets).to.have.length(2);
      expect(updateStub.calledOnce).to.be.true;
    });

    it('should handle null chart gracefully', () => {
      const cpuData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000),
          value: 45.5,
        },
      ];
      const memoryData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000),
          value: 60.2,
        },
      ];

      // Should not throw when chart is null
      expect(() => {
        updateChart({
          chart: null,
          cpuData,
          memoryData,
        });
      }).to.not.throw();
    });

    it('should merge timestamps from both datasets', () => {
      const cpuData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000),
          value: 45.5,
        },
        {
          timestamp: new Date(946684920000),
          value: 50.0,
        },
      ];

      const memoryData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684860000),
          value: 60.2,
        },
        {
          timestamp: new Date(946684920000),
          value: 58.1,
        },
      ];

      updateChart({
        chart: mockChart,
        cpuData,
        memoryData,
      });

      // Should have 3 unique timestamps
      expect(mockChart.data.labels).to.have.length(3);
    });

    it('should format time labels correctly', () => {
      const cpuData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000), // Fixed timestamp
          value: 45.5,
        },
      ];
      const memoryData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000),
          value: 60.2,
        },
      ];

      updateChart({
        chart: mockChart,
        cpuData,
        memoryData,
      });

      expect(mockChart.data.labels).to.have.length(1);
      expect(mockChart.data.labels[0]).to.be.a('string');
      // Should be formatted as time (e.g., "3:45 PM")
      expect(mockChart.data.labels[0]).to.match(/\d{1,2}:\d{2}\s?(AM|PM)/);
    });

    it('should create datasets with correct line type', () => {
      const cpuData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000),
          value: 45.5,
        },
      ];
      const memoryData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000),
          value: 60.2,
        },
      ];

      updateChart({
        chart: mockChart,
        cpuData,
        memoryData,
        lineType: 'gradient',
      });

      expect(mockChart.data.datasets).to.have.length(2);
      expect(mockChart.data.datasets[0]!.label).to.equal('CPU Usage');
      expect(mockChart.data.datasets[1]!.label).to.equal('Memory Usage');
    });

    it('should handle undefined line type', () => {
      const cpuData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000),
          value: 45.5,
        },
      ];
      const memoryData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000),
          value: 60.2,
        },
      ];

      updateChart({
        chart: mockChart,
        cpuData,
        memoryData,
        lineType: undefined,
      });

      expect(mockChart.data.datasets).to.have.length(2);
      expect(updateStub.calledOnce).to.be.true;
    });

    it('should interpolate data points correctly', () => {
      const cpuData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684800000),
          value: 45.5,
        },
      ];
      const memoryData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684860000), // Different timestamp
          value: 60.2,
        },
      ];

      updateChart({
        chart: mockChart,
        cpuData,
        memoryData,
      });

      // Should have 2 labels (one for each timestamp)
      expect(mockChart.data.labels).to.have.length(2);
      // Datasets should have interpolated values
      expect(mockChart.data.datasets[0]!.data).to.have.length(2);
      expect(mockChart.data.datasets[1]!.data).to.have.length(2);
    });

    it('should sort timestamps correctly', () => {
      const cpuData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684920000), // Later timestamp
          value: 50.0,
        },
        {
          timestamp: new Date(946684800000), // Earlier timestamp
          value: 45.5,
        },
      ];
      const memoryData: StatisticsDataPoint[] = [
        {
          timestamp: new Date(946684860000), // Middle timestamp
          value: 60.2,
        },
      ];

      updateChart({
        chart: mockChart,
        cpuData,
        memoryData,
      });

      // Should have 3 labels sorted by time
      expect(mockChart.data.labels).to.have.length(3);
      // Verify datasets have correct length
      expect(mockChart.data.datasets[0]!.data).to.have.length(3);
      expect(mockChart.data.datasets[1]!.data).to.have.length(3);
    });
  });
});
