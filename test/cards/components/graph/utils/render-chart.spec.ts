import { renderChart } from '@cards/components/graph/utils/render-chart';
import { expect } from 'chai';

describe('render-chart', () => {
  describe('renderChart', () => {
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
      canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
    });

    afterEach(() => {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    });

    it('should return null when canvas is null', () => {
      const chart = renderChart(null);

      expect(chart).to.be.null;
    });

    it('should handle canvas without 2d context', () => {
      // Create a canvas that doesn't support 2d context
      const mockCanvas = {
        getContext: () => null,
      } as unknown as HTMLCanvasElement;

      const chart = renderChart(mockCanvas);

      expect(chart).to.be.null;
    });
  });
});
