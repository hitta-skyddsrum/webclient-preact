import { expect } from 'chai';

import * as types from './types';
import SearchBoxReducer from './reducer';

describe('containers/search-box/reducer', () => {
  it('should return the default state per default', () => {
    const oldState = { im: 'very old' };

    expect(SearchBoxReducer(oldState, { type: 'NOT_MATCHING_ANYTHING'})).to.eql(oldState);
  });

  it('should add suggestions to state upon FETCH_ADDRESS_SUGGESTIONS_SUCCESS', () => {
    const oldAddressSuggestions = [{ street_name: 'Orvargatan 6'}];
    const oldState = {
      addressSuggestions: oldAddressSuggestions,
    };
    const addressSuggestions = [{ street_name: 'Myrsloksvägen 6'}];

    expect(SearchBoxReducer(oldState, { type: types.FETCH_ADDRESS_SUGGESTIONS_SUCCESS, addressSuggestions }).addressSuggestions)
      .to.eql(addressSuggestions);
  });

  it('should add error to state upon FETCH_ADDRESS_SUGGESTIONS_FAILED', () => {
    const error = { houston: 'We have a problem' };

    expect(SearchBoxReducer(undefined, { type: types.FETCH_ADDRESS_SUGGESTIONS_FAILED, error }).error)
      .to.eql(error);
  });

  it('should set the state address upon SET_ADDRESS', () => {
    const address = 'Grönmyllevägen 14';

    expect(SearchBoxReducer(undefined, { type: types.SET_ADDRESS, address }).address)
      .to.eql(address);
  });
});
