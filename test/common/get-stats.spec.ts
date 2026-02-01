import { combineStats, getDashboardStats } from '@common/get-stats';
import type { Translation } from '@type/locale';
import type { PiHoleDevice } from '@type/types';
import { expect } from 'chai';

describe('dashboard-stats.ts', () => {
  describe('combineStats', () => {
    it('should return the device as-is when only one device is provided', () => {
      const device: PiHoleDevice = {
        device_id: 'device1',
        dns_queries_today: {
          entity_id: 'sensor.dns_queries_today',
          state: '1000',
          attributes: {},
          translation_key: 'dns_queries_today',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      const result = combineStats([device]);

      expect(result).to.equal(device);
    });

    it('should throw error when empty array is provided', () => {
      expect(() => combineStats([])).to.throw(
        'Cannot combine stats from empty array',
      );
    });

    it('should sum numeric stats from multiple devices', () => {
      const device1: PiHoleDevice = {
        device_id: 'device1',
        dns_queries_today: {
          entity_id: 'sensor.device1_dns_queries_today',
          state: '1000',
          attributes: {},
          translation_key: 'dns_queries_today',
        },
        ads_blocked_today: {
          entity_id: 'sensor.device1_ads_blocked_today',
          state: '100',
          attributes: {},
          translation_key: 'ads_blocked_today',
        },
        domains_blocked: {
          entity_id: 'sensor.device1_domains_blocked',
          state: '50000',
          attributes: {},
          translation_key: 'domains_blocked',
        },
        dns_unique_clients: {
          entity_id: 'sensor.device1_dns_unique_clients',
          state: '10',
          attributes: {},
          translation_key: 'dns_unique_clients',
        },
        ads_percentage_blocked_today: {
          entity_id: 'sensor.device1_ads_percentage_blocked_today',
          state: '10.0',
          attributes: { unit_of_measurement: '%' },
          translation_key: 'ads_percentage_blocked_today',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      const device2: PiHoleDevice = {
        device_id: 'device2',
        dns_queries_today: {
          entity_id: 'sensor.device2_dns_queries_today',
          state: '2000',
          attributes: {},
          translation_key: 'dns_queries_today',
        },
        ads_blocked_today: {
          entity_id: 'sensor.device2_ads_blocked_today',
          state: '200',
          attributes: {},
          translation_key: 'ads_blocked_today',
        },
        domains_blocked: {
          entity_id: 'sensor.device2_domains_blocked',
          state: '60000',
          attributes: {},
          translation_key: 'domains_blocked',
        },
        dns_unique_clients: {
          entity_id: 'sensor.device2_dns_unique_clients',
          state: '15',
          attributes: {},
          translation_key: 'dns_unique_clients',
        },
        ads_percentage_blocked_today: {
          entity_id: 'sensor.device2_ads_percentage_blocked_today',
          state: '20.0',
          attributes: { unit_of_measurement: '%' },
          translation_key: 'ads_percentage_blocked_today',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      const result = combineStats([device1, device2]);

      // Should sum: dns_queries_today, ads_blocked_today, domains_blocked, dns_unique_clients
      expect(result.dns_queries_today?.state).to.equal('3000');
      expect(result.ads_blocked_today?.state).to.equal('300');
      expect(result.domains_blocked?.state).to.equal('110000');
      expect(result.dns_unique_clients?.state).to.equal('25');

      // Should recalculate percentage from combined totals: (300/3000)*100 = 10%
      expect(result.ads_percentage_blocked_today?.state).to.equal('10');

      // Should preserve entity_id and attributes from first device
      expect(result.dns_queries_today?.entity_id).to.equal(
        'sensor.device1_dns_queries_today',
      );
      expect(result.ads_percentage_blocked_today?.attributes).to.deep.equal({
        unit_of_measurement: '%',
      });
    });

    it('should handle missing stats gracefully', () => {
      const device1: PiHoleDevice = {
        device_id: 'device1',
        dns_queries_today: {
          entity_id: 'sensor.device1_dns_queries_today',
          state: '1000',
          attributes: {},
          translation_key: 'dns_queries_today',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      const device2: PiHoleDevice = {
        device_id: 'device2',
        dns_queries_today: {
          entity_id: 'sensor.device2_dns_queries_today',
          state: '2000',
          attributes: {},
          translation_key: 'dns_queries_today',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      const result = combineStats([device1, device2]);

      expect(result.dns_queries_today?.state).to.equal('3000');
      expect(result.ads_blocked_today).to.be.undefined;
      expect(result.domains_blocked).to.be.undefined;
      expect(result.dns_unique_clients).to.be.undefined;
      expect(result.ads_percentage_blocked_today).to.be.undefined;
    });

    it('should handle invalid state values', () => {
      const device1: PiHoleDevice = {
        device_id: 'device1',
        dns_queries_today: {
          entity_id: 'sensor.device1_dns_queries_today',
          state: 'invalid',
          attributes: {},
          translation_key: 'dns_queries_today',
        },
        ads_blocked_today: {
          entity_id: 'sensor.device1_ads_blocked_today',
          state: '100',
          attributes: {},
          translation_key: 'ads_blocked_today',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      const device2: PiHoleDevice = {
        device_id: 'device2',
        dns_queries_today: {
          entity_id: 'sensor.device2_dns_queries_today',
          state: '2000',
          attributes: {},
          translation_key: 'dns_queries_today',
        },
        ads_blocked_today: {
          entity_id: 'sensor.device2_ads_blocked_today',
          state: 'NaN',
          attributes: {},
          translation_key: 'ads_blocked_today',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      const result = combineStats([device1, device2]);

      // Invalid values should be treated as 0
      expect(result.dns_queries_today?.state).to.equal('2000');
      expect(result.ads_blocked_today?.state).to.equal('100');
    });

    it('should recalculate percentage from combined totals accounting for query volume', () => {
      // device1: 1000 queries, 100 blocked = 10%
      // device2: 1000 queries, 0 blocked = 0%
      // device3: 1000 queries, 200 blocked = 20%
      // Combined: 3000 queries, 300 blocked = (300/3000)*100 = 10%
      const device1: PiHoleDevice = {
        device_id: 'device1',
        dns_queries_today: {
          entity_id: 'sensor.device1_dns_queries_today',
          state: '1000',
          attributes: {},
          translation_key: 'dns_queries_today',
        },
        ads_blocked_today: {
          entity_id: 'sensor.device1_ads_blocked_today',
          state: '100',
          attributes: {},
          translation_key: 'ads_blocked_today',
        },
        ads_percentage_blocked_today: {
          entity_id: 'sensor.device1_ads_percentage_blocked_today',
          state: '10.0',
          attributes: { unit_of_measurement: '%' },
          translation_key: 'ads_percentage_blocked_today',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      const device2: PiHoleDevice = {
        device_id: 'device2',
        dns_queries_today: {
          entity_id: 'sensor.device2_dns_queries_today',
          state: '1000',
          attributes: {},
          translation_key: 'dns_queries_today',
        },
        ads_blocked_today: {
          entity_id: 'sensor.device2_ads_blocked_today',
          state: '0',
          attributes: {},
          translation_key: 'ads_blocked_today',
        },
        ads_percentage_blocked_today: {
          entity_id: 'sensor.device2_ads_percentage_blocked_today',
          state: '0',
          attributes: { unit_of_measurement: '%' },
          translation_key: 'ads_percentage_blocked_today',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      const device3: PiHoleDevice = {
        device_id: 'device3',
        dns_queries_today: {
          entity_id: 'sensor.device3_dns_queries_today',
          state: '1000',
          attributes: {},
          translation_key: 'dns_queries_today',
        },
        ads_blocked_today: {
          entity_id: 'sensor.device3_ads_blocked_today',
          state: '200',
          attributes: {},
          translation_key: 'ads_blocked_today',
        },
        ads_percentage_blocked_today: {
          entity_id: 'sensor.device3_ads_percentage_blocked_today',
          state: '20.0',
          attributes: { unit_of_measurement: '%' },
          translation_key: 'ads_percentage_blocked_today',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      const result = combineStats([device1, device2, device3]);

      // Should recalculate from totals: (300/3000)*100 = 10%
      // Not average of 10%, 0%, 20% = 10% (which would be wrong if volumes differed)
      expect(result.ads_percentage_blocked_today?.state).to.equal('10');
    });

    it('should handle zero queries gracefully when recalculating percentage', () => {
      const device1: PiHoleDevice = {
        device_id: 'device1',
        dns_queries_today: {
          entity_id: 'sensor.device1_dns_queries_today',
          state: '0',
          attributes: {},
          translation_key: 'dns_queries_today',
        },
        ads_blocked_today: {
          entity_id: 'sensor.device1_ads_blocked_today',
          state: '0',
          attributes: {},
          translation_key: 'ads_blocked_today',
        },
        ads_percentage_blocked_today: {
          entity_id: 'sensor.device1_ads_percentage_blocked_today',
          state: '0',
          attributes: { unit_of_measurement: '%' },
          translation_key: 'ads_percentage_blocked_today',
        },
        sensors: [],
        switches: [],
        controls: [],
        updates: [],
      };

      const result = combineStats([device1]);

      // Should handle division by zero gracefully
      expect(result.ads_percentage_blocked_today?.state).to.equal('0');
    });
  });

  describe('getDashboardStats', () => {
    it('should return a 2D array with the correct structure and values', () => {
      // Arrange
      const uniqueClientsCount = '42';

      // Act
      const result = getDashboardStats(uniqueClientsCount);

      // Assert
      // Check overall structure
      expect(result).to.be.an('array').with.lengthOf(2);
      expect(result[0]).to.be.an('array').with.lengthOf(2);
      expect(result[1]).to.be.an('array').with.lengthOf(2);

      // Check first row, first stat
      expect(result[0]![0]).to.deep.include({
        sensorKey: 'dns_queries_today',
        title: 'card.stats.total_queries',
        className: 'queries-box',
        icon: 'mdi:earth',
      });
      expect(result[0]![0]!.footer).to.deep.equal({
        key: 'card.stats.active_clients',
        search: '{number}',
        replace: '42',
      });

      // Check second row, second stat
      expect(result[1]![1]).to.deep.include({
        sensorKey: 'domains_blocked',
        title: 'card.stats.domains_on_lists',
        footer: 'card.stats.manage_lists',
        className: 'domains-box',
        icon: 'mdi:format-list-bulleted',
      });
    });

    it('should correctly include the uniqueClientsCount in the footer config', () => {
      // Arrange - Test with different unique client counts
      const testCases = ['0', '5', '123'];

      for (const clientCount of testCases) {
        // Act
        const result = getDashboardStats(clientCount);

        // Assert - Check that the clientCount is correctly included in the footer
        const dnsQueriesConfig = result[0]![0]!;
        expect(dnsQueriesConfig.footer).to.be.an('object');
        expect((dnsQueriesConfig.footer as Translation).key).to.equal(
          'card.stats.active_clients',
        );
        expect(dnsQueriesConfig.footer.search).to.equal('{number}');
        expect(dnsQueriesConfig.footer.replace).to.equal(clientCount);
      }
    });
  });
});
