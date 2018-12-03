import { HIDE_TOOLTIP } from '../../containers/tooltip/types';

const storageKey = 'redux_store';

const getInitialState = () => {
  let initialState;

  try {
    initialState = JSON.parse(localStorage.getItem(storageKey));
  } catch (e) {}

  return initialState || {};
};

export { getInitialState };

export default store => next => action => {
  const result = next(action);

  try {
    if (!window.localStorage) {
      throw Error();
    }
  } catch (err) {
    return result;
  }

  switch (action.type) {
    case HIDE_TOOLTIP: {
      setTimeout(() => {
        const { Tooltip } = store.getState();
        localStorage.setItem(storageKey, JSON.stringify({
          Tooltip,
        }));
      });
    }
      break;
  }

  return result;
};
