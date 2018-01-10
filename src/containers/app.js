import { h } from 'preact';
import { Router } from 'preact-router';
import { Provider } from 'preact-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { syncHistoryWithStore } from 'preact-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import hittaSkyddsrumApp from '../reducer';
import browserHistory from '../history';
import Home from '../components/home';
import Shelters from './shelters';
import Redirect from './redirect/index';

import '../style/index.scss';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(hittaSkyddsrumApp, composeEnhancers(
  applyMiddleware(thunk)
));
const history = syncHistoryWithStore(browserHistory, store);

export default () => {
  return (
    <Provider store={store}>
      <div id="app">
        <MuiThemeProvider>
          <Router history={history}>
            <Home path="/" />
            <Redirect path="skyddsrum/koordinater/:lat/:lon" to="skyddsrum?lat=:lat&lon=:lon" />
            <Shelters path="skyddsrum/:id?" />
          </Router>
        </MuiThemeProvider>
      </div>
    </Provider>
  );
};