import { substitutePauseActionVars } from '@common/pause-action-vars';
import type { Config } from '@type/config';
import { expect } from 'chai';

describe('pause-action-vars', () => {
  const baseConfig = { device_id: 'dev-1' } as Config;

  it('replaces whole-string placeholders with native types', () => {
    const action = {
      action: 'perform-action' as const,
      perform_action: 'controld_manager.disable_profile',
      data: {
        minutes: '{{ pause_minutes }}',
        profile_id: ['{{ device_id }}'],
        entity: '{{ entity_id }}',
      },
    };
    const out = substitutePauseActionVars(action, {
      seconds: 900,
      config: baseConfig,
      entityId: 'switch.pihole_1',
    });
    expect(out).to.deep.equal({
      action: 'perform-action',
      perform_action: 'controld_manager.disable_profile',
      data: {
        minutes: 15,
        profile_id: ['dev-1'],
        entity: 'switch.pihole_1',
      },
    });
  });

  it('uses pause_seconds as integer', () => {
    const action = {
      action: 'perform-action' as const,
      perform_action: 'test.action',
      data: { sec: '{{ pause_seconds }}' },
    };
    const out = substitutePauseActionVars(action, {
      seconds: 120,
      config: baseConfig,
    });
    expect((out as unknown as { data: { sec: number } }).data.sec).to.equal(
      120,
    );
  });

  it('uses first device_id when config has an array', () => {
    const action = {
      action: 'perform-action' as const,
      perform_action: 'x',
      data: { id: '{{ device_id }}' },
    };
    const out = substitutePauseActionVars(action, {
      seconds: 60,
      config: { device_id: ['a', 'b'] } as Config,
    });
    expect((out as unknown as { data: { id: string } }).data.id).to.equal('a');
  });

  it('embeds replacements inside larger strings', () => {
    const action = {
      action: 'perform-action' as const,
      perform_action: 'x',
      data: { note: 'wait {{ pause_minutes }} min for {{ device_id }}' },
    };
    const out = substitutePauseActionVars(action, {
      seconds: 120,
      config: { device_id: 'd9' } as Config,
    });
    expect((out as unknown as { data: { note: string } }).data.note).to.equal(
      'wait 2 min for d9',
    );
  });

  it('leaves unknown placeholders unchanged', () => {
    const action = {
      action: 'perform-action' as const,
      perform_action: 'x',
      data: { x: '{{ not_a_var }}' },
    };
    const out = substitutePauseActionVars(action, {
      seconds: 60,
      config: baseConfig,
    });
    expect((out as unknown as { data: { x: string } }).data.x).to.equal(
      '{{ not_a_var }}',
    );
  });

  it('does not mutate the original action', () => {
    const action = {
      action: 'perform-action' as const,
      perform_action: 'x',
      data: { m: '{{ pause_minutes }}' },
    };
    substitutePauseActionVars(action, {
      seconds: 60,
      config: baseConfig,
    });
    expect(action.data).to.deep.equal({ m: '{{ pause_minutes }}' });
  });

  it('substitutes nested keys under data', () => {
    const action = {
      action: 'perform-action' as const,
      perform_action: 'test.turn_on',
      data: { nested: { duration: '{{ pause_seconds }}' } },
    };
    const out = substitutePauseActionVars(action, {
      seconds: 30,
      config: baseConfig,
    });
    expect(
      (out as unknown as { data: { nested: { duration: number } } }).data.nested
        .duration,
    ).to.equal(30);
  });
});
