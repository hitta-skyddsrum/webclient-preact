import { combineReducers } from 'redux';
import { routerReducer } from 'preact-router-redux';

import SearchBox from './containers/search-box/reducer';
import Shelters from './containers/shelters/reducer';

export default combineReducers({
  SearchBox,
  Shelters,
  routing: routerReducer,
});
