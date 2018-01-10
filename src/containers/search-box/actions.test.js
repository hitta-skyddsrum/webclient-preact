import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import * as types from './types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('containers/search-box/actions/fetchSuggestions', () => {
  let fetchJson;

  beforeAll(() => {
    jest.mock('../../lib/format-nominatim-address');
    jest.mock('../../lib/fetch-json');
    fetchJson = require('../../lib/fetch-json').default;
  });

  afterAll(() => {
    jest.unmock('../../lib/format-nominatim-address');
    jest.unmock('../../lib/fetch-json');
  });

  afterEach(() => {
    return fetchJson.mockReset();
  });

  it('calls the API with accurate query params', () => {
    const query = 'Lövängsgatan 1';

    fetchJson.mockReturnValueOnce(Promise.resolve({}));

    const store = mockStore({ suggestions: [] });

    return store.dispatch(require('./actions').fetchSuggestions(query))
      .then(() => expect(fetchJson.mock.calls[0][0]).to.match(new RegExp(`q=${query}`)));
  });

  it('creates FETCH_ADDRESS_SUGGESTIONS_SUCCESS when fetching address suggestions is finished', () => {
    const formattedAddress = 'form4773d 4ddre5';
    const formatNominatimAddress = require('../../lib/format-nominatim-address').default;
    formatNominatimAddress.mockImplementation(() => formattedAddress);

    const suggestions = [
      { lat: 1, lon: 2, display_name: 'This play' },
    ];
    const query = 'Lövängsgatan 1';

    fetchJson.mockReturnValueOnce(Promise.resolve(suggestions));

    const expectedActions = [
      { type: types.FETCH_ADDRESS_SUGGESTIONS, query },
      {
        type: types.FETCH_ADDRESS_SUGGESTIONS_SUCCESS,
        suggestions: suggestions.map(sugg => ({ lat: sugg.lat, lon: sugg.lon, name: formattedAddress })),
      },
    ];

    const store = mockStore({ suggestions: [] });

    return store.dispatch(require('./actions').fetchSuggestions(query))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('creates FETCH_ADDRESS_SUGGESTIONS_FAILED when fetching address suggestions returns error status code', () => {
    const query = 'Lågmoravägen 43';
    const statusText = 'Unauthorized';
    const response = new Response('', { status: 401, statusText });
    const error = new Error(statusText);
    error.response = response;
    fetchJson.mockReturnValueOnce(Promise.reject(error));

    const expectedActions = [
      { type: types.FETCH_ADDRESS_SUGGESTIONS, query },
      { type: types.FETCH_ADDRESS_SUGGESTIONS_FAILED, error },
    ];

    const store = mockStore({ suggestions: [] });

    return store.dispatch(require('./actions').fetchSuggestions(query))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });
});

describe('containers/search-box/actions/selectAddress', () => {
  jest.mock('../shelters/actions', () => ({ fetchShelters: () => ({ type: 'FETCH_SHELTERS' }) }));

  it('creates SELECT_ADDRESS', () => {
    const address = { street: 1 };
    const store = mockStore({ suggestions: [] });

    store.dispatch(require('./actions').selectAddress(address));

    expect(store.getActions().shift()).to.eql({
      type: types.SELECT_ADDRESS,
      address,
    });
  });
});

describe('containers/search-box/actions/reverseGeocode', () => {
  let fetchJson;
  let formatNominatimAddress;

  beforeAll(() => {
    jest.mock('../../lib/format-nominatim-address');
    formatNominatimAddress = require('../../lib/format-nominatim-address').default;
    jest.mock('../../lib/fetch-json');
    fetchJson = require('../../lib/fetch-json').default;
  });

  afterAll(() => {
    jest.unmock('../../lib/format-nominatim-address');
    jest.unmock('../../lib/fetch-json');
  });

  afterEach(() => {
    return fetchJson.mockReset();
  });

  it('calls the API with accurate query params', () => {
    const lat = 192;
    const lon = 133;

    formatNominatimAddress.mockReturnValueOnce('');
    fetchJson.mockReturnValueOnce(Promise.resolve({}));

    const store = mockStore({ suggestions: [] });

    return store.dispatch(require('./actions').reverseGeocode(lat, lon))
      .then(() => expect(fetchJson.mock.calls[0][0]).to.match(new RegExp(`lat=${lat}&lon=${lon}`)));
  });

  it('creates REVERSE_GEOCODE_POSITION_SUCCESS', () => {
    const address = {
      lon: 13,
      lat: 19,
    };
    const formattedAddress = 'The streets';

    formatNominatimAddress.mockReturnValueOnce(formattedAddress);
    fetchJson.mockReturnValueOnce(Promise.resolve(address));

    const expectedActions = [
      { type: types.REVERSE_GEOCODE_POSITION },
      {
        type: types.REVERSE_GEOCODE_POSITION_SUCCESS,
        address: {
          ...address,
          name: formattedAddress,
        },
      },
    ];

    const store = mockStore({ suggestions: [] });

    return store.dispatch(require('./actions').reverseGeocode(1, 2))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('creates REVERSE_GEOCODE_POSITION_FAILED', () => {
    const error = new Error();
    fetchJson.mockReturnValueOnce(Promise.reject(error));

    const expectedActions = [
      { type: types.REVERSE_GEOCODE_POSITION },
      { type: types.REVERSE_GEOCODE_POSITION_FAILED, error },
    ];

    const store = mockStore({ suggestions: [] });

    return store.dispatch(require('./actions').reverseGeocode(3, 4))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });
});
