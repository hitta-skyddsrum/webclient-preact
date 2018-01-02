import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import * as types from './types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('containers/search-box/actions/fetchAddressSuggestions', () => {
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

  it('calls the API with accurate query params', () => {
    const query = 'Lövängsgatan 1';

    fetchJson.mockReturnValueOnce(Promise.resolve({}));

    const store = mockStore({ addressSuggestions: [] });

    return store.dispatch(require('./actions').fetchAddressSuggestions(query))
      .then(() => expect(fetchJson.mock.calls[0][0]).to.match(new RegExp(`q=${query}`)));
  });

  it('creates FETCH_ADDRESS_SUGGESTIONS_SUCCESS when fetching address suggestions is finished', () => {
    const formattedAddress = 'form4773d 4ddre5';
    const formatNominatimAddress = require('../../lib/format-nominatim-address').default;
    formatNominatimAddress.mockImplementation(() => formattedAddress);

    const addressSuggestions = [
      { lat: 1, lon: 2, display_name: 'This play' },
    ];
    const query = 'Lövängsgatan 1';

    fetchJson.mockReturnValueOnce(Promise.resolve(addressSuggestions));

    const expectedActions = [
      { type: types.FETCH_ADDRESS_SUGGESTIONS, query },
      {
        type: types.FETCH_ADDRESS_SUGGESTIONS_SUCCESS,
        addressSuggestions: addressSuggestions.map(sugg => ({ lat: sugg.lat, lon: sugg.lon, name: formattedAddress })),
      },
    ];

    const store = mockStore({ addressSuggestions: [] });

    return store.dispatch(require('./actions').fetchAddressSuggestions(query))
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

    const store = mockStore({ addressSuggestions: [] });

    return store.dispatch(require('./actions').fetchAddressSuggestions(query))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });
});

describe('containers/search-box/actions/setAddress', () => {
  it('creates SET_ADDRESS', () => {
    const address = 'Blåbärsbacken 7';
    expect(require('./actions').setAddress(address)).to.eql({
      type: types.SET_ADDRESS,
      address,
    });
  });
});

describe('containers/search-box/actions/clearSuggestions', () => {
  it('creates CLEAR_SUGGESTIONS', () => {
    expect(require('./actions').clearSuggestions()).to.eql({
      type: types.CLEAR_SUGGESTIONS,
    });
  });
});
