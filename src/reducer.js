import { combineReducers } from 'redux';
import { routerReducer } from 'preact-router-redux';

import Shelters from './containers/shelters/reducer';
import Tooltip from './containers/tooltip/reducer';

export default combineReducers({
  Shelters,
  Tooltip,
  routing: routerReducer,
});
