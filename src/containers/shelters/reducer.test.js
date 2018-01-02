import polyline from 'polyline';
import { expect } from 'chai';

import * as types from './types';
import SheltersReducer from './reducer';

describe('containers/shelters/reducer', () => {
  it('should return an accurate initial state', () => {
    expect(SheltersReducer(undefined, {}).shelters).to.eql([]);
  });

  it('should return the default state per default', () => {
    const oldState = { im: 'very old' };

    expect(SheltersReducer(oldState, { type: 'NOT_MATCHING_ANYTHING'})).to.eql(oldState);
  });

  it('should increment loading upon FETCH_SINGLE_SHELTER', () => {
    const loading = 1337;

    expect(SheltersReducer({ loading }, { type: types.FETCH_SINGLE_SHELTER }).loading)
      .to.equal(loading + 1);
  });

  it('should append shelter to shelters upon FETCH_SINGLE_SHELTER_SUCCESS', () => {
    const oldShelters = [
      { shelterId: 1 },
    ];
    const shelter = { shelterId: 2 };

    expect(SheltersReducer({ shelters: oldShelters }, { type: types.FETCH_SINGLE_SHELTER_SUCCESS, shelter }).shelters)
      .to.eql([...oldShelters, shelter]);
  });

  it('should decrement loading upon FETCH_SINGLE_SHELTER_SUCCESS', () => {
    const loading = 2;

    expect(SheltersReducer({ loading }, { type: types.FETCH_SINGLE_SHELTER_SUCCESS }).loading)
      .to.equal(loading - 1);
  });

  it('should set error state upon FETCH_SINGLE_SHELTER_FAILED', () => {
    const error = new Error();

    expect(SheltersReducer(undefined, { type: types.FETCH_SINGLE_SHELTER_FAILED, error }).error)
      .to.eql(error);
    expect(SheltersReducer(undefined, { type: types.FETCH_SINGLE_SHELTER_FAILED, error }).humanError.message)
      .to.match(new RegExp('Fel'));
    expect(SheltersReducer(undefined, { type: types.FETCH_SINGLE_SHELTER_FAILED, error }).humanError.desc)
      .to.match(new RegExp('misslyckades'));
  });

  it('should decrement loading upon FETCH_SINGLE_SHELTER_FAILED', () => {
    const loading = 2;

    expect(SheltersReducer({ loading }, { type: types.FETCH_SINGLE_SHELTER_FAILED }).loading)
      .to.equal(loading - 1);
  });

  it('should increment loading upon FETCH_SHELTERS', () => {
    const loading = 34;

    expect(SheltersReducer({ loading }, { type: types.FETCH_SHELTERS }).loading)
      .to.equal(loading + 1);
  });

  it('should decrement loading upon FETCH_SHELTERS_SUCCESS', () => {
    const loading = 34;

    expect(SheltersReducer({ loading }, { type: types.FETCH_SHELTERS_SUCCESS }).loading)
      .to.equal(loading - 1);
  });

  it('should decrement loading upon FETCH_SHELTERS_FAILED', () => {
    const loading = 34;

    expect(SheltersReducer({ loading }, { type: types.FETCH_SHELTERS_FAILED }).loading)
      .to.equal(loading - 1);
  });

  it('should replace shelters in state upon FETCH_SHELTERS_SUCCESS', () => {
    const oldState = { shelters: [{ name: 'release me' }] };
    const shelters = [{ name: 'Im the king' }];

    expect(SheltersReducer(oldState, { type: types.FETCH_SHELTERS_SUCCESS, shelters }).shelters)
      .to.eql(shelters);
  });

  it('should add error to state upon FETCH_SHELTERS_FAILED', () => {
    const error = new Error();

    expect(SheltersReducer(undefined, { type: types.FETCH_SHELTERS_FAILED, error}).error)
      .to.equal(error);
    expect(SheltersReducer(undefined, { type: types.FETCH_SHELTERS_FAILED, error}).humanError.message)
      .to.equal('Fel vid hämtning skyddsrumsdata');
    expect(SheltersReducer(undefined, { type: types.FETCH_SHELTERS_FAILED, error}).humanError.desc)
      .to.match(new RegExp('misslyckades'));
  });

  it('should increment loading upon FETCH_ROUTE_TO_SHELTER', () => {
    const loading = 1;

    expect(SheltersReducer({ loading }, { type: types.FETCH_ROUTE_TO_SHELTER }).loading)
      .to.equal(loading + 1);
  });

  it('should decrement loading upon FETCH_ROUTE_TO_SHELTER_SUCCESS', () => {
    const loading = 3;

    expect(SheltersReducer({ loading }, { type: types.FETCH_ROUTE_TO_SHELTER_SUCCESS, route: { routes: [] } }).loading)
      .to.equal(loading - 1);
  });

  it('should decrement loading upon FETCH_ROUTE_TO_SHELTER_FAILED', () => {
    const loading = 3321;

    expect(SheltersReducer({ loading }, { type: types.FETCH_ROUTE_TO_SHELTER_FAILED }).loading)
      .to.equal(loading - 1);
  });

  it('should add routes to state upon FETCH_ROUTE_TO_SHELTER_SUCCESS', () => {
    const decodedRoutes = [
      {
        coordinates: [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]],
      },
    ];
    const encodedRoutes = decodedRoutes.map(route => ({ ...route, geometry: polyline.encode(route.coordinates) }));
    const action = { type: types.FETCH_ROUTE_TO_SHELTER_SUCCESS, route: { routes: encodedRoutes } };

    expect(SheltersReducer(undefined, action).routes)
      .to.eql(decodedRoutes.map((route, index) => ({...route, ...encodedRoutes[index] })));
  });

  it('should add error to state upon FETCH_ROUTE_TO_SHELTER_FAILED', () => {
    const error = new Error();
    expect(SheltersReducer(undefined, { type: types.FETCH_ROUTE_TO_SHELTER_FAILED, error}).error)
      .to.equal(error);
    expect(SheltersReducer(undefined, { type: types.FETCH_ROUTE_TO_SHELTER_FAILED, error}).humanError.message)
      .to.equal('Fel vid hämtning av vägbeskrivning');
    expect(SheltersReducer(undefined, { type: types.FETCH_ROUTE_TO_SHELTER_FAILED, error}).humanError.desc)
      .to.match(new RegExp('misslyckades'));
  });

  it('should add selected shelter to state upon SELECT_SHELTER', () => {
    const shelter = { shelter: 'is selected' };

    expect(SheltersReducer(undefined, { type: types.SELECT_SHELTER, shelter }).selectedShelter)
      .to.eql(shelter);
  });

  it('should clear selectedShelter and routes upon UNSELECT_SHELTER', () => {
    const state = {
      selectedShelter: { some: 'thing' },
      routes: ['very', 'much'],
    };

    expect(SheltersReducer(state, { type: types.UNSELECT_SHELTER }).selectedShelter)
      .to.equal(null);
    expect(SheltersReducer(state, { type: types.UNSELECT_SHELTER }).routes)
      .to.eql([]);
  });

  it('should remove error from state upon CLEAR_ERROR', () => {
    expect(SheltersReducer({ error: true }, { type: types.CLEAR_ERROR }).error)
      .to.eql(null);
    expect(SheltersReducer({ humanError: true }, { type: types.CLEAR_ERROR }).humanError)
      .to.eql(null);
  });
});
