import polyline from 'polyline';
import {
  FETCH_SHELTERS_SUCCESS,
  FETCH_SHELTERS_FAILED,
  FETCH_ROUTE_TO_SHELTER_SUCCESS,
  FETCH_ROUTE_TO_SHELTER_FAILED,
  SELECT_SHELTER,
  CLEAR_ERROR,
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
    case FETCH_ROUTE_TO_SHELTER_FAILED:
      return {
        ...state,
        error: action.error,
      };
    case SELECT_SHELTER:
      return {
        ...state,
        selectedShelter: { ...action.shelter },
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
