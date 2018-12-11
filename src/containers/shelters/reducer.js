import polyline from '@mapbox/polyline';
import { getSearchParam, getValueAfterSection } from '../../lib/url-parser';
import {
  GET_CURRENT_POSITION_FAILED,
  SELECT_ADDRESS,
} from '../search-box/types';
import {
  FETCH_SINGLE_SHELTER,
  FETCH_SINGLE_SHELTER_SUCCESS,
  FETCH_SINGLE_SHELTER_FAILED,
  FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND,
  FETCH_SHELTERS,
  FETCH_SHELTERS_SUCCESS,
  FETCH_SHELTERS_FAILED,
  FETCH_ROUTE_TO_SHELTER,
  FETCH_ROUTE_TO_SHELTER_SUCCESS,
  FETCH_ROUTE_TO_SHELTER_FAILED,
  FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND,
  SELECT_SHELTER,
  UNSELECT_SHELTER,
  REVERSE_GEOCODE_SUCCESS,
  REVERSE_GEOCODE_FAILED,
  SET_BOUNDS,
} from './types';

const initialState = {
  shelters: [],
  routes: [],
  error: null,
  loading: 0,
  youAreHere: [],
  bounds: [],
  selectedAddress: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      const youAreHere = [
        getSearchParam(action.payload.search, 'lat'),
        getSearchParam(action.payload.search, 'lon') || getSearchParam(action.payload.search, 'long'),
      ]
        .filter(pos => !!pos)
        .map(pos => parseFloat(pos));

      return {
        ...state,
        youAreHere: youAreHere.length === 2 ? youAreHere : [],
        selectedShelterId: getValueAfterSection(action.payload.pathname, 'skyddsrum') || 0,
      };
    }
    case SELECT_ADDRESS:
      return {
        ...state,
        selectedAddress: action.address,
      };
    case FETCH_SINGLE_SHELTER:
      return {
        ...state,
        loading: state.loading + 1,
      };
    case FETCH_SINGLE_SHELTER_SUCCESS:
      return {
        ...state,
        loading: state.loading - 1,
        shelters: state.shelters
          .find(s => s.shelterId === action.shelter.shelterId)
          ? state.shelters
          : [...state.shelters, action.shelter],
      };
    case FETCH_SINGLE_SHELTER_FAILED:
      return {
        ...state,
        loading: state.loading - 1,
        error: action.error,
        selectedShelterId: 0,
      };
    case FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND:
      return {
        ...state,
        loading: state.loading - 1,
        error: action.error,
        selectedShelterId: 0,
      };
    case FETCH_SHELTERS:
      return {
        ...state,
        loading: state.loading + 1,
      };
    case FETCH_SHELTERS_SUCCESS:
      return {
        ...state,
        shelters: action.shelters,
        loading: state.loading - 1,
      };
    case FETCH_SHELTERS_FAILED:
      return {
        ...state,
        loading: state.loading - 1,
        error: action.error,
      };
    case SET_BOUNDS:
      return {
        ...state,
        bounds: action.bounds,
      };
    case FETCH_ROUTE_TO_SHELTER:
      return {
        ...state,
        loading: state.loading + 1,
      };
    case FETCH_ROUTE_TO_SHELTER_SUCCESS:
      return {
        ...state,
        loading: state.loading - 1,
        routes: action.route.routes
          .map(route => ({ ...route, coordinates: polyline.decode(route.geometry) })),
      };
    case FETCH_ROUTE_TO_SHELTER_FAILED:
      return {
        ...state,
        loading: state.loading - 1,
        error: action.error,
      };
    case FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND:
      return {
        ...state,
        loading: state.loading - 1,
        error: action.error,
      };
    case GET_CURRENT_POSITION_FAILED:
      return {
        ...state,
        error: action.error,
      };
    case SELECT_SHELTER:
      return {
        ...state,
        selectedShelter: { ...action.shelter },
      };
    case UNSELECT_SHELTER:
      return {
        ...state,
        selectedShelter: undefined,
        routes: [],
      };
    case REVERSE_GEOCODE_FAILED:
      return {
        ...state,
        error: action.error,
      };
    case REVERSE_GEOCODE_SUCCESS:
      return {
        ...state,
        selectedAddress: action.response,
      };
    default:
      return state;
  }
};
