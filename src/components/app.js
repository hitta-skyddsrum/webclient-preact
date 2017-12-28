import { h } from 'preact';
import { Router } from 'preact-router';

import Home from './home';
import Shelters from '../containers/shelters';
import Redirect from '../containers/redirect/index';

import '../style/index.scss';

export default () => {
  return (
    <div id="app">
      <Router>
        <Home path="/" />
        <Redirect path="skyddsrum/koordinater/:lat/:lon" to="skyddsrum?lat=:lat&lon=:lon" />
        <Shelters path="skyddsrum" />
      </Router>
    </div>
  );
};
