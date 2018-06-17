import { expect } from 'chai';
import * as types from './types';
import * as actions from './actions';

describe('containers/tooltip/actions/hideTooltip', () => {
  it('should dispatch HIDE_TOOLTIP action', () => {
    const id = 'tooltip-id';

    expect(actions.hideTooltip(id)).to.eql({
      type: types.HIDE_TOOLTIP,
      id,
    });
  });
});
