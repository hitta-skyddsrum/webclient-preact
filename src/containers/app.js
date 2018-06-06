import { h } from 'preact';
import { Provider } from 'preact-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Helmet from 'preact-helmet';
import { syncHistoryWithStore } from 'preact-router-redux';

import hittaSkyddsrumApp from '../reducer';
import browserHistory from '../history';
import Sidenav from '../components/sidenav';
import Routes from './routes';

import '../style/index.scss';
import style from './style.scss';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let middlewares = [thunk];

if (process.env.NODE_ENV !== 'development') {
  const createRavenMiddleware = require('raven-for-redux');
  const Raven = require('raven-js');

  Raven.config(process.env.SENTRY_DSN, {
    environment: process.env.NODE_ENV,
    release: process.env.COMMITHASH,
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
          <div className={style.maximize}>
            <Sidenav location={history.location} />
            <Routes history={history} />
          </div>
        </MuiThemeProvider>
      </div>
    </Provider>
  );
};
