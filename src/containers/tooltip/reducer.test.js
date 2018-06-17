import { expect } from 'chai';
import * as types from './types';
import Tooltip from './reducer';

describe('containers/tooltip/reducer', () => {
  it('should update state upon HIDE_TOOLTIP', () => {
    const id = 'id-1';
    const returnedState = Tooltip(undefined, {
      type: types.HIDE_TOOLTIP,
      id,
    });

    expect(returnedState[id].hidden).to.equal(true);
  });
});
