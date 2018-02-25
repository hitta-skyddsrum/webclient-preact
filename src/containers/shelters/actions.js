import fetchJson from '../../lib/fetch-json';
import formatNominatimAddress from '../../lib/format-nominatim-address';
import { getBoundsAroundPositions, isPositionWithinBounds } from '../../lib/geo-utils';

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
  SELECT_ADDRESS,
  REVERSE_GEOCODE,
  REVERSE_GEOCODE_FAILED,
  REVERSE_GEOCODE_SUCCESS,
  UNSELECT_SHELTER,
  CLEAR_ERROR,
  SET_BOUNDS,
} from './types';

export const fetchSingleShelter = (id) => {
  return dispatch => {
    dispatch({
      type: FETCH_SINGLE_SHELTER,
    });

    return fetchJson(`https://api.hittaskyddsrum.se/api/v1/shelters/${id}`)
      .then(shelter => dispatch({
        type: FETCH_SINGLE_SHELTER_SUCCESS,
        shelter,
      }))
      .catch(error => dispatch({
        type: FETCH_SINGLE_SHELTER_FAILED,
        error,
      }));
  };
};

export const fetchShelters = (lat, lon) => {
  return dispatch => {
    dispatch({
      type: FETCH_SHELTERS,
    });

    return fetchJson(`https://api.hittaskyddsrum.se/api/v1/shelters/?lat=${lat}&long=${lon}`)
      .then(shelters => dispatch({
        type: FETCH_SHELTERS_SUCCESS,
        shelters,
      }))
      .then(({ shelters }) => dispatch(
        setBoundsForPositions(shelters
          .map(({ position: { lat: shelterLat, long: shelterLong } }) => [shelterLat, shelterLong])
          .concat([[lat, lon]])
        )
      ))
      .catch(error => dispatch({
        type: FETCH_SHELTERS_FAILED,
        error,
      }));
  };
};

export const setBoundsForPositions = positions => {
  return {
    type: SET_BOUNDS,
    bounds: getBoundsAroundPositions(positions),
  };
};

export const fetchRouteToShelter = (from, shelter) => {
  return dispatch => {
    dispatch({
      type: FETCH_ROUTE_TO_SHELTER,
    });

    return fetchJson(`https://api.openrouteservice.org/directions?api_key=${process.env.ORS_API_KEY}&coordinates=${from[1]},${from[0]}|${shelter.position.long},${shelter.position.lat}&profile=driving-car`)
      .then(route => dispatch({
        type: FETCH_ROUTE_TO_SHELTER_SUCCESS,
        route,
      }))
      .catch(error => dispatch({
        type: FETCH_ROUTE_TO_SHELTER_FAILED,
        error,
      }));
  };
};

export const selectShelter = id => {
  return (dispatch, getStore) => {
    const state = getStore().Shelters;
    let selectedShelter;

    return dispatch(fetchSingleShelter(id))
      .then(({ shelter }) => {
        selectedShelter = shelter;
        dispatch({ type: SELECT_SHELTER, shelter });
      })
      .then(() => dispatch(fetchRouteToShelter(state.youAreHere, selectedShelter)))
      .then(() => {
        const shelterPos = [selectedShelter.position.lat, selectedShelter.position.long];

        if (!state.bounds.length || !isPositionWithinBounds(shelterPos, state.bounds)) {
          dispatch(setBoundsForPositions([shelterPos, state.youAreHere]));
        }
      });
  };
};

export const selectAddress = suggestion => {
  return {
    type: SELECT_ADDRESS,
    address: suggestion,
  };
};

export const unselectShelter = () => {
  return {
    type: UNSELECT_SHELTER,
  };
};

export const reverseGeocode = (lat, lon) => {
  return dispatch => {
    dispatch({
      type: REVERSE_GEOCODE,
    });

    return fetchJson(`https://eu1.locationiq.org/v1/reverse.php?lat=${lat}&lon=${lon}&format=json&key=${process.env.LOCATION_IQ_API_KEY}`)
      .then(response => dispatch({
        type: REVERSE_GEOCODE_SUCCESS,
        response: {
          ...response,
          name: formatNominatimAddress(response),
        },
      }))
      .catch(error =>
        dispatch({
          type: REVERSE_GEOCODE_FAILED,
          error,
        })
      );
  };
};

export const clearError = () => {
  return {
    type: CLEAR_ERROR,
  };
};
