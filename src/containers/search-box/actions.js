import fetchJson from '../../lib/fetch-json';
import formatNominatimAddress from '../../lib/format-nominatim-address';

import {
  FETCH_ADDRESS_SUGGESTIONS,
  FETCH_ADDRESS_SUGGESTIONS_FAILED,
  FETCH_ADDRESS_SUGGESTIONS_SUCCESS,
  SET_ADDRESS,
  CLEAR_SUGGESTIONS,
} from './types';

export const fetchAddressSuggestions = query => {
  return dispatch => {
    dispatch({
      type: FETCH_ADDRESS_SUGGESTIONS,
      query,
    });

    // See https://nominatim.openstreetmap.org/reverse.php for zoom levels
    return fetchJson(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=se&addressdetails=1&zoom=10&accept-language=sv&q=${query}&email=${process.env.OSM_EMAIL}`)
      .then(response => dispatch({
        type: FETCH_ADDRESS_SUGGESTIONS_SUCCESS,
        addressSuggestions: response
          .filter(place => place.type !== 'commercial')
          .map(place => ({
            lat: place.lat,
            lon: place.lon,
            name: formatNominatimAddress(place),
          })),
      }))
      .catch(error => dispatch({
        type: FETCH_ADDRESS_SUGGESTIONS_FAILED,
        error,
      }));
  };
};

export const setAddress = address => {
  return {
    type: SET_ADDRESS,
    address,
  };
};

export const clearSuggestions = () => {
  return {
    type: CLEAR_SUGGESTIONS,
  };
};
