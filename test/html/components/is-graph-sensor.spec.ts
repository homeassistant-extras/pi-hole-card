import { isGraphSensor } from '@html/components/is-graph-sensor';
import { expect } from 'chai';

describe('is-graph-sensor.ts', () => {
  describe('isGraphSensor', () => {
    it('should return true for CPU usage sensor', () => {
      expect(isGraphSensor('sensor.pi_hole_cpu_use')).to.be.true;
    });

    it('should return true for memory usage sensor', () => {
      expect(isGraphSensor('sensor.pi_hole_memory_use')).to.be.true;
    });

    it('should return false for other sensors', () => {
      expect(isGraphSensor('sensor.seen_clients')).to.be.false;
      expect(isGraphSensor('sensor.dns_unique_domains')).to.be.false;
      expect(isGraphSensor('sensor.dns_queries_cached')).to.be.false;
      expect(isGraphSensor('sensor.pi_hole_ads_blocked_today')).to.be.false;
    });

    it('should return false for non-sensor entities', () => {
      expect(isGraphSensor('switch.pi_hole')).to.be.false;
      expect(isGraphSensor('button.pi_hole_update')).to.be.false;
      expect(isGraphSensor('update.pi_hole')).to.be.false;
    });

    it('should return false for empty string', () => {
      expect(isGraphSensor('')).to.be.false;
    });

    it('should return false for similar but different entity IDs', () => {
      expect(isGraphSensor('sensor.pi_hole_cpu_usage')).to.be.false;
      expect(isGraphSensor('sensor.pi_hole_memory_usage')).to.be.false;
      expect(isGraphSensor('sensor.pi_hole_cpu')).to.be.false;
      expect(isGraphSensor('sensor.pi_hole_memory')).to.be.false;
    });
  });
});
