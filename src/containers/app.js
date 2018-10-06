import { h } from 'preact';
import { Provider } from 'preact-redux';
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

export default () => {
  return (
    <Provider store={store}>
      <div id="app">
        <Helmet
          defaultTitle="Hitta skyddsrum"
          titleTemplate="%s - Hitta skyddsrum"
        />
        <div className={style.maximize}>
          <Sidenav />
          <div className="mdc-drawer-app-content">
            <Routes history={history} />
          </div>
          <ErrorDialog />
        </div>
      </div>
    </Provider>
  );
};
