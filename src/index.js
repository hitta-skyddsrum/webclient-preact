import { h, render } from 'preact';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/scan';

const action$ = new Subject();

const initState = { name: 'Harry' };

// Redux reducer
const reducer = (state, action) => {
  console.log('name changed');
  switch (action.type) {
    case 'NAME_CHANGED':
      return {
        ...state,
        name: action.payload,
      };
    default:
      return state;
  }
};

// Reduxification
const store$ = action$
  .startWith(initState)
  .scan(reducer);

// Higher order function to send actions to the stream
const actionDispatcher = (func) =>
  (...args) => {
    console.log('disp');
    action$.next(func(...args));
  };

let root;

function init() {
  let App = require('./components/app').default;

  root = render(<App store$={store$} actionDispatcher={actionDispatcher}/>, document.body, root);
}

// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV === 'production') {
  require('./pwa');
}

// in development, set up HMR:
if (module.hot) {
  //require('preact/devtools');   // turn this on if you want to enable React DevTools!
  module.hot.accept('./components/app', () => requestAnimationFrame(init));
}

init();
