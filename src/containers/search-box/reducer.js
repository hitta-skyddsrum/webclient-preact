import {
  GET_CURRENT_POSITION,
  GET_CURRENT_POSITION_FAILED,
  GET_CURRENT_POSITION_SUCCESS,
} from './types';

const initialState = {
  loadingGeo: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CURRENT_POSITION:
      return {
        ...state,
        loadingGeo: true,
      };
    case GET_CURRENT_POSITION_FAILED:
      return {
        ...state,
        loadingGeo: false,
      };
    case GET_CURRENT_POSITION_SUCCESS:
      return {
        ...state,
        loadingGeo: false,
      };
  }

  return state;
};
