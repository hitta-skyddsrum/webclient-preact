import { h } from 'preact';
import { Router } from 'preact-router';
import { Provider } from 'preact-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { syncHistoryWithStore } from 'preact-router-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Helmet from 'preact-helmet';

import hittaSkyddsrumApp from '../reducer';
import browserHistory from '../history';
import Home from '../components/home';
import Shelters from './shelters';
import Redirect from './redirect/index';
import Sidenav from '../components/sidenav';

import '../style/index.scss';
import style from './style.scss';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(hittaSkyddsrumApp, composeEnhancers(
  applyMiddleware(thunk)
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
              <Shelters path="skyddsrum/:id?" />
            </Router>
          </div>
        </MuiThemeProvider>
      </div>
    </Provider>
  );
};
