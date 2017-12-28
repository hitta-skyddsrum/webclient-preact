import { combineReducers } from 'redux';

import SearchBox from './containers/search-box/reducer';
import Shelters from './containers/shelters/reducer';

export default combineReducers({
  SearchBox,
  Shelters,
});
