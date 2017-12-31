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

  it('should add selected shelter to state upon SELECT_SHELTER', () => {
    const shelter = { shelter: 'is selected' };

    expect(SheltersReducer(undefined, { type: types.SELECT_SHELTER, shelter }).selectedShelter)
      .to.eql(shelter);
  });
});