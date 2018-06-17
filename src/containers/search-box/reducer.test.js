import { expect } from 'chai';
import * as types from './types';
import SearchBox from './reducer';

describe('containers/search-box/reducer', () => {
  it('should set loadingGeo to true upon GET_CURRENT_POSITION', () => {
    const state = SearchBox(undefined, {
      type: types.GET_CURRENT_POSITION,
    });

    expect(state.loadingGeo).to.equal(true);
  });

  it('should set loadingGeo to false upon GET_CURRENT_POSITION_FAILED', () => {
    const state = SearchBox({ loadingGeo: true }, {
      type: types.GET_CURRENT_POSITION_FAILED,
    });

    expect(state.loadingGeo).to.equal(false);
  });

  it('should set loadingGeo to false upon GET_CURRENT_POSITION_SUCCESS', () => {
    const state = SearchBox({ loadingGeo: true }, {
      type: types.GET_CURRENT_POSITION_SUCCESS,
    });

    expect(state.loadingGeo).to.equal(false);
  });
});
