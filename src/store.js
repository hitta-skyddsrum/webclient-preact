import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import hittaSkyddsrumApp from './reducer';

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

export default createStore(hittaSkyddsrumApp, composeEnhancers(
  applyMiddleware(...middlewares)
));
