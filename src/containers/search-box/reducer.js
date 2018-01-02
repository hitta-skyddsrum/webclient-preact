import {
  FETCH_ADDRESS_SUGGESTIONS,
  FETCH_ADDRESS_SUGGESTIONS_SUCCESS,
  FETCH_ADDRESS_SUGGESTIONS_FAILED,
  SET_ADDRESS,
  CLEAR_SUGGESTIONS,
} from './types';

const initState = {
  addressSuggestions: [],
  loading: 0,
};

export default (state = initState, action) => {
  switch (action.type) {
    case FETCH_ADDRESS_SUGGESTIONS:
      return {
        ...state,
        loading: state.loading + 1,
      };
    case FETCH_ADDRESS_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        addressSuggestions: action.addressSuggestions,
        loading: state.loading - 1,
      };
    case FETCH_ADDRESS_SUGGESTIONS_FAILED:
      return {
        ...state,
        error: action.error,
        loading: state.loading - 1,
      };
    case SET_ADDRESS:
      return {
        ...state,
        address: action.address,
      };
    case CLEAR_SUGGESTIONS:
      return {
        ...state,
        addressSuggestions: [],
      };
    default:
      return state;
  }
};
