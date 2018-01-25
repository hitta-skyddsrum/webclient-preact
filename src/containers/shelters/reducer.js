import polyline from 'polyline';
import { getSearchParam, getValueAfterSection } from '../../lib/url-parser';
import { SELECT_ADDRESS } from '../search-box/types';
import {
  FETCH_SINGLE_SHELTER,
  FETCH_SINGLE_SHELTER_SUCCESS,
  FETCH_SINGLE_SHELTER_FAILED,
  FETCH_SHELTERS,
  FETCH_SHELTERS_SUCCESS,
  FETCH_SHELTERS_FAILED,
  FETCH_ROUTE_TO_SHELTER,
  FETCH_ROUTE_TO_SHELTER_SUCCESS,
  FETCH_ROUTE_TO_SHELTER_FAILED,
  SELECT_SHELTER,
  UNSELECT_SHELTER,
  CLEAR_ERROR,
  SET_BOUNDS,
} from './types';

const initialState = {
  shelters: [],
  routes: [],
  error: null,
  humanError: null,
  loading: 0,
  youAreHere: [],
  bounds: [],
  selectedAddress: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return {
        ...state,
        youAreHere: [
          getSearchParam(action.payload.search, 'lat'),
          getSearchParam(action.payload.search, 'lon'),
        ].filter(pos => !!pos)
          .map(pos => parseFloat(pos)),
        selectedShelterId: parseInt(getValueAfterSection(action.payload.pathname, 'skyddsrum') || 0, 10),
      };
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
        shelters: [...state.shelters, action.shelter],
      };
    case FETCH_SINGLE_SHELTER_FAILED:
      return {
        ...state,
        loading: state.loading - 1,
        error: action.error,
        humanError: {
          message: 'Fel vid hämtning av skyddsrumsdata',
          desc: `Hämtningen av skyddsrumsdata för det skyddsrum du söker misslyckades.
            Felet kan bero på att länken är gammal eller på grund av ett tillfälligt fel.
            Vi rekommenderar att du besöker msb.se för att hämta data om skyddsrum.`,
        },
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
        humanError: {
          message: 'Fel vid hämtning skyddsrumsdata',
          desc: `Hämtningen av skyddsrumsdata för ditt
            sökområde misslyckades. Felet kan bero på att
            tjänsten är överbelastad. Vi rekommenderar att
            du besöker msb.se för att hämta data om skyddsrum.`,
        },
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
        routes: action.route.routes.map(route => ({ ...route, coordinates: polyline.decode(route.geometry) })),
      };
    case FETCH_ROUTE_TO_SHELTER_FAILED:
      return {
        ...state,
        loading: state.loading - 1,
        error: action.error,
        humanError: {
          message: 'Fel vid hämtning av vägbeskrivning',
          desc: `Hämtningen av vägbeskrivning för ditt valda
            skyddsrum misslyckades. Felet kan bero på att
            tjänsten är överbelastad.`,
        },
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
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
        humanError: null,
      };
    default:
      return state;
  }
};
