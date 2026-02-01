import type { DashboardStatConfig } from '@type/config';
import type { EntityInformation, PiHoleDevice } from '@type/types';

/**
 * Parses a numeric state value from an entity, handling invalid/missing values
 * @param entity - The entity information
 * @returns The parsed number, or 0 if invalid/missing
 */
const parseNumericState = (entity: EntityInformation | undefined): number => {
  if (!entity?.state) return 0;
  const parsed = Number.parseFloat(entity.state);
  return Number.isNaN(parsed) ? 0 : parsed;
};

/**
 * Combines statistics from multiple Pi-hole devices into a single device
 * @param holes - Array of Pi-hole devices to combine
 * @returns A combined Pi-hole device with aggregated statistics
 */
export const combineStats = (holes: PiHoleDevice[]): PiHoleDevice => {
  if (holes.length === 0) {
    throw new Error('Cannot combine stats from empty array');
  }

  // If only one device, return it as-is
  if (holes.length === 1) {
    return holes[0]!;
  }

  const firstDevice = holes[0]!;

  // Sum numeric stats: dns_queries_today, ads_blocked_today, domains_blocked, dns_unique_clients
  let dnsQueriesSum = 0;
  let adsBlockedSum = 0;
  let domainsBlockedSum = 0;
  let uniqueClientsSum = 0;

  holes.forEach((hole) => {
    dnsQueriesSum += parseNumericState(hole.dns_queries_today);
    adsBlockedSum += parseNumericState(hole.ads_blocked_today);
    domainsBlockedSum += parseNumericState(hole.domains_blocked);
    uniqueClientsSum += parseNumericState(hole.dns_unique_clients);
  });

  // Recalculate percentage from combined totals: (blocked / queries) * 100
  // This accounts for the weight/volume of queries from each Pi-hole
  const calculatedPercentage =
    dnsQueriesSum > 0 ? (adsBlockedSum / dnsQueriesSum) * 100 : 0;

  // Create combined device using first device as base, with aggregated stats
  const combined: PiHoleDevice = {
    ...firstDevice,
    dns_queries_today: firstDevice.dns_queries_today
      ? {
          ...firstDevice.dns_queries_today,
          state: dnsQueriesSum.toString(),
        }
      : undefined,
    ads_blocked_today: firstDevice.ads_blocked_today
      ? {
          ...firstDevice.ads_blocked_today,
          state: adsBlockedSum.toString(),
        }
      : undefined,
    domains_blocked: firstDevice.domains_blocked
      ? {
          ...firstDevice.domains_blocked,
          state: domainsBlockedSum.toString(),
        }
      : undefined,
    ads_percentage_blocked_today: firstDevice.ads_percentage_blocked_today
      ? {
          ...firstDevice.ads_percentage_blocked_today,
          state: calculatedPercentage.toString(),
        }
      : undefined,
    dns_unique_clients: firstDevice.dns_unique_clients
      ? {
          ...firstDevice.dns_unique_clients,
          state: uniqueClientsSum.toString(),
        }
      : undefined,
  };

  return combined;
};

/**
 * Creates the dashboard stats configuration
 * @param uniqueClientsCount - The number of unique clients
 * @returns The dashboard stats configuration
 */
export const getDashboardStats = (
  uniqueClientsCount: string,
): DashboardStatConfig[][] => [
  [
    {
      sensorKey: 'dns_queries_today',
      title: 'card.stats.total_queries',
      footer: {
        key: 'card.stats.active_clients',
        search: '{number}',
        replace: uniqueClientsCount,
      },
      className: 'queries-box',
      icon: 'mdi:earth',
    },
    {
      sensorKey: 'ads_blocked_today',
      title: 'card.stats.queries_blocked',
      footer: 'card.stats.list_blocked_queries',
      className: 'blocked-box',
      icon: 'mdi:hand-back-right',
    },
  ],
  [
    {
      sensorKey: 'ads_percentage_blocked_today',
      title: 'card.stats.percentage_blocked',
      footer: 'card.stats.list_all_queries',
      className: 'percentage-box',
      icon: 'mdi:chart-pie',
    },
    {
      sensorKey: 'domains_blocked',
      title: 'card.stats.domains_on_lists',
      footer: 'card.stats.manage_lists',
      className: 'domains-box',
      icon: 'mdi:format-list-bulleted',
    },
  ],
];
