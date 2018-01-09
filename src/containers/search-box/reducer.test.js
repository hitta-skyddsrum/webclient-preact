import { expect } from 'chai';

import * as types from './types';
import SearchBoxReducer from './reducer';

describe('containers/search-box/reducer', () => {
  it('should return the default state per default', () => {
    const oldState = { im: 'very old' };

    expect(SearchBoxReducer(oldState, { type: 'NOT_MATCHING_ANYTHING'})).to.eql(oldState);
  });

  it('should store query params lat and lon upon @@router/LOCATION_CHANGE', () => {
    const lat = '113.13';
    const lon = '423.14';
    const payload = {
      search: `?lat=${lat}&lon=${lon}`,
    };

    expect(SearchBoxReducer(undefined, { type: '@@router/LOCATION_CHANGE', payload }).lat)
      .to.equal(lat);
    expect(SearchBoxReducer(undefined, { type: '@@router/LOCATION_CHANGE', payload }).lon)
      .to.equal(lon);
  });

  it('should increment state `loading` upon FETCH_ADDRESS_SUGGESTIONS', () => {
    const oldState = { loading: 2 };
    expect(SearchBoxReducer(oldState, { type: types.FETCH_ADDRESS_SUGGESTIONS }).loading)
      .to.equal(oldState.loading + 1);
  });

  it('should decrement state `loading` upon FETCH_ADDRESS_SUGGESTIONS_SUCCESS', () => {
    const oldState = { loading: 5 };
    expect(SearchBoxReducer(oldState, { type: types.FETCH_ADDRESS_SUGGESTIONS_SUCCESS }).loading)
      .to.equal(oldState.loading - 1);
  });

  it('should decrement state `loading` upon FETCH_ADDRESS_SUGGESTIONS_FAILED', () => {
    const oldState = { loading: 5 };
    expect(SearchBoxReducer(oldState, { type: types.FETCH_ADDRESS_SUGGESTIONS_FAILED }).loading)
      .to.equal(oldState.loading - 1);
  });

  it('should add suggestions to state upon FETCH_ADDRESS_SUGGESTIONS_SUCCESS', () => {
    const oldsuggestions = [{ street_name: 'Orvargatan 6'}];
    const oldState = {
      suggestions: oldsuggestions,
    };
    const suggestions = [{ street_name: 'Myrsloksvägen 6'}];

    expect(SearchBoxReducer(oldState, { type: types.FETCH_ADDRESS_SUGGESTIONS_SUCCESS, suggestions }).suggestions)
      .to.eql(suggestions);
  });

  it('should add error to state upon FETCH_ADDRESS_SUGGESTIONS_FAILED', () => {
    const error = { houston: 'We have a problem' };

    expect(SearchBoxReducer(undefined, { type: types.FETCH_ADDRESS_SUGGESTIONS_FAILED, error }).error)
      .to.eql(error);
  });

  it('should store the address upon SELECT_ADDRESS', () => {
    const address = 'The address street 3';

    expect(SearchBoxReducer(undefined, { type: types.SELECT_ADDRESS, address }).selectedAddress)
      .to.equal(address);
  });

  it('should clear all suggestions upon SELECT_ADDRESS', () => {
    const state = { suggestions: ['many'] };

    expect(SearchBoxReducer(state, { type: types.SELECT_ADDRESS }).suggestions)
      .to.eql([]);
  });
});
