import polyline from 'polyline';
import {
  FETCH_SHELTERS_SUCCESS,
  FETCH_SHELTERS_FAILED,
  FETCH_ROUTE_TO_SHELTER_SUCCESS,
  SELECT_SHELTER,
} from './types';

export default (state = { shelters: [], routes: [] }, action) => {
  switch (action.type) {
    case FETCH_SHELTERS_SUCCESS:
      return {
        ...state,
        shelters: action.shelters,
      };
    case FETCH_SHELTERS_FAILED:
      return {
        ...state,
        error: action.error,
      };
    case FETCH_ROUTE_TO_SHELTER_SUCCESS:
      return {
        ...state,
        routes: action.route.routes.map(route => ({ ...route, coordinates: polyline.decode(route.geometry) })),
      };
    case SELECT_SHELTER:
      return {
        ...state,
        selectedShelter: { ...action.shelter },
      };
    default:
      return state;
  }
};
