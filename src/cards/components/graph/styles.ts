import { css } from 'lit';

/**
 * Static CSS styles for the System Metrics Graph Component
 */
export const styles = css`
  :host {
    display: block;
    width: 100%;
  }
  .chart-container {
    position: relative;
    height: 60px;
    width: 100%;
    padding: 0;
    margin: 0;
  }
  .loading,
  .error {
    text-align: center;
    padding: 20px;
    color: var(--secondary-text-color, #888);
    font-size: 0.9em;
  }
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    color: var(--secondary-text-color, #888);
    font-size: 0.9em;
  }
  canvas {
    display: block;
  }
`;
