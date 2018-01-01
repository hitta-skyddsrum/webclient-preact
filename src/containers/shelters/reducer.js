import polyline from 'polyline';
import {
  FETCH_SHELTERS_SUCCESS,
  FETCH_SHELTERS_FAILED,
  FETCH_ROUTE_TO_SHELTER_SUCCESS,
  FETCH_ROUTE_TO_SHELTER_FAILED,
  SELECT_SHELTER,
  CLEAR_ERROR,
} from './types';

const initialState = {
  shelters: [],
  routes: [],
  error: null,
  humanError: null,
};

export default (state = initialState, action) => {
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
        humanError: {
          message: 'Fel vid hämtning skyddsrumsdata',
          desc: `Hämtningen av skyddsrumsdata för ditt
            sökområde misslyckades. Felet kan bero på att
            tjänsten är överbelastad. Vi rekommenderar att
            du besöker msb.se för att hämta data om skyddsrum.`,
        },
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
