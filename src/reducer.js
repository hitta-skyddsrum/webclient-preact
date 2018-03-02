import { combineReducers } from 'redux';
import { routerReducer } from 'preact-router-redux';

import Shelters from './containers/shelters/reducer';

export default combineReducers({
  Shelters,
  routing: routerReducer,
});
