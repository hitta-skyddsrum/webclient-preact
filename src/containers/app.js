import { h } from 'preact';
import { Router } from 'preact-router';
import AsyncRoute from 'preact-async-route';
import { Provider } from 'preact-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { syncHistoryWithStore } from 'preact-router-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Helmet from 'preact-helmet';

import hittaSkyddsrumApp from '../reducer';
import browserHistory from '../history';
import Home from './home';
import Shelters from './shelters';
import VadArEttSkyddsrum from '../components/vad-ar-ett-skyddsrum';
import OmTjansten from '../components/om-tjansten';
import Redirect from './redirect/index';
import Sidenav from '../components/sidenav';

import '../style/index.scss';
import style from './style.scss';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let middlewares = [thunk];

if (process.env.NODE_ENV !== 'development') {
  const createRavenMiddleware = require('raven-for-redux');
  const Raven = require('raven-js');

  Raven.config(process.env.SENTRY_DSN, {
    environment: process.env.NODE_ENV,
    tags: {
      git_commit: process.env.COMMITHASH,
    },
  }).install();

  middlewares.push(createRavenMiddleware(Raven));
}

const store = createStore(hittaSkyddsrumApp, composeEnhancers(
  applyMiddleware(...middlewares)
));
const history = syncHistoryWithStore(browserHistory, store);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: style.primaryColor,
    },
    secondary: {
      main: style.secondaryColor,
    },
  },
});

export default () => {
  return (
    <Provider store={store}>
      <div id="app">
        <Helmet
          defaultTitle="Hitta skyddsrum"
          titleTemplate="%s - Hitta skyddsrum"
        />
        <MuiThemeProvider theme={theme}>
          <div>
            <Sidenav location={history.location} />
            <Router history={history}>
              <Home path="/" />
              <Redirect path="skyddsrum/koordinater/:lat/:lon" to="skyddsrum?lat=:lat&lon=:lon" />
              <AsyncRoute component={Shelters} path="skyddsrum/:id?" />
              <VadArEttSkyddsrum path="vad-ar-ett-skyddsrum" />
              <OmTjansten path="om-tjansten" />
            </Router>
          </div>
        </MuiThemeProvider>
      </div>
    </Provider>
  );
};
