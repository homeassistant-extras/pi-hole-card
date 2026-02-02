import { createChartDatasets } from '@cards/components/graph/utils/create-chart-datasets';
import { expect } from 'chai';

describe('create-chart-datasets', () => {
  const mockGetCpuGradient = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    return ctx.createLinearGradient(0, 0, 0, 100);
  };

  const mockGetMemoryGradient = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    return ctx.createLinearGradient(0, 0, 0, 100);
  };

  describe('createChartDatasets', () => {
    it('should create datasets with normal line type', () => {
      const cpuValues = [50, 60, 70];
      const memoryValues = [40, 50, 60];

      const datasets = createChartDatasets(
        cpuValues,
        memoryValues,
        'normal',
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      expect(datasets).to.have.length(2);
      expect(datasets[0]!.label).to.equal('CPU Usage');
      expect(datasets[1]!.label).to.equal('Memory Usage');
      expect(datasets[0]!.data).to.deep.equal(cpuValues);
      expect(datasets[1]!.data).to.deep.equal(memoryValues);
      expect(datasets[0]!.fill).to.be.true;
      expect(datasets[1]!.fill).to.be.true;
    });

    it('should create datasets with gradient line type', () => {
      const cpuValues = [50, 60];
      const memoryValues = [40, 50];

      const datasets = createChartDatasets(
        cpuValues,
        memoryValues,
        'gradient',
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      expect(datasets[0]!.fill).to.be.true;
      expect(datasets[1]!.fill).to.be.true;
      expect(typeof datasets[0]!.borderColor).to.equal('function');
      expect(typeof datasets[1]!.borderColor).to.equal('function');
    });

    it('should create datasets with gradient_no_fill line type', () => {
      const cpuValues = [50, 60];
      const memoryValues = [40, 50];

      const datasets = createChartDatasets(
        cpuValues,
        memoryValues,
        'gradient_no_fill',
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      expect(datasets[0]!.fill).to.be.false;
      expect(datasets[1]!.fill).to.be.false;
      expect(typeof datasets[0]!.borderColor).to.equal('function');
    });

    it('should create datasets with no_fill line type', () => {
      const cpuValues = [50, 60];
      const memoryValues = [40, 50];

      const datasets = createChartDatasets(
        cpuValues,
        memoryValues,
        'no_fill',
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      expect(datasets[0]!.fill).to.be.false;
      expect(datasets[1]!.fill).to.be.false;
      expect(datasets[0]!.borderColor).to.equal('rgb(33, 150, 243)');
      expect(datasets[1]!.borderColor).to.equal('rgb(76, 175, 80)');
    });

    it('should handle undefined line type', () => {
      const cpuValues = [50, 60];
      const memoryValues = [40, 50];

      const datasets = createChartDatasets(
        cpuValues,
        memoryValues,
        undefined,
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      expect(datasets[0]!.fill).to.be.true;
      expect(datasets[1]!.fill).to.be.true;
    });

    it('should handle null values in data', () => {
      const cpuValues = [50, null, 70];
      const memoryValues = [40, null, 60];

      const datasets = createChartDatasets(
        cpuValues,
        memoryValues,
        'normal',
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      expect(datasets[0]!.data).to.deep.equal(cpuValues);
      expect(datasets[1]!.data).to.deep.equal(memoryValues);
    });

    it('should set correct CPU colors for normal type', () => {
      const datasets = createChartDatasets(
        [50],
        [40],
        'normal',
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      expect(datasets[0]!.borderColor).to.equal('rgb(33, 150, 243)');
      expect(datasets[0]!.backgroundColor).to.equal('rgba(33, 150, 243, 0.1)');
    });

    it('should set correct memory colors for normal type', () => {
      const datasets = createChartDatasets(
        [50],
        [40],
        'normal',
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      expect(datasets[1]!.borderColor).to.equal('rgb(76, 175, 80)');
      expect(datasets[1]!.backgroundColor).to.equal('rgba(76, 175, 80, 0.1)');
    });

    it('should set transparent background for no_fill type', () => {
      const datasets = createChartDatasets(
        [50],
        [40],
        'no_fill',
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      expect(datasets[0]!.backgroundColor).to.equal('transparent');
      expect(datasets[1]!.backgroundColor).to.equal('transparent');
    });

    it('should return fallback colors when chartArea is null for gradient backgroundColor', () => {
      const datasets = createChartDatasets(
        [50],
        [40],
        'gradient',
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      const cpuBgColor = datasets[0]!.backgroundColor as (
        context: any,
      ) => string;
      const memoryBgColor = datasets[1]!.backgroundColor as (
        context: any,
      ) => string;

      const mockContext = {
        chart: {
          ctx: {} as CanvasRenderingContext2D,
          chartArea: null,
        },
      };

      expect(cpuBgColor(mockContext)).to.equal('rgba(33, 150, 243, 0.1)');
      expect(memoryBgColor(mockContext)).to.equal('rgba(76, 175, 80, 0.1)');
    });

    it('should return fallback colors when chartArea is null for gradient borderColor', () => {
      const datasets = createChartDatasets(
        [50],
        [40],
        'gradient',
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      const cpuBorderColor = datasets[0]!.borderColor as (
        context: any,
      ) => string;
      const memoryBorderColor = datasets[1]!.borderColor as (
        context: any,
      ) => string;

      const mockContext = {
        chart: {
          ctx: {} as CanvasRenderingContext2D,
          chartArea: null,
        },
      };

      expect(cpuBorderColor(mockContext)).to.equal('rgb(33, 150, 243)');
      expect(memoryBorderColor(mockContext)).to.equal('rgb(76, 175, 80)');
    });

    it('should return fallback colors when chartArea is null for gradient_no_fill borderColor', () => {
      const datasets = createChartDatasets(
        [50],
        [40],
        'gradient_no_fill',
        mockGetCpuGradient,
        mockGetMemoryGradient,
      );

      const cpuBorderColor = datasets[0]!.borderColor as (
        context: any,
      ) => string;
      const memoryBorderColor = datasets[1]!.borderColor as (
        context: any,
      ) => string;

      const mockContext = {
        chart: {
          ctx: {} as CanvasRenderingContext2D,
          chartArea: null,
        },
      };

      expect(cpuBorderColor(mockContext)).to.equal('rgb(33, 150, 243)');
      expect(memoryBorderColor(mockContext)).to.equal('rgb(76, 175, 80)');
    });

    it('should return gradient when chartArea exists for gradient backgroundColor', () => {
      const mockCtx = {
        createLinearGradient: () => {
          return {
            addColorStop: () => {},
          } as unknown as CanvasGradient;
        },
      } as unknown as CanvasRenderingContext2D;

      const mockGetCpuGradientWithCtx = (
        ctx: CanvasRenderingContext2D,
        chartArea: { left: number; right: number; top: number; bottom: number },
        lineType: 'normal' | 'gradient' | 'gradient_no_fill',
      ) => {
        return ctx.createLinearGradient(0, 0, 0, 100);
      };

      const mockGetMemoryGradientWithCtx = (
        ctx: CanvasRenderingContext2D,
        chartArea: { left: number; right: number; top: number; bottom: number },
        lineType: 'normal' | 'gradient' | 'gradient_no_fill',
      ) => {
        return ctx.createLinearGradient(0, 0, 0, 100);
      };

      const datasets = createChartDatasets(
        [50],
        [40],
        'gradient',
        mockGetCpuGradientWithCtx,
        mockGetMemoryGradientWithCtx,
      );

      const cpuBgColor = datasets[0]!.backgroundColor as (
        context: any,
      ) => CanvasGradient;
      const memoryBgColor = datasets[1]!.backgroundColor as (
        context: any,
      ) => CanvasGradient;

      const mockContext = {
        chart: {
          ctx: mockCtx,
          chartArea: { left: 0, right: 100, top: 0, bottom: 100 },
        },
      };

      const cpuResult = cpuBgColor(mockContext);
      const memoryResult = memoryBgColor(mockContext);

      expect(cpuResult).to.exist;
      expect(memoryResult).to.exist;
      expect(cpuResult).to.have.property('addColorStop');
      expect(memoryResult).to.have.property('addColorStop');
    });

    it('should return gradient when chartArea exists for gradient borderColor', () => {
      const mockCtx = {
        createLinearGradient: () => {
          return {
            addColorStop: () => {},
          } as unknown as CanvasGradient;
        },
      } as unknown as CanvasRenderingContext2D;

      const mockGetCpuGradientWithCtx = (
        ctx: CanvasRenderingContext2D,
        chartArea: { left: number; right: number; top: number; bottom: number },
        lineType: 'normal' | 'gradient' | 'gradient_no_fill',
      ) => {
        return ctx.createLinearGradient(0, 0, 0, 100);
      };

      const mockGetMemoryGradientWithCtx = (
        ctx: CanvasRenderingContext2D,
        chartArea: { left: number; right: number; top: number; bottom: number },
        lineType: 'normal' | 'gradient' | 'gradient_no_fill',
      ) => {
        return ctx.createLinearGradient(0, 0, 0, 100);
      };

      const datasets = createChartDatasets(
        [50],
        [40],
        'gradient',
        mockGetCpuGradientWithCtx,
        mockGetMemoryGradientWithCtx,
      );

      const cpuBorderColor = datasets[0]!.borderColor as (
        context: any,
      ) => CanvasGradient;
      const memoryBorderColor = datasets[1]!.borderColor as (
        context: any,
      ) => CanvasGradient;

      const mockContext = {
        chart: {
          ctx: mockCtx,
          chartArea: { left: 0, right: 100, top: 0, bottom: 100 },
        },
      };

      const cpuResult = cpuBorderColor(mockContext);
      const memoryResult = memoryBorderColor(mockContext);

      expect(cpuResult).to.exist;
      expect(memoryResult).to.exist;
      expect(cpuResult).to.have.property('addColorStop');
      expect(memoryResult).to.have.property('addColorStop');
    });

    it('should return gradient when chartArea exists for gradient_no_fill borderColor', () => {
      const mockCtx = {
        createLinearGradient: () => {
          return {
            addColorStop: () => {},
          } as unknown as CanvasGradient;
        },
      } as unknown as CanvasRenderingContext2D;

      const mockGetCpuGradientWithCtx = (
        ctx: CanvasRenderingContext2D,
        chartArea: { left: number; right: number; top: number; bottom: number },
        lineType: 'normal' | 'gradient' | 'gradient_no_fill',
      ) => {
        return ctx.createLinearGradient(0, 0, 0, 100);
      };

      const mockGetMemoryGradientWithCtx = (
        ctx: CanvasRenderingContext2D,
        chartArea: { left: number; right: number; top: number; bottom: number },
        lineType: 'normal' | 'gradient' | 'gradient_no_fill',
      ) => {
        return ctx.createLinearGradient(0, 0, 0, 100);
      };

      const datasets = createChartDatasets(
        [50],
        [40],
        'gradient_no_fill',
        mockGetCpuGradientWithCtx,
        mockGetMemoryGradientWithCtx,
      );

      const cpuBorderColor = datasets[0]!.borderColor as (
        context: any,
      ) => CanvasGradient;
      const memoryBorderColor = datasets[1]!.borderColor as (
        context: any,
      ) => CanvasGradient;

      const mockContext = {
        chart: {
          ctx: mockCtx,
          chartArea: { left: 0, right: 100, top: 0, bottom: 100 },
        },
      };

      const cpuResult = cpuBorderColor(mockContext);
      const memoryResult = memoryBorderColor(mockContext);

      expect(cpuResult).to.exist;
      expect(memoryResult).to.exist;
      expect(cpuResult).to.have.property('addColorStop');
      expect(memoryResult).to.have.property('addColorStop');
    });
  });
});
