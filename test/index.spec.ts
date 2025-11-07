import { expect } from 'chai';
import { stub, type SinonStub } from 'sinon';
import { version } from '../package.json';

describe('index.ts', () => {
  let customElementsStub: SinonStub;
  let customCardsStub: Array<Object> | undefined;
  let consoleInfoStub: sinon.SinonStub;

  beforeEach(() => {
    // Stub customElements.define to prevent actual registration
    customElementsStub = stub(customElements, 'define');
    consoleInfoStub = stub(console, 'info');

    // Create a stub for window.customCards
    customCardsStub = [];
    Object.defineProperty(window, 'customCards', {
      get: () => customCardsStub,
      set: (value) => {
        customCardsStub = value;
      },
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore the original customElements.define
    customElementsStub.restore();
    consoleInfoStub.restore();
    customCardsStub = undefined;
    delete require.cache[require.resolve('@/index.ts')];
  });

  it('should register all custom elements', () => {
    require('@/index.ts');
    expect(customElementsStub.callCount).to.equal(4);
    expect(customElementsStub.firstCall.args[0]).to.equal('pi-hole');
    expect(customElementsStub.secondCall.args[0]).to.equal('pi-hole-editor');
    expect(customElementsStub.thirdCall.args[0]).to.equal('pause-component');
    expect(customElementsStub.getCall(3).args[0]).to.equal(
      'system-metrics-graph',
    );
  });

  it('should initialize window.customCards if undefined', () => {
    customCardsStub = undefined;
    require('@/index.ts');

    expect(window.customCards).to.be.an('array');
  });

  it('should add card configurations with all fields to window.customCards', () => {
    require('@/index.ts');

    expect(window.customCards).to.have.lengthOf(1);

    // Check device-card configuration
    expect(window.customCards[0]).to.deep.equal({
      type: 'pi-hole',
      name: 'Pi-hole Card',
      description: 'A card to summarize and control your Pi-hole instance.',
      preview: true,
      documentationURL: 'https://github.com/homeassistant-extras/pi-hole-card',
    });
  });

  it('should preserve existing cards when adding new card', () => {
    // Add an existing card
    window.customCards = [
      {
        type: 'existing-card',
        name: 'Existing Card',
      },
    ];

    require('@/index.ts');

    expect(window.customCards).to.have.lengthOf(2);
    expect(window.customCards[0]).to.deep.equal({
      type: 'existing-card',
      name: 'Existing Card',
    });
  });

  it('should handle multiple imports without duplicating registration', () => {
    require('@/index.ts');
    require('@/index.ts');

    expect(window.customCards).to.have.lengthOf(1);
    expect(customElementsStub.callCount).to.equal(4); // Called once for each component
  });

  it('should log the version with proper formatting', () => {
    require('@/index.ts');
    expect(consoleInfoStub.calledOnce).to.be.true;

    // Assert that it was called with the expected arguments
    expect(
      consoleInfoStub.calledWithExactly(
        `%c🐱 Poat's Tools: pi-hole-card - ${version}`,
        'color: #CFC493;',
      ),
    ).to.be.true;
  });
});
