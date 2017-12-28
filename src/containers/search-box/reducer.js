import {
  FETCH_ADDRESS_SUGGESTIONS_SUCCESS,
  FETCH_ADDRESS_SUGGESTIONS_FAILED,
  SET_ADDRESS,
} from './types';

const initState = {
  addressSuggestions: [],
};

export default (state = initState, action) => {
  switch (action.type) {
    case FETCH_ADDRESS_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        addressSuggestions: action.addressSuggestions,
      };
    case FETCH_ADDRESS_SUGGESTIONS_FAILED:
      return {
        ...state,
        error: action.error,
      };
    case SET_ADDRESS:
      return {
        ...state,
        address: action.address,
      };
    default:
      return state;
  }
};
