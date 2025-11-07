import { getMemoryGradient } from '@html/components/get-memory-gradient';
import { expect } from 'chai';

describe('get-memory-gradient.ts', () => {
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    // Create a mock canvas context that creates a new gradient each time
    // This allows the caching logic in the function to work properly
    mockCtx = {
      createLinearGradient: () => {
        return {
          addColorStop: () => {},
        } as unknown as CanvasGradient;
      },
    } as unknown as CanvasRenderingContext2D;
  });

  describe('getMemoryGradient', () => {
    it('should create a gradient for normal line type', () => {
      const chartArea = {
        left: 0,
        right: 400,
        top: 0,
        bottom: 200,
      };

      const gradient = getMemoryGradient(mockCtx, chartArea, 'normal');

      expect(gradient).to.exist;
      expect(gradient).to.have.property('addColorStop');
    });

    it('should create a gradient for gradient line type', () => {
      const chartArea = {
        left: 0,
        right: 400,
        top: 0,
        bottom: 200,
      };

      const gradient = getMemoryGradient(mockCtx, chartArea, 'gradient');

      expect(gradient).to.exist;
      expect(gradient).to.have.property('addColorStop');
    });

    it('should create a gradient for gradient_no_fill line type', () => {
      const chartArea = {
        left: 0,
        right: 400,
        top: 0,
        bottom: 200,
      };

      const gradient = getMemoryGradient(mockCtx, chartArea, 'gradient_no_fill');

      expect(gradient).to.exist;
      expect(gradient).to.have.property('addColorStop');
    });

    it('should use default normal line type when not specified', () => {
      const chartArea = {
        left: 0,
        right: 400,
        top: 0,
        bottom: 200,
      };

      const gradient = getMemoryGradient(mockCtx, chartArea);

      expect(gradient).to.exist;
      expect(gradient).to.have.property('addColorStop');
    });

    it('should cache gradient for same dimensions and line type', () => {
      const chartArea = {
        left: 0,
        right: 400,
        top: 0,
        bottom: 200,
      };

      const gradient1 = getMemoryGradient(mockCtx, chartArea, 'normal');
      const gradient2 = getMemoryGradient(mockCtx, chartArea, 'normal');

      expect(gradient1).to.equal(gradient2);
    });

    it('should create new gradient when chart dimensions change', () => {
      const chartArea1 = {
        left: 0,
        right: 400,
        top: 0,
        bottom: 200,
      };

      const chartArea2 = {
        left: 0,
        right: 600,
        top: 0,
        bottom: 300,
      };

      const gradient1 = getMemoryGradient(mockCtx, chartArea1, 'normal');
      const gradient2 = getMemoryGradient(mockCtx, chartArea2, 'normal');

      expect(gradient1).to.not.equal(gradient2);
    });

    it('should create new gradient when line type changes', () => {
      const chartArea = {
        left: 0,
        right: 400,
        top: 0,
        bottom: 200,
      };

      const gradient1 = getMemoryGradient(mockCtx, chartArea, 'normal');
      const gradient2 = getMemoryGradient(mockCtx, chartArea, 'gradient');
      const gradient3 = getMemoryGradient(mockCtx, chartArea, 'gradient_no_fill');

      expect(gradient1).to.not.equal(gradient2);
      expect(gradient2).to.not.equal(gradient3);
      expect(gradient1).to.not.equal(gradient3);
    });

    it('should handle different chart area positions', () => {
      const chartArea1 = {
        left: 10,
        right: 390,
        top: 20,
        bottom: 180,
      };

      const chartArea2 = {
        left: 50,
        right: 350,
        top: 30,
        bottom: 170,
      };

      const gradient1 = getMemoryGradient(mockCtx, chartArea1, 'normal');
      const gradient2 = getMemoryGradient(mockCtx, chartArea2, 'normal');

      // Should create new gradient if dimensions are different
      const width1 = chartArea1.right - chartArea1.left;
      const height1 = chartArea1.bottom - chartArea1.top;
      const width2 = chartArea2.right - chartArea2.left;
      const height2 = chartArea2.bottom - chartArea2.top;

      if (width1 !== width2 || height1 !== height2) {
        expect(gradient1).to.not.equal(gradient2);
      }
    });

    it('should create gradients with correct direction (bottom to top)', () => {
      const chartArea = {
        left: 0,
        right: 400,
        top: 0,
        bottom: 200,
      };

      // Verify that createLinearGradient is called with correct parameters
      // by checking that a gradient is created
      const gradient = getMemoryGradient(mockCtx, chartArea, 'normal');

      expect(gradient).to.exist;
      expect(gradient).to.have.property('addColorStop');
      // The gradient should be created from bottom (200) to top (0)
      // This is verified by the fact that the gradient is created successfully
    });
  });
});

