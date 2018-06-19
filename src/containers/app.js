import { h } from 'preact';
import { Provider } from 'preact-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { syncHistoryWithStore } from 'preact-router-redux';
import Helmet from 'preact-helmet';

import store from '../store';
import browserHistory from '../history';
import Sidenav from '../components/sidenav';
import ErrorDialog from './error-dialog';
import Routes from './routes';

import '../style/index.scss';
import style from './style.scss';

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
            <ErrorDialog />
          </div>
        </MuiThemeProvider>
      </div>
    </Provider>
  );
};
