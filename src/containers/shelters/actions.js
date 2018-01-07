import fetchJson from '../../lib/fetch-json';
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
        setBoundsForPositions(shelters.map(({ position: { lat, long } }) => [lat, long])))
      )
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

export const unselectShelter = () => {
  return {
    type: UNSELECT_SHELTER,
  };
};

export const clearError = () => {
  return {
    type: CLEAR_ERROR,
  };
};
