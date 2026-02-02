import { css } from 'lit';

/**
 * Shared collapsible section styles
 */
export const collapsibleStyles = css`
  .collapsible-section {
    margin: 0;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    user-select: none;
  }

  .section-header span {
    font-weight: 500;
  }

  .caret-icon {
    transition: transform 0.3s ease;
  }

  .hidden {
    max-height: 0;
    opacity: 0;
    margin: 0;
    padding: 0;
  }
`;

/**
 * Static CSS styles for the Pi-hole Card
 * Modified to support grouped pairs of elements and background icons
 */
export const styles = css`
  ${collapsibleStyles}

  ha-card {
    overflow: hidden;
  }

  /* Card header styles */
  .card-header {
    display: flex;
    justify-content: space-between;
    padding: 16px 16px 0;
  }

  .name {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 500;
  }

  .name ha-icon {
    margin-right: 8px;
  }

  .status {
    display: flex;
    font-weight: 500;
  }

  .status ha-icon {
    margin-right: 4px;
  }

  .card-content {
    padding: 16px 16px 0px 16px;
  }

  /* Dashboard-style layout with grouped stat boxes */
  .dashboard-stats {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  /* Stat groups - will appear side by side on larger screens */
  .stat-group {
    display: flex;
    gap: 12px;
    flex: 1;
  }

  .stat-box {
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    color: white;
    transition: transform 0.2s;
    min-height: 120px;
    min-width: 120px;
    flex: 1;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .stat-box:hover {
    transform: scale(1.02);
  }

  /* New: Stat Icon (Background) */
  .stat-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.2;
    z-index: 1;
  }

  .stat-icon ha-icon {
    --mdc-icon-size: 80px;
    color: rgba(255, 255, 255, 0.8);
  }

  /* Content container to position above the icon */
  .stat-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .stat-header {
    font-size: 1rem;
    padding: 12px 12px 0px 12px;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    padding: 8px 12px 0;
    flex: 1;
  }

  .stat-footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    background: rgba(0, 0, 0, 0.1);
    padding: 2px 12px;
    margin-top: auto; /* Push to the bottom */
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    box-sizing: border-box;
  }

  /* Dashboard boxes - muted versions of Pi-hole colors */
  .queries-box {
    background-color: rgba(0, 192, 239, 0.85);
  }

  .blocked-box {
    background-color: rgba(221, 75, 57, 0.85);
  }

  .percentage-box {
    background-color: rgba(243, 156, 18, 0.85);
  }

  .domains-box {
    background-color: rgba(0, 166, 90, 0.85);
  }

  /* Additional stats styling - specialized responsive grid */
  .additional-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .additional-stat {
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: var(--secondary-text-color);
    padding: 8px;
    border-radius: 4px;
    min-width: 120px;
    /* Allow text to wrap if needed */
    white-space: normal;
    overflow: hidden;
  }

  .additional-stat ha-state-icon {
    margin-right: 8px;
    color: var(--secondary-text-color);
  }

  .switches,
  .actions {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
  }

  .actions {
    justify-content: space-around;
  }

  .switches {
    justify-content: space-between;
  }

  /* Version information styles */
  .version-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 8px 16px 16px;
    font-size: 0.85rem;
    color: var(--secondary-text-color);
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    gap: 12px;
  }

  .version-item {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  .version-item.update-available {
    border-left: 3px solid var(--warning-color, #ff9800);
    padding-left: 8px;
    margin-left: -8px;
  }

  .version-label {
    margin-right: 4px;
    font-weight: 700;
  }

  .version-text {
    display: inline-flex;
    align-items: center;
  }

  .version-separator {
    margin: 0 4px;
    color: var(--secondary-text-color);
  }

  .version-latest {
    color: var(--warning-color, #ff9800);
    font-weight: 600;
  }

  /* Very small screen adjustments */
  @media (max-width: 400px) {
    .stat-group {
      flex-direction: column;
    }
  }

  /* Click action button styles */
  mwc-button {
    margin: 4px;
    cursor: pointer;
  }

  mwc-button.primary {
    --mdc-theme-primary: var(--success-color);
  }

  mwc-button.warning {
    --mdc-theme-primary: var(--warning-color);
  }

  mwc-button ha-icon {
    margin-right: 3px;
  }

  /* Actions button hover effects */
  .actions mwc-button {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid transparent;
    transition:
      transform 0.2s ease,
      filter 0.2s ease,
      box-shadow 0.2s ease;
    will-change: transform, filter;
  }

  .actions mwc-button:hover,
  .actions mwc-button:focus-visible {
    transform: translateY(-1px) scale(1.03);
    filter: brightness(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    border-color: var(--success-color);
  }

  /* Switch styles */
  .remaining-time {
    font-size: 1.2rem;
    font-weight: 400;
  }

  .remaining-time::before {
    content: '-';
    margin: 0px 8px;
  }

  .space-around {
    justify-content: space-around;
  }

  .space-between > state-card-content {
    width: 100%;
  }

  /* Refresh time styles */
  .refresh-time {
    display: flex;
    font-size: 0.85rem;
    color: var(--secondary-text-color);
    justify-content: center;
  }

  .refresh-time ha-icon {
    margin-right: 4px;
    color: var(--switch-checked-color);
    cursor: pointer;
  }

  /* Status icon styles */
  .multi-status {
    font-size: 0.9rem;
    margin-left: 8px;
    opacity: 0.8;
  }

  /* Divider styles */
  .divider {
    height: 1px;
    background-color: var(--secondary-text-color);
    width: 100%;
    margin: 10px 16px;
  }

  /* Warning badge styles */
  .warning-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: var(--warning-color, #ff9800);
    color: var(--secondary-text-color);
    font-weight: bolder;
    font-size: 1rem;
    margin-right: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    min-width: 25px;
    transition:
      transform 0.2s ease,
      filter 0.2s ease,
      box-shadow 0.2s ease;
    will-change: transform, filter;
  }

  .warning-badge:hover,
  .warning-badge:focus-visible {
    transform: translateY(-1px) scale(1.06);
    filter: brightness(1.05);
    box-shadow:
      0 6px 12px rgba(0, 0, 0, 0.25),
      0 0 0 3px var(--warning-color, #ff9800);
  }

  .badge {
    cursor: pointer;
  }
`;
