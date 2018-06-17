import { HIDE_TOOLTIP } from './types';

export default (state = {}, action) => {
  switch (action.type) {
    case HIDE_TOOLTIP: {
      const subState = state[action.id] || {};

      return {
        ...state,
        [action.id]: {
          ...subState,
          hidden: true,
        },
      };
    }
  }

  return state;
};
