import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import * as types from './types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('containers/shelters/actions/fetchSingleShelter', () => {
  let fetchJson;

  beforeAll(() => {
    jest.mock('../../lib/fetch-json');
    fetchJson = require('../../lib/fetch-json').default;
  });

  afterEach(() => {
    fetchJson.mockReset();
    jest.unmock('../../lib/fetch-json');
  });

  it('creates FETCH_SINGLE_SHELTER', () => {
    fetchJson.mockReturnValueOnce(Promise.resolve());

    const store = mockStore({ shelters: [] });

    return store.dispatch(require('./actions').fetchSingleShelter(1))
      .then(() => expect(store.getActions()[0]).to.eql({
        type: types.FETCH_SINGLE_SHELTER,
      }));
  });

  it('calls the API with accurate id', () => {
    const id = 892743843;
    fetchJson.mockReturnValueOnce(Promise.resolve());

    const store = mockStore({ shelters: [] });

    return store.dispatch(require('./actions').fetchSingleShelter(id))
      .then(() => expect(fetchJson.mock.calls[0][0]).to.match(new RegExp(`shelters/${id}`)));
  });

  it('creates FETCH_SINGLE_SHELTER_SUCCESS when fetching shelter is finished', () => {
    const store = mockStore({ shelters: [] });
    const shelter = { shelterId: '123213-asd12132-675' };
    fetchJson.mockReturnValueOnce(Promise.resolve(shelter));

    return store.dispatch(require('./actions').fetchSingleShelter(1))
      .then(() => expect(store.getActions().pop()).to.eql({
        type: types.FETCH_SINGLE_SHELTER_SUCCESS,
        shelter,
      }));
  });

  it('creates FETCH_SINGLE_SHELTER_FAILED when fetching shelter fails', () => {
    const store = mockStore({ shelters: [] });
    const error = { error: '123213-asd12132-675' };
    fetchJson.mockReturnValueOnce(Promise.reject(error));

    return store.dispatch(require('./actions').fetchSingleShelter(1))
      .then(() => expect(store.getActions().pop()).to.eql({
        type: types.FETCH_SINGLE_SHELTER_FAILED,
        error,
      }));
  });
});

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
    const shelter = { position: { lat: 1, long: 2 }, display_name: 'This play' };
    const query = { lat: 3, lon: 4 };
    fetchJson.mockReturnValueOnce(Promise.resolve([shelter]));

    const expectedActions = [
      { type: types.FETCH_SHELTERS },
      {
        type: types.FETCH_SHELTERS_SUCCESS,
        shelters: [shelter],
      },
      {
        type: types.SET_BOUNDS,
        bounds: [
          [shelter.position.lat, shelter.position.long],
          [shelter.position.lat, shelter.position.long],
        ],
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

describe('containers/shelters/actions/setBoundsForPositions', () => {
  it('creates SET_BOUNDS with accurate bounds', () => {
    const smallest = [1, 2];
    const biggest = [300, 400];
    const bounds = [smallest, biggest];

    expect(require('./actions').setBoundsForPositions(bounds)).to.eql({
      type: types.SET_BOUNDS,
      bounds,
    });
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

  afterEach(() => {
    fetchJson.mockReset();
  });

  it('calls the API with accurate query params', () => {
    const from = [18, 14];
    const shelter = { position: { lat: 14, long: 18 } };
    fetchJson.mockReturnValueOnce(Promise.resolve());

    const store = mockStore({ shelters: [] });

    return store.dispatch(require('./actions').fetchRouteToShelter(from, shelter))
      .then(() => {
        expect(fetchJson.mock.calls[0][0]).to.match(new RegExp(`coordinates=${from[1]},${from[0]}|${shelter.position.long},${shelter.position.lat}`));
      });
  });

  it('creates FETCH_ROUTE_TO_SHELTER_SUCCESS when fetching shelters is finished', () => {
    const route = { route: '66' };
    const from = { lat: 3, lon: 4 };
    const shelter = { position: { lat: 14, long: 18 } };
    fetchJson.mockReturnValueOnce(Promise.resolve(route));

    const expectedActions = [
      { type: types.FETCH_ROUTE_TO_SHELTER },
      {
        type: types.FETCH_ROUTE_TO_SHELTER_SUCCESS,
        route,
      },
    ];

    const store = mockStore({ shelters: [] });

    return store.dispatch(require('./actions').fetchRouteToShelter(from, shelter))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('creates FETCH_ROUTE_TO_SHELTER_FAILED when fetching shelters failed', () => {
    const error = new Error();
    const from = { lat: 13, lon: 40 };
    const shelter = { position: { lat: 114, long: 18 } };
    fetchJson.mockReturnValueOnce(Promise.reject(error));

    const expectedActions = [
      { type: types.FETCH_ROUTE_TO_SHELTER },
      {
        type: types.FETCH_ROUTE_TO_SHELTER_FAILED,
        error,
      },
    ];

    const store = mockStore({ shelters: [] });

    return store.dispatch(require('./actions').fetchRouteToShelter(from, shelter))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });
});

describe('containers/shelters/actions/selectShelter', () => {
  let fetchJson;

  beforeAll(() => {
    jest.mock('../../lib/fetch-json');
    fetchJson = require('../../lib/fetch-json').default;
  });

  afterEach(() => {
    fetchJson.mockReset();
    jest.unmock('../../lib/fetch-json');
  });

  it('fetches the shelter and then creates SELECT_SHELTER', () => {
    const shelter = { shelter: 1, position: {} };
    fetchJson.mockReturnValueOnce(Promise.resolve(shelter));
    fetchJson.mockReturnValueOnce(Promise.resolve());

    const expectedActions = [
      { type: types.FETCH_SINGLE_SHELTER },
      { type: types.FETCH_SINGLE_SHELTER_SUCCESS, shelter },
      { type: types.SELECT_SHELTER, shelter },
    ];

    const store = mockStore({ Shelters: { youAreHere: [] } });

    return store.dispatch(require('./actions').selectShelter(shelter.id))
      .then(() => expect(store.getActions().slice(0, 3)).to.eql(expectedActions));
  });

  it('creates FETCH_ROUTE_TO_SHELTER after selecting the shelter', () => {
    const shelter = { shelter: 1, position: {} };
    fetchJson.mockReturnValueOnce(Promise.resolve(shelter));
    fetchJson.mockReturnValueOnce(Promise.resolve());

    const expectedActions = [
      { type: types.FETCH_ROUTE_TO_SHELTER },
    ];

    const store = mockStore({ Shelters: { youAreHere: [] } });

    return store.dispatch(require('./actions').selectShelter(shelter.id))
      .then(() => expect(store.getActions().slice(3, 4)).to.eql(expectedActions));
  });

  it('creates SET_BOUNDS based on youAreHere and selectedShelter', () => {
    const youAreHere = [5, 10];
    const shelter = { position: { lat: 132, long: 8000 } };
    fetchJson.mockReturnValueOnce(Promise.resolve(shelter));
    fetchJson.mockReturnValueOnce(Promise.resolve());

    const expectedActions = [
      { type: types.SET_BOUNDS, bounds: [youAreHere, [shelter.position.lat, shelter.position.long]] },
    ];

    const store = mockStore({ Shelters: { youAreHere } });

    return store.dispatch(require('./actions').selectShelter(13))
      .then(() => expect(store.getActions().slice(5, 6)).to.eql(expectedActions));
  });
});

describe('containers/shelters/actions/unselectShelter', () => {
  it('creates UNSELECT_SHELTER', () => {
    expect(require('./actions').unselectShelter())
      .to.eql({ type: types.UNSELECT_SHELTER });
  });
});

describe('containers/shelters/actions/clearError', () => {
  it('creates CLEAR_ERROR', () => {
    expect(require('./actions').clearError()).to.eql({
      type: types.CLEAR_ERROR,
    });
  });
});
