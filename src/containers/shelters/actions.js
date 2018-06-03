import fetchJson from '../../lib/fetch-json';
import formatNominatimAddress from '../../lib/format-nominatim-address';
import { getBoundsAroundPositions } from '../../lib/geo-utils';

import {
  FETCH_SINGLE_SHELTER,
  FETCH_SINGLE_SHELTER_SUCCESS,
  FETCH_SINGLE_SHELTER_FAILED,
  FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND,
  FETCH_SHELTERS,
  FETCH_SHELTERS_SUCCESS,
  FETCH_SHELTERS_FAILED,
  FETCH_ROUTE_TO_SHELTER,
  FETCH_ROUTE_TO_SHELTER_SKIPPED,
  FETCH_ROUTE_TO_SHELTER_SUCCESS,
  FETCH_ROUTE_TO_SHELTER_FAILED,
  FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND,
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

    return fetchJson(`https://api.hittaskyddsrum.se/api/v2/shelters/${id}`)
      .then(shelter => dispatch({
        type: FETCH_SINGLE_SHELTER_SUCCESS,
        shelter,
      }))
      .catch(error => {
        if (error.status === 404) {
          dispatch({
            type: FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND,
            error,
          });
        } else {
          dispatch({
            type: FETCH_SINGLE_SHELTER_FAILED,
            error,
          });
        }
      });
  };
};

export const fetchShelters = (lat, lon) => {
  return dispatch => {
    dispatch({
      type: FETCH_SHELTERS,
    });

    return fetchJson(`https://api.hittaskyddsrum.se/api/v2/shelters/?lat=${lat}&long=${lon}`)
      .then(shelters => dispatch({
        type: FETCH_SHELTERS_SUCCESS,
        shelters,
      }))
      .then(({ shelters }) => dispatch(
        setBoundsForPositions(shelters
          .slice(0, 10)
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

export const fetchSheltersWithin = bbox => dispatch => {
  dispatch({
    type: FETCH_SHELTERS,
  });

  return fetchJson(`https://api.hittaskyddsrum.se/api/v3/shelters/?bbox=${bbox}`)
    .then(shelters => {
      dispatch({
        type: FETCH_SHELTERS_SUCCESS,
        shelters,
      });
    })
    .catch(error => dispatch({
      type: FETCH_SHELTERS_FAILED,
      error,
    }));
};

export const setBounds = bounds => ({
  type: SET_BOUNDS,
  bounds,
});

export const setBoundsForPositions = positions =>
  setBounds(getBoundsAroundPositions(positions));

export const fetchRouteToShelter = (from, shelter) => {
  if (from.filter(val => !!val).length !== 2) {
    return {
      type: FETCH_ROUTE_TO_SHELTER_SKIPPED,
    };
  }

  return dispatch => {
    dispatch({
      type: FETCH_ROUTE_TO_SHELTER,
    });

    return fetchJson(`https://api.openrouteservice.org/directions?api_key=${process.env.ORS_API_KEY}&coordinates=${from[1]},${from[0]}|${shelter.position.long},${shelter.position.lat}&profile=driving-car`)
      .then(route => dispatch({
        type: FETCH_ROUTE_TO_SHELTER_SUCCESS,
        route,
      }))
      .catch(error => {
        if (error.status === 404) {
          return dispatch({
            type: FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND,
            error,
          });
        }

        /// https://github.com/GIScience/openrouteservice/issues/144
        try {
          const responseError = error.jsonResponse.error;
          if (responseError.code === 2099 && responseError.message === 'Connection between locations not found') {
            return dispatch({
              type: FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND,
              error,
            });
          }
        } catch (e) {}

        dispatch({
          type: FETCH_ROUTE_TO_SHELTER_FAILED,
          error,
        });
      });
  };
};

export const selectShelter = id => (dispatch, getStore) => {
  return dispatch(fetchSingleShelter(id))
    .then(({ shelter } = {}) => {
      if (!shelter) return;

      dispatch({ type: SELECT_SHELTER, shelter });

      const { youAreHere } = getStore().Shelters;
      dispatch(fetchRouteToShelter(youAreHere, shelter));
    });
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
