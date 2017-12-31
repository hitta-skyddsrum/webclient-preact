import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import hittaSkyddsrumApp from './reducer';

let root;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(hittaSkyddsrumApp, composeEnhancers(
  applyMiddleware(thunk)
));

function init() {
  let App = require('./components/app').default;

  root = render(<Provider store={store}><App/></Provider>, document.body, root);
}

// in development, set up HMR:
if (module.hot) {
  //require('preact/devtools');   // turn this on if you want to enable React DevTools!
  module.hot.accept('./components/app', () => requestAnimationFrame(init));
}

init();
