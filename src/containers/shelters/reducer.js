import polyline from 'polyline';
import { getSearchParam, getValueAfterSection } from '../../lib/url-parser';
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
  GET_CURRENT_POSITION,
  GET_CURRENT_POSITION_SUCCESS,
  GET_CURRENT_POSITION_FAILED,
  SELECT_SHELTER,
  UNSELECT_SHELTER,
  REVERSE_GEOCODE_SUCCESS,
  REVERSE_GEOCODE_FAILED,
  SELECT_ADDRESS,
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
        humanError: {
          message: 'Fel vid hämtning av skyddsrumsdata',
          desc: `Hämtningen av skyddsrumsdata för det skyddsrum du söker misslyckades.
            Felet kan bero på att länken är gammal eller på grund av ett tillfälligt fel.
            Vi rekommenderar att du besöker msb.se för att hämta data om skyddsrum.`,
        },
      };
    case FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND:
      return {
        ...state,
        loading: state.loading - 1,
        error: action.error,
        selectedShelterId: 0,
        humanError: {
          message: 'Skyddsrummet kunde inte hittas',
          desc: `Skyddsrummet du sökte finns inte i vår databas. Detta kan bero på
            att skyddsrummet inte finns längre.`,
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
    case FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND:
      return {
        ...state,
        loading: state.loading - 1,
        error: action.error,
        humanError: {
          message: 'Kunde inte hitta vägbeskrivning',
          desc: `En vägbeskrivning mellan den plats du angett
            och det skyddsrum du valt kunde inte hittas. Detta
            kan bero på att bilvägar mellan platserna saknas eller
            att vår data-källa saknar kunskap om denna väg.`,
        },
      };
    case GET_CURRENT_POSITION:
      return {
        ...state,
        loading: state.loading + 1,
      };
    case GET_CURRENT_POSITION_FAILED:
      return {
        ...state,
        error: action.error,
        humanError: action.error.toString(),
        loading: state.loading - 1,
      };
    case GET_CURRENT_POSITION_SUCCESS:
      return {
        ...state,
        loading: state.loading - 1,
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
