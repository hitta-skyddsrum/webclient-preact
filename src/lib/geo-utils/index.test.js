import { expect } from 'chai';

import { getBoundsAroundPositions } from './';

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
