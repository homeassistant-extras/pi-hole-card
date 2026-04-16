import { getPauseDurations } from '@config/pause-settings';
import type { Config } from '@type/config';
import { expect } from 'chai';

describe('pause-settings', () => {
  it('prefers pause.durations over pause_durations', () => {
    const config = {
      device_id: 'd',
      pause: { durations: [20, 40] },
      pause_durations: [99],
    } as Config;
    expect(getPauseDurations(config)).to.deep.equal([20, 40]);
  });

  it('falls back to pause_durations when pause is absent', () => {
    const config = {
      device_id: 'd',
      pause_durations: [120],
    } as Config;
    expect(getPauseDurations(config)).to.deep.equal([120]);
  });

  it('returns defaults when neither is set', () => {
    const config = { device_id: 'd' } as Config;
    expect(getPauseDurations(config)).to.deep.equal([60, 300, 900]);
  });
});
