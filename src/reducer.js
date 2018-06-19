import { combineReducers } from 'redux';
import { routerReducer } from 'preact-router-redux';

import ErrorDialog from './containers/error-dialog/reducer';
import SearchBox from './containers/search-box/reducer';
import Shelters from './containers/shelters/reducer';
import Tooltip from './containers/tooltip/reducer';

export default combineReducers({
  ErrorDialog,
  SearchBox,
  Shelters,
  Tooltip,
  routing: routerReducer,
});
