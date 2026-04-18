# Aggregation modes

When you have more than one Pi-hole listed under `device_id`, the card combines
the four main dashboard tiles into a single view. How those values are combined
depends on your setup.

You can configure it from the visual editor under the **Multi Pi-hole** section,
or in YAML directly with the optional `aggregation:` block:

```yaml
type: custom:pi-hole
device_id:
  - pi_hole_1
  - pi_hole_2
  - pi_hole_3
aggregation:
  mode: mirrored
```

If you omit `aggregation:`, the card behaves exactly as before — no change for
existing dashboards.

## Modes

| Mode                        | Total Queries | Queries Blocked | % Blocked                | Domains on Lists | Active Clients |
| --------------------------- | ------------- | --------------- | ------------------------ | ---------------- | -------------- |
| `load_balanced` _(default)_ | sum           | sum             | weighted by query volume | sum              | sum            |
| `mirrored`                  | sum           | sum             | weighted by query volume | **average**      | sum            |

### `load_balanced` _(default)_

Use when every DNS query only hits one of your Pi-holes — for example a
round-robin DNS record, clients that pick one server from a list, or a
split-horizon setup where different subnets point at different Pi-holes.

Traffic counters sum because the work is genuinely distributed, and **% Blocked**
is recalculated from the combined totals `(total_blocked / total_queries) × 100`
so it stays accurate even if one Pi-hole is a lot busier than the others.

### `mirrored`

Use when all of your Pi-holes have the **same blocklists** — typically because
they are clones of each other for redundancy. Each device has `10.0.0.1`,
`10.0.0.2`, `10.0.0.3` in its DNS settings, for example.

- Traffic tiles still sum — every Pi-hole sees some fraction of queries and
  together they paint the full picture.
- **Domains on Lists** would otherwise show 3× the real list size with 3 nodes.
  `mirrored` shows the integer average instead (rounded to the nearest whole
  number), so if each Pi-hole reports ~1,300,000 domains the tile reads
  ~1,300,000 and not ~3,900,000.
- **Active Clients** still sums. Even when every device is configured with all
  three Pi-holes, clients typically resolve through one at a time (the others
  act as failover), so summing across nodes approximates the real client count
  better than averaging would.

## Example configurations

Three mirrored Pi-holes behind round-robin DNS:

```yaml
type: custom:pi-hole
title: DNS cluster
device_id:
  - pi_hole_living_room
  - pi_hole_office
  - pi_hole_garage
aggregation:
  mode: mirrored
```

Two Pi-holes serving different subnets (default behavior; `aggregation:` can be
omitted entirely):

```yaml
type: custom:pi-hole
device_id:
  - pi_hole_iot
  - pi_hole_main
aggregation:
  mode: load_balanced
```

## Coming later

More modes (e.g. _primary only_ for HA/failover pairs) and per-metric overrides
(opting individual tiles in or out of averaging) are on the roadmap. If you
have a multi-Pi-hole topology that neither current mode describes well, please
[open an issue](https://github.com/homeassistant-extras/pi-hole-card/issues) and
describe your setup.
