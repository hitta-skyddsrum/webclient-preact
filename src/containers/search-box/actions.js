import fetchJson from '../../lib/fetch-json';
import formatNominatimAddress from '../../lib/format-nominatim-address';

import {
  FETCH_ADDRESS_SUGGESTIONS,
  FETCH_ADDRESS_SUGGESTIONS_FAILED,
  FETCH_ADDRESS_SUGGESTIONS_SUCCESS,
  SELECT_ADDRESS,
} from './types';

export const fetchSuggestions = query => {
  return dispatch => {
    dispatch({
      type: FETCH_ADDRESS_SUGGESTIONS,
      query,
    });

    // See https://nominatim.openstreetmap.org/reverse.php for zoom levels
    return fetchJson(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=se&addressdetails=1&zoom=10&accept-language=sv&q=${query}&email=${process.env.OSM_EMAIL}`)
      .then(response => dispatch({
        type: FETCH_ADDRESS_SUGGESTIONS_SUCCESS,
        suggestions: response
          .filter(place => place.type !== 'commercial')
          .map(place => ({
            lat: place.lat,
            lon: place.lon,
            name: formatNominatimAddress(place),
          }))
          .filter((place, pos, arr) => arr.map(mapObj => mapObj.name).indexOf(place.name) === pos),
      }))
      .catch(error => dispatch({
        type: FETCH_ADDRESS_SUGGESTIONS_FAILED,
        error,
      }));
  };
};

export const selectAddress = address => {
  return {
    type: SELECT_ADDRESS,
    address,
  };
};
