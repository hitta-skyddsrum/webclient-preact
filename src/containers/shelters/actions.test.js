import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import * as types from './types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('containers/shelters/actions/fetchShelters', () => {
  let fetchJson;

  beforeAll(() => {
    jest.mock('../../lib/fetch-json');
    fetchJson = require('../../lib/fetch-json').default;
  });

  afterAll(() => {
    fetchJson.mockReset();
    jest.unmock('../../lib/fetch-json');
  });

  it('calls the API with accurate query params', () => {
    const query = { lat: 3, lon: 4 };
    fetchJson.mockReturnValueOnce(Promise.resolve());

    const store = mockStore({ shelters: [] });

    return store.dispatch(require('./actions').fetchShelters(query.lat, query.lon))
      .then(() => {
        expect(fetchJson.mock.calls[0][0]).to.match(new RegExp(`lat=${query.lat}`));
        expect(fetchJson.mock.calls[0][0]).to.match(new RegExp(`long=${query.lon}`));
      });
  });

  it('creates FETCH_SHELTERS_SUCCESS when fetching shelters is finished', () => {
    const shelters = [
      { lat: 1, lon: 2, display_name: 'This play' },
    ];
    const query = { lat: 3, lon: 4 };
    fetchJson.mockReturnValueOnce(Promise.resolve(shelters));

    const expectedActions = [
      { type: types.FETCH_SHELTERS },
      {
        type: types.FETCH_SHELTERS_SUCCESS,
        shelters,
      },
    ];

    const store = mockStore({ shelters: [] });

    return store.dispatch(require('./actions').fetchShelters(query.lat, query.lon))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('creates FETCH_SHELTERS_FAILED when fetching shelters failed', () => {
    const error = new Error();
    const query = { lat: 3, lon: 4 };
    fetchJson.mockReturnValueOnce(Promise.reject(error));

    const expectedActions = [
      { type: types.FETCH_SHELTERS },
      {
        type: types.FETCH_SHELTERS_FAILED,
        error,
      },
    ];

    const store = mockStore({ shelters: [] });

    return store.dispatch(require('./actions').fetchShelters(query.lat, query.lon))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });
});

describe('containers/shelters/actions/fetchRouteToShelter', () => {
  let fetchJson;

  beforeAll(() => {
    jest.mock('../../lib/fetch-json');
    fetchJson = require('../../lib/fetch-json').default;
  });

  afterAll(() => {
    fetchJson.mockReset();
    jest.unmock('../../lib/fetch-json');
  });

  it('calls the API with accurate query params', () => {
    const from = { lat: 3, lon: 4 };
    const to = { lat: 14, lon: 18 };
    fetchJson.mockReturnValueOnce(Promise.resolve());

    const store = mockStore({ shelters: [] });

    return store.dispatch(require('./actions').fetchRouteToShelter(from, to))
      .then(() => {
        expect(fetchJson.mock.calls[0][0]).to.match(new RegExp(`coordinates=${from.lon},${from.lat}|${to.lon},${to.lat}`));
      });
  });

  it('creates FETCH_ROUTE_TO_SHELTER_SUCCESS when fetching shelters is finished', () => {
    const route = { route: '66' };
    const from = { lat: 3, lon: 4 };
    const to = { lat: 14, lon: 18 };
    fetchJson.mockReturnValueOnce(Promise.resolve(route));

    const expectedActions = [
      { type: types.FETCH_ROUTE_TO_SHELTER },
      {
        type: types.FETCH_ROUTE_TO_SHELTER_SUCCESS,
        route,
      },
    ];

    const store = mockStore({ shelters: [] });

    return store.dispatch(require('./actions').fetchRouteToShelter(from, to))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('creates FETCH_ROUTE_TO_SHELTER_FAILED when fetching shelters failed', () => {
    const error = new Error();
    const from = { lat: 13, lon: 40 };
    const to = { lat: 114, lon: 108 };
    fetchJson.mockReturnValueOnce(Promise.reject(error));

    const expectedActions = [
      { type: types.FETCH_ROUTE_TO_SHELTER },
      {
        type: types.FETCH_ROUTE_TO_SHELTER_FAILED,
        error,
      },
    ];

    const store = mockStore({ shelters: [] });

    return store.dispatch(require('./actions').fetchRouteToShelter(from, to))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });
});

describe('containers/shelters/actions/selectShelter', () => {
  it('creates SELECT_SHELTER', () => {
    const shelter = { shelter: 1 };
    expect(require('./actions').selectShelter(shelter)).to.eql({
      type: types.SELECT_SHELTER,
      shelter,
    });
  });
});
