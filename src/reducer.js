import { combineReducers } from 'redux';
import { routerReducer } from 'preact-router-redux';

import SearchBox from './containers/search-box/reducer';
import Shelters from './containers/shelters/reducer';
import Tooltip from './containers/tooltip/reducer';

export default combineReducers({
  SearchBox,
  Shelters,
  Tooltip,
  routing: routerReducer,
});
