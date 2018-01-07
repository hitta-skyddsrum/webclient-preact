import { expect } from 'chai';

import { getBoundsAroundPositions, isPositionWithinBounds } from './';

describe('lib/getBoundsAroundPositions', () => {
  it('returns correct bounds', () => {
    const smallest = [1, 2];
    const biggest = [300, 400];
    const positions = [
      [14, 3],
      biggest,
      [],
      [undefined, undefined],
      smallest,
      [20, 154],
    ];

    expect(getBoundsAroundPositions(positions))
      .to.eql([[smallest[0], smallest[1]], [biggest[0], biggest[1]]]);
  });
});

describe('lib/isPositionWithinBounds', () => {
  it('returns false when the lat is too small', () => {
    const position = [1, 100];
    const bounds = [
      [100, 100],
      [200, 200],
    ];

    expect(isPositionWithinBounds(position, bounds)).to.equal(false);
  });

  it('returns false when the lon is too small', () => {
    const position = [100, 1];
    const bounds = [
      [100, 100],
      [200, 200],
    ];

    expect(isPositionWithinBounds(position, bounds)).to.equal(false);
  });

  it('returns false when the lat is too big', () => {
    const position = [201, 200];
    const bounds = [
      [100, 100],
      [200, 200],
    ];

    expect(isPositionWithinBounds(position, bounds)).to.equal(false);
  });

  it('returns false when the lon is too big', () => {
    const position = [200, 201];
    const bounds = [
      [100, 100],
      [200, 200],
    ];

    expect(isPositionWithinBounds(position, bounds)).to.equal(false);
  });

  it('returns true when the position is within the bounds', () => {
    const position = [150, 150];
    const bounds = [
      [100, 100],
      [200, 200],
    ];

    expect(isPositionWithinBounds(position, bounds)).to.equal(true);
  });
});
