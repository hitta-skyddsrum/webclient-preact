import fetchJson from '../../lib/fetch-json';

import {
  FETCH_SHELTERS,
  FETCH_SHELTERS_SUCCESS,
  FETCH_SHELTERS_FAILED,
  FETCH_ROUTE_TO_SHELTER,
  FETCH_ROUTE_TO_SHELTER_SUCCESS,
  FETCH_ROUTE_TO_SHELTER_FAILED,
  SELECT_SHELTER,
} from './types';

export const fetchShelters = (lat, lon) => {
  return dispatch => {
    dispatch({
      type: FETCH_SHELTERS,
    });

    return fetchJson(`https://api.hittaskyddsrum.se/api/v1/shelters/?lat=${lat}&long=${lon}`)
      .then(response => dispatch({
        type: FETCH_SHELTERS_SUCCESS,
        shelters: response,
      }))
      .catch(error => dispatch({
        type: FETCH_SHELTERS_FAILED,
        error,
      }));
  };
};

export const fetchRouteToShelter = (from, shelter) => {
  return dispatch => {
    dispatch({
      type: FETCH_ROUTE_TO_SHELTER,
    });

    return fetchJson(`https://api.openrouteservice.org/directions?api_key=${process.env.ORS_API_KEY}&coordinates=${from.lon},${from.lat}|${shelter.lon},${shelter.lat}&profile=driving-car`)
      .then(response => dispatch({
        type: FETCH_ROUTE_TO_SHELTER_SUCCESS,
        route: response,
      }))
      .catch(error => dispatch({
        type: FETCH_ROUTE_TO_SHELTER_FAILED,
        error,
      }));
  };
};

export const selectShelter = shelter => {
  return {
    type: SELECT_SHELTER,
    shelter,
  };
};
