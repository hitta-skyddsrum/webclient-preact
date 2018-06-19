import history from '../../history';
import {
  GET_CURRENT_POSITION,
  GET_CURRENT_POSITION_FAILED,
  GET_CURRENT_POSITION_SUCCESS,
  RATE_LIMIT_EXCEEDED,
  SEARCH_ERROR,
  SELECT_ADDRESS,
} from './types';

export const getCurrentPosition = () => dispatch => {
  dispatch({
    type: GET_CURRENT_POSITION,
  });

  if (!('geolocation' in navigator)) {
    return dispatch({
      type: GET_CURRENT_POSITION_FAILED,
      error: new Error('Din webbläsare har inte stöd för att hämta din position'),
    });
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      dispatch({
        type: GET_CURRENT_POSITION_SUCCESS,
        position,
      });

      const { coords: { latitude, longitude } } = position;
      history.push(`/skyddsrum?lat=${latitude}&lon=${longitude}`);
    },
    error => dispatch({
      type: GET_CURRENT_POSITION_FAILED,
      error,
    }),
  );
};

export const rateLimitExceeded = () => ({
  type: RATE_LIMIT_EXCEEDED,
});

export const searchError = error => ({
  type: SEARCH_ERROR,
  error,
});

export const selectAddress = suggestion => {
  return {
    type: SELECT_ADDRESS,
    address: suggestion,
  };
};

