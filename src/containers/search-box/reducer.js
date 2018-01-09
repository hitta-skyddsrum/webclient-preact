import { getSearchParam } from '../../lib/url-parser';
import {
  FETCH_ADDRESS_SUGGESTIONS,
  FETCH_ADDRESS_SUGGESTIONS_SUCCESS,
  FETCH_ADDRESS_SUGGESTIONS_FAILED,
  SELECT_ADDRESS,
} from './types';

const initState = {
  suggestions: [],
  loading: 0,
};

export default (state = initState, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return {
        ...state,
        lat: getSearchParam(action.payload.search, 'lat'),
        lon: getSearchParam(action.payload.search, 'lon'),
      };
    case FETCH_ADDRESS_SUGGESTIONS:
      return {
        ...state,
        loading: state.loading + 1,
      };
    case FETCH_ADDRESS_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        suggestions: action.suggestions,
        loading: state.loading - 1,
      };
    case FETCH_ADDRESS_SUGGESTIONS_FAILED:
      return {
        ...state,
        error: action.error,
        loading: state.loading - 1,
      };
    case SELECT_ADDRESS:
      return {
        ...state,
        selectedAddress: action.address,
        suggestions: [],
      };
    default:
      return state;
  }
};
