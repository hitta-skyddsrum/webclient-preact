import { expect } from 'chai';

import {
  GET_CURRENT_POSITION_FAILED,
  SELECT_ADDRESS,
} from '../search-box/types';
import * as types from './types';
import SheltersReducer from './reducer';

describe('containers/shelters/reducer', () => {
  it('should return an accurate initial state', () => {
    expect(SheltersReducer(undefined, {}).shelters).to.eql([]);
    expect(SheltersReducer(undefined, {}).selectedAddress).to.eql({});
  });

  it('should return the default state per default', () => {
    const oldState = { im: 'very old' };

    expect(SheltersReducer(oldState, { type: 'NOT_MATCHING_ANYTHING'})).to.eql(oldState);
  });

  it('should update youAreHere state upon @@router/LOCATION_CHANGE', () => {
    const lat = 14.57;
    const lon = 13.12;
    const search = `?lat=${lat}&lon=${lon}`;
    const payload = { search, pathname: '' };

    expect(SheltersReducer({}, { type: '@@router/LOCATION_CHANGE', payload }).youAreHere)
      .to.eql([lat, lon]);
  });

  it('should accept long as search param when setting state upon @@router/LOCATION_CHANGE', () => {
    const lat = 13.133;
    const long = 12;
    const search = `?lat=${lat}&long=${long}`;
    const payload = { search, pathname: '' };

    expect(SheltersReducer({}, { type: '@@router/LOCATION_CHANGE', payload }).youAreHere)
      .to.eql([lat, long]);
  });

  it('should not update youAreHere state upon @@router/LOCATION_CHANGE if not both lat and lon is present', () => {
    const state = SheltersReducer({}, { type: '@@router/LOCATION_CHANGE', payload: { search: '?lat=12', pathname: '' }}).youAreHere;
    expect(state).to.eql([]);
  });

  it('should unset youAreHere state upon @@router/LOCATION_CHANGE', () => {
    const oldState = { youAreHere: [11, 10] };
    const search = '';
    const payload = { search, pathname: '' };

    expect(SheltersReducer(oldState, { type: '@@router/LOCATION_CHANGE', payload }).youAreHere)
      .to.eql([]);
  });

  it('should set selectedShelterId upon @@router/LOCATION_CHANGE', () => {
    const selectedShelterId = '1455';
    const pathname = `/skyddsrum/${selectedShelterId}`;
    const payload = { search: '', pathname };

    expect(SheltersReducer({}, { type: '@@router/LOCATION_CHANGE', payload }).selectedShelterId)
      .to.equal(selectedShelterId);
  });

  it('should unset selectedShelterId upon @@router/LOCATION_CHANGE', () => {
    const oldState = { selectedShelterId: 1 };
    const pathname = '/';
    const payload = { search: '', pathname };

    expect(SheltersReducer(oldState, { type: '@@router/LOCATION_CHANGE', payload }).selectedShelterId)
      .to.equal(0);
  });

  it('should set selectedAddress upon SELECT_ADDRESS', () => {
    const address = { name: 'the streets no 1' };

    expect(SheltersReducer(undefined, { type: SELECT_ADDRESS, address }).selectedAddress)
      .to.eql(address);
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

  it('should not append shelter if it\'s already exists upoN FETCH_SINGLE_SHELTER_SUCCESS', () => {
    const shelter = {
      shelterId: 1337,
    };
    const shelters = [shelter];

    expect(SheltersReducer({ shelters },
      {
        type: types.FETCH_SINGLE_SHELTER_SUCCESS,
        shelter,
      }).shelters)
      .to.eql(shelters);
  });

  it('should decrement loading upon FETCH_SINGLE_SHELTER_SUCCESS', () => {
    const loading = 2;

    expect(SheltersReducer({ loading, shelters: [] }, { type: types.FETCH_SINGLE_SHELTER_SUCCESS }).loading)
      .to.equal(loading - 1);
  });

  it('should set error state upon FETCH_SINGLE_SHELTER_FAILED', () => {
    const error = new Error();

    expect(SheltersReducer(undefined, { type: types.FETCH_SINGLE_SHELTER_FAILED, error }).error)
      .to.eql(error);
  });

  it('should set error state upon FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND', () => {
    const error = new Error();

    expect(SheltersReducer(undefined, { type: types.FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND, error }).error)
      .to.eql(error);
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
  });

  it('should set bounds upon SET_BOUNDS', () => {
    const bounds = [{ bound: 's' }];

    expect(SheltersReducer(undefined, { type: types.SET_BOUNDS, bounds }).bounds)
      .to.eql(bounds);
  });

  it('should increment loading upon FETCH_ROUTE_TO_SHELTER', () => {
    const loading = 1;

    expect(SheltersReducer({ loading }, { type: types.FETCH_ROUTE_TO_SHELTER }).loading)
      .to.equal(loading + 1);
  });

  it('should decrement loading upon FETCH_ROUTE_TO_SHELTER_SUCCESS', () => {
    const loading = 3;

    expect(SheltersReducer({ loading }, { type: types.FETCH_ROUTE_TO_SHELTER_SUCCESS, route: { features: [] } }).loading)
      .to.equal(loading - 1);
  });

  it('should decrement loading upon FETCH_ROUTE_TO_SHELTER_FAILED', () => {
    const loading = 3321;

    expect(SheltersReducer({ loading }, { type: types.FETCH_ROUTE_TO_SHELTER_FAILED }).loading)
      .to.equal(loading - 1);
  });

  it('should decrement loading upon FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND', () => {
    const loading = 3321;

    expect(SheltersReducer({ loading }, { type: types.FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND }).loading)
      .to.equal(loading - 1);
  });

  it('should add routes to state upon FETCH_ROUTE_TO_SHELTER_SUCCESS', () => {
    const decodedRoutes = [
      {
        geometry: {
          coordinates: [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]],
        },
      },
    ];
    const action = { type: types.FETCH_ROUTE_TO_SHELTER_SUCCESS, features: decodedRoutes };

    expect(SheltersReducer(undefined, action).features)
      .to.eql(decodedRoutes);
  });

  it('should add error to state upon FETCH_ROUTE_TO_SHELTER_FAILED', () => {
    const error = new Error();
    expect(SheltersReducer(undefined, { type: types.FETCH_ROUTE_TO_SHELTER_FAILED, error}).error)
      .to.equal(error);
  });

  it('should add error to state upon FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND', () => {
    const error = new Error();
    expect(SheltersReducer(undefined, { type: types.FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND, error}).error)
      .to.equal(error);
  });

  it('should set accurate error upon GET_CURRENT_POSITION_FAILED', () => {
    const error = new Error();
    const returnedState = SheltersReducer(undefined, {
      type: GET_CURRENT_POSITION_FAILED,
      error,
    });

    expect(returnedState.error).to.equal(error);
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
      .to.equal(undefined);
    expect(SheltersReducer(state, { type: types.UNSELECT_SHELTER }).routes)
      .to.eql([]);
  });

  it('should add error to state upon REVERSE_GEOCODEO_FAILED', () => {
    const error = new Error('Bad');

    expect(SheltersReducer({}, { type: types.REVERSE_GEOCODE_FAILED, error }).error)
      .to.eql(error);
  });
  
  it('should add response to selectedAddress upon REVERSE_GEOCODE_SUCCESS', () => {
    const response = { address: 'is here' };

    expect(SheltersReducer({}, { type: types.REVERSE_GEOCODE_SUCCESS, response }).selectedAddress).to.eql(response);
  });
});
